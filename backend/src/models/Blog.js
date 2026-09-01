const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Blog slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  subheading: {
    type: String,
    trim: true,
    default: ''
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  coverImage: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  authorName: {
    type: String,
    default: 'Marketing Team'
  },
  authorRole: {
    type: String,
    default: ''
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  department: {
    type: String,
    default: 'Marketing'
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Published'
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
