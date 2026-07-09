const Transaction = require('../models/Transaction');
const Staff = require('../models/Staff');
const Client = require('../models/Client');

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

    // --- 1. Fetch from Transaction model ---
    let query = {};
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    // --- 2. Fetch client payment history ---
    // Only fetch client payments if type is not 'expense' (they're always income)
    let clientPayments = [];
    if (!type || type === 'income' || type === 'client_payment') {
      const clients = await Client.find({}, 'name email payments');

      clients.forEach(client => {
        (client.payments || []).forEach(payment => {
          const paymentDate = new Date(payment.date);

          // Apply date filter if provided
          if (startDate && paymentDate < new Date(startDate)) return;
          if (endDate && paymentDate > new Date(endDate + 'T23:59:59.999Z')) return;

          clientPayments.push({
            _id: payment._id,
            type: 'client_payment',
            name: client.name,
            amount: payment.amount,
            date: payment.date,
            mode: payment.mode,
            method: payment.mode?.toLowerCase() === 'online' ? 'bank_transfer' : 'cash',
            utrNumber: payment.utr || null,
            referenceId: client._id,
            referenceModel: 'Client',
            description: `Payment from client: ${client.name}`,
            source: 'client_payment', // flag to distinguish in frontend
            createdAt: payment.date,
          });
        });
      });
    }

    // --- 3. Merge and sort by date descending ---
    const allTransactions = [
      ...transactions.map(t => ({ ...t.toObject(), source: t.type })),
      ...clientPayments,
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

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
      return res.status(200).json({
        success: true,
        data: updatedTransaction,
      });
    }

    // 2. If not found in Transaction collection, check if it's a client payment
    const client = await Client.findOne({ "payments._id": req.params.id });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const paymentIndex = client.payments.findIndex(p => p._id.toString() === req.params.id);
    if (paymentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found in client record',
      });
    }

    const payment = client.payments[paymentIndex];
    const oldAmount = Number(payment.amount);
    const newAmount = amount !== undefined ? parseFloat(amount) : oldAmount;
    
    // Check if new amount exceeds limit
    const diff = newAmount - oldAmount;
    const currentPending = Number(client.pendingAmount);
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

    // Update Client fields
    client.paidAmount = Number(client.paidAmount) + diff;
    client.pendingAmount = Number(client.pendingAmount) - diff;

    // Update subdocument
    payment.amount = newAmount;
    if (date) payment.date = new Date(date);
    if (mode) payment.mode = mode === 'cash' ? 'Cash' : 'Online';
    if (utrNumber !== undefined) payment.utr = mode === 'cash' ? '' : utrNumber;

    await client.save();

    // Map client payment structure to match transaction shape for response
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
      referenceModel: 'Client',
      description: `Payment from client: ${client.name}`,
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
      return res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully',
      });
    }

    // 2. If not found, check if it's a client payment
    const client = await Client.findOne({ "payments._id": req.params.id });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Find the specific payment to revert amounts
    const paymentIndex = client.payments.findIndex(p => p._id.toString() === req.params.id);
    if (paymentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found in client record',
      });
    }

    const payment = client.payments[paymentIndex];
    client.paidAmount = Number(client.paidAmount) - Number(payment.amount);
    client.pendingAmount = Number(client.pendingAmount) + Number(payment.amount);
    client.payments.splice(paymentIndex, 1);

    await client.save();

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
