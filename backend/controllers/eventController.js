const Event = require('../models/eventModel');
const RSVP = require('../models/rsvpModel');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    let query = { status: 'active' };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      count: events.length,
      total,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get RSVP counts
    const rsvpCounts = await RSVP.aggregate([
      { $match: { eventId: event._id } },
      { $group: { _id: '$response', count: { $sum: 1 } } }
    ]);

    const rsvpStats = {
      Yes: 0,
      No: 0,
      Maybe: 0
    };

    rsvpCounts.forEach(item => {
      rsvpStats[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        ...event.toObject(),
        rsvpStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get event by invite link
// @route   GET /api/events/invite/:link
// @access  Public
const getEventByInviteLink = async (req, res) => {
  try {
    const event = await Event.findOne({ inviteLink: req.params.link })
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get RSVP counts
    const rsvpCounts = await RSVP.aggregate([
      { $match: { eventId: event._id } },
      { $group: { _id: '$response', count: { $sum: 1 } } }
    ]);

    const rsvpStats = {
      Yes: 0,
      No: 0,
      Maybe: 0
    };

    rsvpCounts.forEach(item => {
      rsvpStats[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        ...event.toObject(),
        rsvpStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is event creator
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email');

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is event creator
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    // Delete all RSVPs for this event
    await RSVP.deleteMany({ eventId: req.params.id });

    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's events
// @route   GET /api/events/my-events
// @access  Private
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getEvents,
  getEvent,
  getEventByInviteLink,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents
};
