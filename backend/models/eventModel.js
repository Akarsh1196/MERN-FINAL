const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide an event description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please provide an event date']
  },
  time: {
    type: String,
    required: [true, 'Please provide an event time']
  },
  location: {
    type: String,
    required: [true, 'Please provide an event location'],
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inviteLink: {
    type: String,
    unique: true,
    default: function() {
      return uuidv4();
    }
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxAttendees: {
    type: Number,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['party', 'meeting', 'conference', 'wedding', 'birthday', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Event', eventSchema);
