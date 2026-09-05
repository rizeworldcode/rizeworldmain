const mongoose = require('mongoose');

const delayWorkSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['reel', 'post', 'shoot', 'extra'],
    required: true
  },
  extra: {
    type: Boolean,
    default: false
  },
  extraName: {
    type: String,
    trim: true
  },
  count: {
    type: Number,
    default: 1
  },
  publishedLink: {
    type: String,
    trim: true
  },
  totalAccountReach: {
    type: mongoose.Schema.Types.Mixed,
    default: '0'
  },
  totalAccountViews: {
    type: mongoose.Schema.Types.Mixed,
    default: '0'
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  }
}, {
  timestamps: true
});

delayWorkSchema.index({ staffId: 1, createdAt: -1 });
delayWorkSchema.index({ clientId: 1, createdAt: -1 });
delayWorkSchema.index({ createdAt: -1 });

module.exports = mongoose.model('DelayWork', delayWorkSchema);
