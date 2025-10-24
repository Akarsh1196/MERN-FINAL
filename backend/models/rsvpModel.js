const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  response: {
    type: String,
    enum: ['Yes', 'No', 'Maybe'],
    required: [true, 'Please provide a response']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [200, 'Message cannot be more than 200 characters']
  },
  plusOnes: {
    type: Number,
    default: 0,
    min: [0, 'Plus ones cannot be negative']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Ensure one RSVP per user per event
rsvpSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('RSVP', rsvpSchema);
