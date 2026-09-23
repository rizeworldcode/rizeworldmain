const mongoose = require('mongoose');
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

// Helper to find client and payment for either standard ObjectId or synthetic composite IDs
async function findClientAndPayment(id) {
  let client = null;
  let payment = null;
  let paymentIndex = -1;
  let isHistory = false;
  let historyIndex = -1;
  let modelName = 'Client';
  let isDirectPayment = false;

  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

  if (isValidObjectId) {
    // 1. Check active client current payments
    client = await Client.findOne({ "payments._id": id });
    if (client) {
      paymentIndex = client.payments.findIndex(p => p._id && p._id.toString() === id);
      if (paymentIndex !== -1) payment = client.payments[paymentIndex];
    } else {
      // 2. Check active client history payments
      client = await Client.findOne({ "history.payments._id": id });
      if (client) {
        isHistory = true;
        for (let i = 0; i < (client.history || []).length; i++) {
          const hpIdx = (client.history[i].payments || []).findIndex(p => p._id && p._id.toString() === id);
          if (hpIdx !== -1) {
            payment = client.history[i].payments[hpIdx];
            paymentIndex = hpIdx;
            historyIndex = i;
            break;
          }
        }
      }
    }

    // 3. Check old client
    if (!client || !payment) {
      let oldClient = await OldClient.findOne({ "payments._id": id });
      if (oldClient) {
        modelName = 'OldClient';
        client = oldClient;
        paymentIndex = client.payments.findIndex(p => p._id && p._id.toString() === id);
        if (paymentIndex !== -1) payment = client.payments[paymentIndex];
      } else {
        oldClient = await OldClient.findOne({ "history.payments._id": id });
        if (oldClient) {
          modelName = 'OldClient';
          client = oldClient;
          isHistory = true;
          for (let i = 0; i < (client.history || []).length; i++) {
            const hpIdx = (client.history[i].payments || []).findIndex(p => p._id && p._id.toString() === id);
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
  }

  // 4. If not found and ID is composite (e.g. clientId_amount_timestamp or clientId_direct_payment)
  if (!client || !payment) {
    const parts = (id || '').split('_');
    const targetClientId = parts[0];
    if (mongoose.Types.ObjectId.isValid(targetClientId)) {
      client = await Client.findById(targetClientId);
      if (!client) {
        client = await OldClient.findById(targetClientId);
        if (client) modelName = 'OldClient';
      }

      if (client) {
        if (parts[1] === 'direct' && parts[2] === 'payment') {
          isDirectPayment = true;
          payment = {
            _id: id,
            amount: Number(client.paidAmount || 0),
            date: client.startDate || client.createdAt || new Date(),
            mode: 'Online'
          };
        } else if (parts.length >= 3) {
          const targetAmount = Number(parts[1]);
          const targetTime = Number(parts[2]);

          // Check current payments
          for (let i = 0; i < (client.payments || []).length; i++) {
            const p = client.payments[i];
            const pTime = p.date ? new Date(p.date).getTime() : 0;
            if (Number(p.amount) === targetAmount && (!targetTime || Math.abs(pTime - targetTime) < 60000 || pTime === targetTime)) {
              payment = p;
              paymentIndex = i;
              isHistory = false;
              break;
            }
          }

          // Check history payments
          if (!payment) {
            for (let i = 0; i < (client.history || []).length; i++) {
              const hPayments = client.history[i].payments || [];
              for (let j = 0; j < hPayments.length; j++) {
                const p = hPayments[j];
                const pTime = p.date ? new Date(p.date).getTime() : 0;
                if (Number(p.amount) === targetAmount && (!targetTime || Math.abs(pTime - targetTime) < 60000 || pTime === targetTime)) {
                  payment = p;
                  paymentIndex = j;
                  isHistory = true;
                  historyIndex = i;
                  break;
                }
              }
              if (payment) break;
            }
          }
        }
      }
    }
  }

  return { client, payment, paymentIndex, isHistory, historyIndex, modelName, isDirectPayment };
}

exports.getTransactionById = async (req, res) => {
  try {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    let transaction = isValidId ? await Transaction.findById(req.params.id) : null;
    if (transaction) {
      return res.status(200).json({
        success: true,
        data: transaction,
      });
    }

    const { client, payment, modelName } = await findClientAndPayment(req.params.id);
    if (!client || !payment) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const paymentResponse = {
      _id: payment._id || req.params.id,
      type: 'client_payment',
      name: client.name,
      amount: payment.amount,
      date: payment.date,
      mode: payment.mode,
      method: (payment.mode || '').toLowerCase() === 'online' ? 'bank_transfer' : 'cash',
      utrNumber: payment.utr || null,
      referenceId: client._id,
      referenceModel: modelName,
      description: `Payment from ${modelName === 'OldClient' ? 'old client' : 'client'}: ${client.name}`,
      source: 'client_payment',
      createdAt: payment.date,
    };

    res.status(200).json({
      success: true,
      data: paymentResponse,
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

    // 1. Try to update in Transaction collection if valid ObjectId
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    let transaction = isValidId ? await Transaction.findById(req.params.id) : null;
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
    const { client, payment, isHistory, historyIndex, modelName, isDirectPayment } = await findClientAndPayment(req.params.id);

    if (!client || !payment) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const oldAmount = Number(payment.amount || 0);
    const newAmount = amount !== undefined ? parseFloat(amount) : oldAmount;
    const diff = newAmount - oldAmount;

    if (isDirectPayment) {
      client.paidAmount = newAmount;
      client.pendingAmount = Math.max(0, Number(client.totalPrice || client.totalAmount || 0) - newAmount);
      await client.save();
    } else if (isHistory && historyIndex >= 0) {
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
      _id: payment._id || req.params.id,
      type: 'client_payment',
      name: client.name,
      amount: payment.amount,
      date: payment.date,
      mode: payment.mode,
      method: (payment.mode || '').toLowerCase() === 'online' ? 'bank_transfer' : 'cash',
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
    // 1. Try to find and delete in Transaction collection if valid ObjectId
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (isValidId) {
      let transaction = await Transaction.findByIdAndDelete(req.params.id);
      if (transaction) {
        cache.flushByPrefix('transactions');
        cache.flushByPrefix('dashboard:');
        return res.status(200).json({
          success: true,
          message: 'Transaction deleted successfully',
        });
      }
    }

    // 2. If not found, check if it's a client payment
    const { client, payment, paymentIndex, isHistory, historyIndex, isDirectPayment } = await findClientAndPayment(req.params.id);

    if (!client || !payment) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const paymentAmount = Number(payment.amount || 0);

    if (isDirectPayment) {
      client.paidAmount = Math.max(0, Number(client.paidAmount || 0) - paymentAmount);
      client.pendingAmount = Math.max(0, Number(client.totalPrice || client.totalAmount || 0) - client.paidAmount);
      await client.save();
    } else if (isHistory && historyIndex >= 0) {
      const histItem = client.history[historyIndex];
      histItem.paidAmount = Math.max(0, Number(histItem.paidAmount || 0) - paymentAmount);
      const hTotal = Number(histItem.totalPrice !== undefined ? histItem.totalPrice : (histItem.totalAmount !== undefined ? histItem.totalAmount : 0));
      histItem.pendingAmount = Math.max(0, hTotal - histItem.paidAmount);
      if (paymentIndex >= 0) {
        histItem.payments.splice(paymentIndex, 1);
      }
      client.markModified('history');
      await client.save();
    } else {
      client.paidAmount = Math.max(0, Number(client.paidAmount) - paymentAmount);
      client.pendingAmount = Number(client.pendingAmount) + paymentAmount;
      if (paymentIndex >= 0) {
        client.payments.splice(paymentIndex, 1);
      }
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
