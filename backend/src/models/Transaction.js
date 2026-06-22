const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['salary', 'client_payment'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  mode: {
    type: String,
    enum: ['cash', 'online'],
    required: true,
  },
  method: {
    type: String,
    enum: ['phonepe', 'paytm', 'google_pay', 'bank_transfer', 'cash'],
    required: true,
  },
  utrNumber: {
    type: String,
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceModel',
  },
  referenceModel: {
    type: String,
    enum: ['Staff', 'Client'],
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);
