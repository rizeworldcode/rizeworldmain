const mongoose = require('mongoose');

const masterPoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  staffRole: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

masterPoolSchema.index({ staffId: 1, createdAt: -1 });

module.exports = mongoose.model('MasterPool', masterPoolSchema);
