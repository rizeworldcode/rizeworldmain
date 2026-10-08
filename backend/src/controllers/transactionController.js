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

  if (!id) return { client: null, payment: null, paymentIndex: -1, isHistory: false, historyIndex: -1, modelName: 'Client', isDirectPayment: false };

  const idStr = String(id).trim();

  // 1. Direct MongoDB ObjectId search if it's a valid 24-char hex ObjectId
  if (mongoose.Types.ObjectId.isValid(idStr) && idStr.length === 24) {
    const objId = new mongoose.Types.ObjectId(idStr);

    // Check Client (both current and history payments, querying both string and ObjectId)
    client = await Client.findOne({
      $or: [
        { "payments._id": idStr },
        { "payments._id": objId },
        { "history.payments._id": idStr },
        { "history.payments._id": objId }
      ]
    });

    if (client) {
      paymentIndex = (client.payments || []).findIndex(p => p._id && p._id.toString() === idStr);
      if (paymentIndex !== -1) {
        payment = client.payments[paymentIndex];
        return { client, payment, paymentIndex, isHistory: false, historyIndex: -1, modelName: 'Client', isDirectPayment: false };
      }

      for (let i = 0; i < (client.history || []).length; i++) {
        const hpIdx = (client.history[i].payments || []).findIndex(p => p._id && p._id.toString() === idStr);
        if (hpIdx !== -1) {
          return {
            client,
            payment: client.history[i].payments[hpIdx],
            paymentIndex: hpIdx,
            isHistory: true,
            historyIndex: i,
            modelName: 'Client',
            isDirectPayment: false
          };
        }
      }
    }

    // Check OldClient (both current and history payments)
    let oldClient = await OldClient.findOne({
      $or: [
        { "payments._id": idStr },
        { "payments._id": objId },
        { "history.payments._id": idStr },
        { "history.payments._id": objId }
      ]
    });

    if (oldClient) {
      paymentIndex = (oldClient.payments || []).findIndex(p => p._id && p._id.toString() === idStr);
      if (paymentIndex !== -1) {
        return {
          client: oldClient,
          payment: oldClient.payments[paymentIndex],
          paymentIndex,
          isHistory: false,
          historyIndex: -1,
          modelName: 'OldClient',
          isDirectPayment: false
        };
      }

      for (let i = 0; i < (oldClient.history || []).length; i++) {
        const hpIdx = (oldClient.history[i].payments || []).findIndex(p => p._id && p._id.toString() === idStr);
        if (hpIdx !== -1) {
          return {
            client: oldClient,
            payment: oldClient.history[i].payments[hpIdx],
            paymentIndex: hpIdx,
            isHistory: true,
            historyIndex: i,
            modelName: 'OldClient',
            isDirectPayment: false
          };
        }
      }
    }
  }

  // 2. Structured ID matching (e.g. cp_clientId_curr_0, cp_clientId_hist_0_1, cp_clientId_direct)
  if (idStr.includes('_curr_') || idStr.includes('_hist_') || idStr.endsWith('_direct') || idStr.endsWith('_direct_payment')) {
    if (idStr.includes('_curr_')) {
      const parts = idStr.split('_curr_');
      const targetClientId = parts[0].replace(/^cp_|^client_payment_/, '');
      const pIdx = parseInt(parts[1], 10);

      client = await Client.findById(targetClientId) || await OldClient.findById(targetClientId);
      if (client) {
        modelName = client.constructor.modelName || (client.totalPrice !== undefined ? 'Client' : 'OldClient');
        if (client.payments && client.payments[pIdx]) {
          return {
            client,
            payment: client.payments[pIdx],
            paymentIndex: pIdx,
            isHistory: false,
            historyIndex: -1,
            modelName,
            isDirectPayment: false
          };
        }
      }
    } else if (idStr.includes('_hist_')) {
      const parts = idStr.split('_hist_');
      const targetClientId = parts[0].replace(/^cp_|^client_payment_/, '');
      const [hIdxStr, pIdxStr] = parts[1].split('_');
      const hIdx = parseInt(hIdxStr, 10);
      const pIdx = parseInt(pIdxStr, 10);

      client = await Client.findById(targetClientId) || await OldClient.findById(targetClientId);
      if (client) {
        modelName = client.constructor.modelName || (client.totalPrice !== undefined ? 'Client' : 'OldClient');
        if (client.history && client.history[hIdx] && client.history[hIdx].payments && client.history[hIdx].payments[pIdx]) {
          return {
            client,
            payment: client.history[hIdx].payments[pIdx],
            paymentIndex: pIdx,
            isHistory: true,
            historyIndex: hIdx,
            modelName,
            isDirectPayment: false
          };
        }
      }
    } else if (idStr.endsWith('_direct') || idStr.endsWith('_direct_payment')) {
      const targetClientId = idStr.replace(/(_direct|_direct_payment)$/, '').replace(/^cp_|^client_payment_/, '');
      client = await Client.findById(targetClientId) || await OldClient.findById(targetClientId);
      if (client) {
        modelName = client.constructor.modelName || (client.totalPrice !== undefined ? 'Client' : 'OldClient');
        return {
          client,
          payment: {
            _id: idStr,
            amount: Number(client.paidAmount || 0),
            date: client.startDate || client.createdAt || new Date(),
            mode: 'Online'
          },
          paymentIndex: -1,
          isHistory: false,
          historyIndex: -1,
          modelName,
          isDirectPayment: true
        };
      }
    }
  }

  // 3. Fallback: Parse clientId_amount_timestamp format (e.g. 6a6c6bc1e7fdb3465d44f5c9_25000_1788566400000)
  const parts = idStr.split('_');
  const targetClientId = parts[0].replace(/^cp_|^client_payment_/, '');
  if (mongoose.Types.ObjectId.isValid(targetClientId) && targetClientId.length === 24) {
    client = await Client.findById(targetClientId);
    if (!client) {
      client = await OldClient.findById(targetClientId);
      if (client) modelName = 'OldClient';
    }

    if (client) {
      modelName = client.constructor.modelName || (client.totalPrice !== undefined ? 'Client' : 'OldClient');
      const targetAmount = parts.length >= 2 ? Number(parts[1]) : NaN;
      const targetTime = parts.length >= 3 ? Number(parts[2]) : NaN;

      // 3a. Search in client.payments
      for (let i = 0; i < (client.payments || []).length; i++) {
        const p = client.payments[i];
        const pAmount = Number(p.amount);
        const pTime = p.date ? new Date(p.date).getTime() : 0;
        const cTime = client.createdAt ? new Date(client.createdAt).getTime() : 0;

        const amountMatch = isNaN(targetAmount) || pAmount === targetAmount;
        const timeMatch = isNaN(targetTime) || !targetTime ||
          pTime === targetTime || Math.abs(pTime - targetTime) < 86400000 ||
          cTime === targetTime || Math.abs(cTime - targetTime) < 86400000;

        if (amountMatch && timeMatch) {
          return { client, payment: p, paymentIndex: i, isHistory: false, historyIndex: -1, modelName, isDirectPayment: false };
        }
      }

      // 3b. Search in client.history
      for (let i = 0; i < (client.history || []).length; i++) {
        const hPayments = client.history[i].payments || [];
        for (let j = 0; j < hPayments.length; j++) {
          const p = hPayments[j];
          const pAmount = Number(p.amount);
          const pTime = p.date ? new Date(p.date).getTime() : 0;
          const hTime = client.history[i].completedAt ? new Date(client.history[i].completedAt).getTime() : 0;

          const amountMatch = isNaN(targetAmount) || pAmount === targetAmount;
          const timeMatch = isNaN(targetTime) || !targetTime ||
            pTime === targetTime || Math.abs(pTime - targetTime) < 86400000 ||
            hTime === targetTime || Math.abs(hTime - targetTime) < 86400000;

          if (amountMatch && timeMatch) {
            return { client, payment: p, paymentIndex: j, isHistory: true, historyIndex: i, modelName, isDirectPayment: false };
          }
        }
      }

      // 3c. If only amount matches anywhere in payments
      if (!isNaN(targetAmount)) {
        const pIdx = (client.payments || []).findIndex(p => Number(p.amount) === targetAmount);
        if (pIdx !== -1) {
          return { client, payment: client.payments[pIdx], paymentIndex: pIdx, isHistory: false, historyIndex: -1, modelName, isDirectPayment: false };
        }
        for (let i = 0; i < (client.history || []).length; i++) {
          const hpIdx = (client.history[i].payments || []).findIndex(p => Number(p.amount) === targetAmount);
          if (hpIdx !== -1) {
            return { client, payment: client.history[i].payments[hpIdx], paymentIndex: hpIdx, isHistory: true, historyIndex: i, modelName, isDirectPayment: false };
          }
        }
      }

      // 3d. Check if it's the direct paidAmount
      if (Number(client.paidAmount || 0) > 0) {
        return {
          client,
          payment: {
            _id: idStr,
            amount: Number(client.paidAmount || 0),
            date: client.startDate || client.createdAt || new Date(),
            mode: 'Online'
          },
          paymentIndex: -1,
          isHistory: false,
          historyIndex: -1,
          modelName,
          isDirectPayment: true
        };
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
      if (mode) payment.mode = mode.toLowerCase() === 'cash' ? 'Cash' : (mode.toLowerCase() === 'cheque' || mode.toLowerCase() === 'cheq' ? 'Cheque' : 'Online');
      if (utrNumber !== undefined) payment.utr = (payment.mode === 'Cash') ? '' : utrNumber;

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
      if (mode) payment.mode = mode.toLowerCase() === 'cash' ? 'Cash' : (mode.toLowerCase() === 'cheque' || mode.toLowerCase() === 'cheq' ? 'Cheque' : 'Online');
      if (utrNumber !== undefined) payment.utr = (payment.mode === 'Cash') ? '' : utrNumber;

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
      method: (payment.mode || '').toLowerCase() === 'online' ? 'bank_transfer' : ((payment.mode || '').toLowerCase() === 'cheque' ? 'cheque' : 'cash'),
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
    const id = req.params.id;

    // 1. Try to find and delete in Transaction collection if valid ObjectId
    const isValidId = mongoose.Types.ObjectId.isValid(id) && String(id).length === 24;
    if (isValidId) {
      let transaction = await Transaction.findByIdAndDelete(id);
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
    const { client, payment, paymentIndex, isHistory, historyIndex, isDirectPayment } = await findClientAndPayment(id);

    if (!client || !payment) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const paymentAmount = Number(payment.amount || 0);

    if (isDirectPayment) {
      client.paidAmount = Math.max(0, Number(client.paidAmount || 0) - paymentAmount);
      const total = Number(client.totalPrice !== undefined ? client.totalPrice : (client.totalAmount || 0));
      client.pendingAmount = Math.max(0, total - client.paidAmount);
      await client.save();
    } else if (isHistory && historyIndex >= 0) {
      const histItem = client.history[historyIndex];
      histItem.paidAmount = Math.max(0, Number(histItem.paidAmount || 0) - paymentAmount);
      const hTotal = Number(histItem.totalPrice !== undefined ? histItem.totalPrice : (histItem.totalAmount !== undefined ? histItem.totalAmount : 0));
      histItem.pendingAmount = Math.max(0, hTotal - histItem.paidAmount);
      if (paymentIndex >= 0 && Array.isArray(histItem.payments)) {
        histItem.payments.splice(paymentIndex, 1);
      }
      client.markModified('history');
      await client.save();
    } else {
      client.paidAmount = Math.max(0, Number(client.paidAmount || 0) - paymentAmount);
      const total = Number(client.totalPrice !== undefined ? client.totalPrice : (client.totalAmount || 0));
      client.pendingAmount = Math.max(0, total - client.paidAmount);
      if (paymentIndex >= 0 && Array.isArray(client.payments)) {
        client.payments.splice(paymentIndex, 1);
      }
      await client.save();
    }

    cache.flushByPrefix('transactions');
    cache.flushByPrefix('dashboard:');
    cache.flushByPrefix('clients:');
    cache.flushByPrefix('old-clients:');

    res.status(200).json({
      success: true,
      message: 'Client payment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting transaction',
    });
  }
};
