const mongoose = require('mongoose');

const oldClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  projectDetail: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  deliveredDate: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0
  },
  address: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OldClient', oldClientSchema);
