const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Payment Reminder', 'Client Alert', 'Urgent'],
    default: 'Payment Reminder'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  recipientRoles: [{
    type: String,
    enum: ['HR', 'Client Support', 'Admin', 'Staff'],
    required: true
  }],
  readBy: [{
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  oldClientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OldClient'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
