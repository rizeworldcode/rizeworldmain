const mongoose = require('mongoose');

const employeeLocationHistorySchema = new mongoose.Schema({
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
  timestamp: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EmployeeLocationHistory', employeeLocationHistorySchema);
