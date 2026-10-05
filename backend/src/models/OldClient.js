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
  },
  department: { type: String },
  package: { type: String },
  workDetail: { type: String },
  tasks: Array,
  extraTasks: Array,
  history: Array,
  payments: [{
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    mode: { type: String, enum: ['Online', 'Cash'], default: 'Online' },
    utr: { type: String },
    month: { type: String },
    periodFrom: { type: Date },
    periodTo: { type: Date },
  }]
}, {
  timestamps: true
});

oldClientSchema.index({ email: 1 });
oldClientSchema.index({ phone: 1 });
oldClientSchema.index({ department: 1, deliveredDate: -1 });
oldClientSchema.index({ deliveredDate: -1 });
oldClientSchema.index({ createdAt: -1 });
oldClientSchema.index({ 'payments.utr': 1 });

module.exports = mongoose.model('OldClient', oldClientSchema);
