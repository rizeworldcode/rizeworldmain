const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  saleAmount: {
    type: Number,
    required: true
  },
  salesPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  salesPersonName: {
    type: String,
    required: true
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sale', saleSchema);
