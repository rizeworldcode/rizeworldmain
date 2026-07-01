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

module.exports = mongoose.model('MasterPool', masterPoolSchema);
