const mongoose = require('mongoose');

const assignedWorkReportSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  staffName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  tasks: [{
    name: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  progressPercentage: {
    type: Number,
    default: 0
  },
  submittedBy: {
    type: String, // Could be admin ID or name
    default: 'Admin'
  }
}, {
  timestamps: true
});

// Create compound index to ensure one report per staff per day
assignedWorkReportSchema.index({ staffId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('AssignedWorkReport', assignedWorkReportSchema);
