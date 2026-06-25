const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['Employee', 'HR', 'Client Support', 'Admin', 'Data Analyst'],
    default: 'Employee'
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  monthlySalary: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: ['WEB Development', 'SEO', 'Graphic Design', 'SMM', 'Video Editing']
  },
  jobType: {
    type: String,
    required: true,
    enum: ['Permanent', 'Intern', 'Part-time']
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  salaryStatus: {
    type: String,
    enum: ['Paid', 'Pending'],
    default: 'Pending'
  },
  salaryHistory: [{
    month: String, // e.g., "June 2026"
    baseSalary: Number,
    payoutSalary: Number,
    totalLeaves: Number,
    totalHalfDays: Number,
    casualLeavesUsed: { type: Number, default: 0 },
    paidAt: { type: Date, default: Date.now }
  }],
  clock:[{
    date: {
  type: Date,
  default: Date.now
},
    sessions: [{
      clockIn: {
        type: String,
        required: true
      },
      clockOut: {
        type: String,
        default: null
      },
      duration: {
        type: String,
        default: '-'
      }
    }],
    totalHours: {
      type: String,
      default: '-'
    }
  }],
  work:[{
    tasks: [{
      name: {
        type: String,
        required: true
      },
      completed: {
        type: Boolean,
        default: false
      },
      isExtra: {
        type: Boolean,
        default: false
      }
    }],
    date: {
      type: Date,
      default: Date.now
    }
  }],

  clock_status: {
    type: String,
    enum: ['clock_in', 'clock_out'],
    default: 'clock_out'
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'On Leave', 'Clocked Out', 'Half-Day'],
    default: 'Absent'
  },
  attendance: [{
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Present', 'Absent', 'Half-Day', 'On Leave'] }
  }],
  accountHolder: {
    type: String
  },
  accountNumber: {
    type: String
  },
  ifscCode: {
    type: String
  },
  bankName: {
    type: String
  },
  documents: [{
    name: String,
    path: String
  }],
  employeeId: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  authToken: {
    type: String
  },
  totalCasualLeaves: { type: Number, default: 0 },
  leaves: [{
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['Casual', 'Sick', 'Other'], default: 'Casual' }
  }]
}, {
  timestamps: true
});

// Hash password before saving
staffSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
staffSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Staff', staffSchema);
