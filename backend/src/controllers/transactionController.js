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
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
