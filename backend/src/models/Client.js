const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  workDetail: {
    type: String
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  pendingAmount: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date
  },
  deadline: {
    type: Date
  },
  department: {
    type: String,
    required: true
  },
  package: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'On Hold', 'Completed'],
    default: 'Pending'
  },
  payments: [{
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    mode: { type: String, enum: ['Online', 'Cash'], default: 'Online' },
    utr: { type: String }
  }],
  tasks: [{
    name: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    completed: { type: Number, default: 0 },
    total: { type: Number, required: true },
    unit: { type: String }
  }],
  extraTasks: [{
    name: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    completed: { type: Number, default: 0 },
    total: { type: Number, required: true },
    unit: { type: String }
  }],
  history: [{
    package: String,
    workDetail: String,
    totalPrice: Number,
    paidAmount: Number,
    pendingAmount: Number,
    startDate: Date,
    deadline: Date,
    tasks: Array,
    extraTasks: Array,
    payments: Array,
    completedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);
