const Transaction = require('../models/Transaction');
const Staff = require('../models/Staff');
const Client = require('../models/Client');
const OldClient = require('../models/OldClient');
const cache = require('../utils/cache');
const { extractClientPayments } = require('../utils/paymentExtractor');

exports.createTransaction = async (req, res) => {
  try {
    const {
      type,
      name,
      amount,
      date,
      mode,
      method,
      utrNumber,
      referenceId,
      referenceModel,
      description,
    } = req.body;

    const transactionType = type || req.body.source;

    if (mode === 'online') {
      const utrStr = (utrNumber || '').trim();
      if (!utrStr || utrStr.length < 12 || utrStr.length > 16) {
        return res.status(400).json({ success: false, message: 'UTR number must be between 12 and 16 characters for online mode.' });
      }
    }

    let client = null;
    if (referenceId && referenceModel === 'Client') {
      client = await Client.findById(referenceId);
      if (!client) {
        return res.status(404).json({ success: false, message: 'Client not found' });
      }
      const currentPending = Number(client.pendingAmount);
      if (amount > currentPending) {
        return res.status(400).json({
          success: false,
          message: `Transaction amount (₹${amount}) cannot exceed the client's pending amount (₹${currentPending})`
        });
      }
    }

    const transaction = new Transaction({
      type: transactionType,
      name,
      amount,
      date,
      mode,
      method,
      utrNumber: mode === 'online' ? utrNumber : undefined,
      referenceId,
      referenceModel,
      description,
    });

    await transaction.save();

    // Update the respective model if needed
    if (client) {
      client.payments.push({ date, amount, mode, utr: utrNumber });
      client.paidAmount += amount;
      client.pendingAmount -= amount;
      await client.save();
    } else if (referenceId && referenceModel === 'Staff') {
      // For staff, we might want to link to salary history
    }

    cache.flushByPrefix('transactions');
    cache.flushByPrefix('dashboard:');
    cache.flushByPrefix('clients:');

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    const cacheKey = `transactions:${type || 'all'}:${startDate || ''}:${endDate || ''}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        count: cachedData.length,
        data: cachedData
      });
    }

    // --- 1. Fetch from Transaction model ---
    let query = {};
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    const transactions = await Transaction.find(query).sort({ date: -1 }).lean();

    // --- 2. Fetch client payment history ---
    // Only fetch client payments if type is not 'expense' (they're always income)
    let clientPayments = [];
    if (!type || type === 'income' || type === 'client_payment') {
      const [clients, oldClients] = await Promise.all([
        Client.find({}, 'name email payments history startDate createdAt paidAmount').lean(),
        OldClient.find({}, 'name email payments history startDate createdAt paidAmount').lean()
      ]);

      const cp = extractClientPayments(clients, 'Client', startDate, endDate);
      const ocp = extractClientPayments(oldClients, 'OldClient', startDate, endDate);
      clientPayments = [...cp, ...ocp];
    }

    // --- 3. Merge and sort by date descending ---
    const allTransactions = [
      ...transactions.map(t => ({ ...t, source: t.type })),
      ...clientPayments,
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    cache.set(cacheKey, allTransactions, 60);

    res.status(200).json({
      success: true,
      count: allTransactions.length,
      data: allTransactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { type, name, amount, date, mode, method, utrNumber, description } = req.body;

    // 1. Try to update in Transaction collection
    let transaction = await Transaction.findById(req.params.id);
    if (transaction) {
      if (mode === 'online') {
        const utrStr = (utrNumber || '').trim();
        if (!utrStr || utrStr.length < 12 || utrStr.length > 16) {
          return res.status(400).json({ success: false, message: 'UTR number must be between 12 and 16 characters for online mode.' });
        }
      }

      transaction.type = type || transaction.type;
      transaction.name = name || transaction.name;
      transaction.amount = amount !== undefined ? parseFloat(amount) : transaction.amount;
      transaction.date = date || transaction.date;
      transaction.mode = mode || transaction.mode;
      transaction.method = mode === 'cash' ? 'cash' : (method || transaction.method);
      transaction.utrNumber = mode === 'cash' ? undefined : (utrNumber || transaction.utrNumber);
      transaction.description = description !== undefined ? description : transaction.description;

      const updatedTransaction = await transaction.save();

      cache.flushByPrefix('transactions');
      cache.flushByPrefix('dashboard:');

      return res.status(200).json({
        success: true,
        data: updatedTransaction,
      });
    }

    // 2. If not found in Transaction collection, check if it's a client payment
    let client = null;
    let payment = null;
    let isHistory = false;
    let historyIndex = -1;
    let modelName = 'Client';

    // Search active Client current payments
    client = await Client.findOne({ "payments._id": req.params.id });
    if (client) {
      payment = client.payments.find(p => p._id && p._id.toString() === req.params.id);
    } else {
      // Search active Client history payments
      client = await Client.findOne({ "history.payments._id": req.params.id });
      if (client) {
        isHistory = true;
        for (let i = 0; i < (client.history || []).length; i++) {
          const hp = (client.history[i].payments || []).find(p => p._id && p._id.toString() === req.params.id);
          if (hp) {
            payment = hp;
            historyIndex = i;
            break;
          }
        }
      }
    }

    // If not found in Client, search OldClient
    if (!client) {
      let oldClient = await OldClient.findOne({ "payments._id": req.params.id });
      if (oldClient) {
        modelName = 'OldClient';
        client = oldClient;
        payment = client.payments.find(p => p._id && p._id.toString() === req.params.id);
      } else {
        oldClient = await OldClient.findOne({ "history.payments._id": req.params.id });
        if (oldClient) {
          modelName = 'OldClient';
          client = oldClient;
          isHistory = true;
          for (let i = 0; i < (client.history || []).length; i++) {
            const hp = (client.history[i].payments || []).find(p => p._id && p._id.toString() === req.params.id);
            if (hp) {
              payment = hp;
              historyIndex = i;
              break;
            }
          }
        }
      }
    }

    if (!client || !payment) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const oldAmount = Number(payment.amount);
    const newAmount = amount !== undefined ? parseFloat(amount) : oldAmount;
    const diff = newAmount - oldAmount;

    if (isHistory && historyIndex >= 0) {
      const histItem = client.history[historyIndex];
      const currentPending = Number(histItem.pendingAmount !== undefined ? histItem.pendingAmount : 0);
      if (diff > currentPending) {
        return res.status(400).json({
          success: false,
          message: `Updated payment amount exceeds pending client amount by ₹${diff - currentPending}`,
        });
      }

      if (mode === 'online' || (mode === undefined && payment.mode === 'Online')) {
        const finalUtr = utrNumber !== undefined ? utrNumber : payment.utr;
        const utrStr = (finalUtr || '').trim();
        if (!utrStr || utrStr.length < 12 || utrStr.length > 16) {
          return res.status(400).json({ success: false, message: 'UTR number must be between 12 and 16 characters for online payments.' });
        }
      }

      histItem.paidAmount = Number(histItem.paidAmount || 0) + diff;
      histItem.pendingAmount = Math.max(0, currentPending - diff);
      payment.amount = newAmount;
      if (date) payment.date = new Date(date);
      if (mode) payment.mode = mode === 'cash' ? 'Cash' : 'Online';
      if (utrNumber !== undefined) payment.utr = mode === 'cash' ? '' : utrNumber;

      client.markModified('history');
      await client.save();
    } else {
      const currentPending = Number(client.pendingAmount || 0);
      if (diff > currentPending) {
        return res.status(400).json({
          success: false,
          message: `Updated payment amount exceeds pending client amount by ₹${diff - currentPending}`,
        });
      }

      if (mode === 'online' || (mode === undefined && payment.mode === 'Online')) {
        const finalUtr = utrNumber !== undefined ? utrNumber : payment.utr;
        const utrStr = (finalUtr || '').trim();
        if (!utrStr || utrStr.length < 12 || utrStr.length > 16) {
          return res.status(400).json({ success: false, message: 'UTR number must be between 12 and 16 characters for online payments.' });
        }
      }

      client.paidAmount = Number(client.paidAmount) + diff;
      client.pendingAmount = Number(client.pendingAmount) - diff;

      payment.amount = newAmount;
      if (date) payment.date = new Date(date);
      if (mode) payment.mode = mode === 'cash' ? 'Cash' : 'Online';
      if (utrNumber !== undefined) payment.utr = mode === 'cash' ? '' : utrNumber;

      await client.save();
    }

    cache.flushByPrefix('transactions');
    cache.flushByPrefix('dashboard:');
    cache.flushByPrefix('clients:');

    const updatedPaymentResponse = {
      _id: payment._id,
      type: 'client_payment',
      name: client.name,
      amount: payment.amount,
      date: payment.date,
      mode: payment.mode,
      method: payment.mode?.toLowerCase() === 'online' ? 'bank_transfer' : 'cash',
      utrNumber: payment.utr || null,
      referenceId: client._id,
      referenceModel: modelName,
      description: `Payment from ${modelName === 'OldClient' ? 'old client' : 'client'}: ${client.name}`,
      source: 'client_payment',
      createdAt: payment.date,
    };

    res.status(200).json({
      success: true,
      data: updatedPaymentResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    // 1. Try to find and delete in Transaction collection
    let transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (transaction) {
      cache.flushByPrefix('transactions');
      cache.flushByPrefix('dashboard:');
      return res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully',
      });
    }

    // 2. If not found, check if it's a client payment
    let client = null;
    let payment = null;
    let paymentIndex = -1;
    let isHistory = false;
    let historyIndex = -1;

    // Search active Client current payments
    client = await Client.findOne({ "payments._id": req.params.id });
    if (client) {
      paymentIndex = client.payments.findIndex(p => p._id && p._id.toString() === req.params.id);
      if (paymentIndex !== -1) {
        payment = client.payments[paymentIndex];
      }
    } else {
      // Search active Client history payments
      client = await Client.findOne({ "history.payments._id": req.params.id });
      if (client) {
        isHistory = true;
        for (let i = 0; i < (client.history || []).length; i++) {
          const hpIdx = (client.history[i].payments || []).findIndex(p => p._id && p._id.toString() === req.params.id);
          if (hpIdx !== -1) {
            payment = client.history[i].payments[hpIdx];
            paymentIndex = hpIdx;
            historyIndex = i;
            break;
          }
        }
      }
    }

    // If not found in Client, search OldClient
    if (!client || !payment) {
      let oldClient = await OldClient.findOne({ "payments._id": req.params.id });
      if (oldClient) {
        client = oldClient;
        paymentIndex = client.payments.findIndex(p => p._id && p._id.toString() === req.params.id);
        if (paymentIndex !== -1) {
          payment = client.payments[paymentIndex];
        }
      } else {
        oldClient = await OldClient.findOne({ "history.payments._id": req.params.id });
        if (oldClient) {
          client = oldClient;
          isHistory = true;
          for (let i = 0; i < (client.history || []).length; i++) {
            const hpIdx = (client.history[i].payments || []).findIndex(p => p._id && p._id.toString() === req.params.id);
            if (hpIdx !== -1) {
              payment = client.history[i].payments[hpIdx];
              paymentIndex = hpIdx;
              historyIndex = i;
              break;
            }
          }
        }
      }
    }

    if (!client || !payment) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (isHistory && historyIndex >= 0) {
      const histItem = client.history[historyIndex];
      histItem.paidAmount = Math.max(0, Number(histItem.paidAmount || 0) - Number(payment.amount));
      histItem.pendingAmount = Number(histItem.pendingAmount || 0) + Number(payment.amount);
      histItem.payments.splice(paymentIndex, 1);
      client.markModified('history');
      await client.save();
    } else {
      client.paidAmount = Math.max(0, Number(client.paidAmount) - Number(payment.amount));
      client.pendingAmount = Number(client.pendingAmount) + Number(payment.amount);
      client.payments.splice(paymentIndex, 1);
      await client.save();
    }

    cache.flushByPrefix('transactions');
    cache.flushByPrefix('dashboard:');
    cache.flushByPrefix('clients:');

    res.status(200).json({
      success: true,
      message: 'Client payment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
