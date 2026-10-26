const mongoose = require('mongoose');

const companyLeadSchema = new mongoose.Schema({
  unicId: {
    type: String,
    required: [true, 'Unique Lead ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Lead / Contact person name is required'],
    trim: true
  },
  companyName: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  whatsappNumber: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  purpose: {
    type: String,
    trim: true
  },
  leadType: {
    type: String,
    trim: true,
    default: 'Warm'
  },
  leadSource: {
    type: String,
    trim: true,
    default: 'Website'
  },
  enquiryDate: {
    type: Date,
    default: Date.now
  },
  leadStatus: {
    type: String,
    trim: true,
    default: 'New Inquiry'
  },
  leadPersonName: {
    type: String,
    trim: true
  },
  assignedStaffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    default: null
  },
  lastConversation: {
    type: String,
    trim: true
  },
  nextFollowUpDate: {
    type: Date
  },
  nextAction: {
    type: String,
    trim: true,
    default: 'Call'
  },
  lostReason: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  history: [{
    message: String,
    action: String,
    nextFollowUpDate: Date,
    updatedBy: String,
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

companyLeadSchema.index({ phoneNumber: 1 });
companyLeadSchema.index({ leadStatus: 1 });
companyLeadSchema.index({ enquiryDate: -1 });
companyLeadSchema.index({ nextFollowUpDate: 1 });
companyLeadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CompanyLead', companyLeadSchema);
