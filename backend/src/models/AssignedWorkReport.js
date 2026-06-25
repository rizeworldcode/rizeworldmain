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
    },
    // Marks whether this was an extra/bonus task assigned beyond regular work
    isExtra: {
      type: Boolean,
      default: false
    }
  }],

  // Base progress (0–100) from regular tasks only
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0
  },

  // Bonus progress from completed extra tasks (e.g. 25 means total is 125%)
  bonusProgressPercentage: {
    type: Number,
    default: 0,
    min: 0
  },

  // Total combined: progressPercentage + bonusProgressPercentage (can exceed 100)
  totalProgressPercentage: {
    type: Number,
    default: 0,
    min: 0
  },

  submittedBy: {
    type: String,
    default: 'Admin'
  }
}, {
  timestamps: true
});

// One report per staff per day
assignedWorkReportSchema.index({ staffId: 1, date: 1 }, { unique: true });

// Virtual: separate regular and extra tasks
assignedWorkReportSchema.virtual('regularTasks').get(function () {
  return this.tasks.filter(t => !t.isExtra);
});

assignedWorkReportSchema.virtual('extraTasks').get(function () {
  return this.tasks.filter(t => t.isExtra);
});

// Auto-calculate all three progress fields before saving
assignedWorkReportSchema.pre('save', function (next) {
  const regularTasks = this.tasks.filter(t => !t.isExtra);
  const extraTasks = this.tasks.filter(t => t.isExtra);

  const completedRegular = regularTasks.filter(t => t.completed).length;
  const completedExtra = extraTasks.filter(t => t.completed).length;
  const totalRegular = regularTasks.length;

  if (totalRegular === 0) {
    // No regular tasks — bonus tasks each contribute 25%
    this.progressPercentage = 0;
    this.bonusProgressPercentage = completedExtra * 25;
  } else {
    this.progressPercentage = Math.round((completedRegular / totalRegular) * 100);
    this.bonusProgressPercentage = Math.round((completedExtra / totalRegular) * 100);
  }

  this.totalProgressPercentage = this.progressPercentage + this.bonusProgressPercentage;
  next();
});

module.exports = mongoose.model('AssignedWorkReport', assignedWorkReportSchema);