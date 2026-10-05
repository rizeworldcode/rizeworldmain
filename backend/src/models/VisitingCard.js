const mongoose = require('mongoose');

const visitingCardSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
    index: true
  },
  employeeName: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  cardData: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    company: { type: String, default: '' },
    rawText: { type: String, default: '' }
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

visitingCardSchema.index({ employeeId: 1, timestamp: -1 });
visitingCardSchema.index({ timestamp: -1 });

module.exports = mongoose.model('VisitingCard', visitingCardSchema);
