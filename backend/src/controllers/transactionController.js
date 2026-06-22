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

    const transaction = new Transaction({
      type,
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
    if (referenceId && referenceModel) {
      if (referenceModel === 'Client') {
        await Client.findByIdAndUpdate(referenceId, {
          $push: { payments: { date, amount, mode, utr: utrNumber } },
          $inc: { paidAmount: amount, pendingAmount: -amount },
        });
      } else if (referenceModel === 'Staff') {
        // For staff, we might want to link to salary history
      }
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
    let query = {};

    if (type) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
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
