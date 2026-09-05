const mongoose = require('mongoose');

const studentAdmissionSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  counselorName: {
    type: String,
    required: true
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  courseInterested: {
    type: String
  },
  status: {
    type: String,
    enum: ['Lead', 'Interested', 'Enrolled', 'Lost'],
    default: 'Lead'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

studentAdmissionSchema.index({ counselorId: 1, createdAt: -1 });
studentAdmissionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('StudentAdmission', studentAdmissionSchema);
