const mongoose = require('mongoose');

const employeeLiveLocationSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
    unique: true,
    index: true
  },
  employeeName: {
    type: String,
    required: true
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
  speed: {
    type: Number
  },
  heading: {
    type: Number
  },
  deviceInfo: {
    type: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EmployeeLiveLocation', employeeLiveLocationSchema);
