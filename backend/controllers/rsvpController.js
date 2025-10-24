const RSVP = require('../models/rsvpModel');
const Event = require('../models/eventModel');

// @desc    Create or update RSVP
// @route   POST /api/rsvp/:eventId
// @access  Private
const createRSVP = async (req, res) => {
  try {
    const { response, message, plusOnes } = req.body;
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is still active
    if (event.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Event is no longer accepting RSVPs'
      });
    }

    // Check if user already has an RSVP
    let rsvp = await RSVP.findOne({
      eventId: eventId,
      userId: req.user.id
    });

    if (rsvp) {
      // Update existing RSVP
      rsvp.response = response;
      rsvp.message = message || rsvp.message;
      rsvp.plusOnes = plusOnes || rsvp.plusOnes;
      rsvp.timestamp = new Date();
      
      await rsvp.save();
    } else {
      // Create new RSVP
      rsvp = await RSVP.create({
        eventId: eventId,
        userId: req.user.id,
        response,
        message,
        plusOnes: plusOnes || 0
      });
    }

    // Populate the RSVP with user details
    const populatedRSVP = await RSVP.findById(rsvp._id)
      .populate('userId', 'name email')
      .populate('eventId', 'title date location');

    res.status(201).json({
      success: true,
      data: populatedRSVP
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get RSVPs for an event
// @route   GET /api/rsvp/:eventId
// @access  Public
const getEventRSVPs = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const rsvps = await RSVP.find({ eventId })
      .populate('userId', 'name email')
      .sort({ timestamp: -1 });

    // Get RSVP statistics
    const rsvpStats = await RSVP.aggregate([
      { $match: { eventId: event._id } },
      { $group: { _id: '$response', count: { $sum: 1 } } }
    ]);

    const stats = {
      Yes: 0,
      No: 0,
      Maybe: 0,
      total: rsvps.length
    };

    rsvpStats.forEach(stat => {
      stats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      count: rsvps.length,
      stats,
      data: rsvps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's RSVPs
// @route   GET /api/rsvp/my-rsvps
// @access  Private
const getMyRSVPs = async (req, res) => {
  try {
    const rsvps = await RSVP.find({ userId: req.user.id })
      .populate('eventId', 'title date location createdBy')
      .populate('eventId.createdBy', 'name email')
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      count: rsvps.length,
      data: rsvps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's RSVP for specific event
// @route   GET /api/rsvp/:eventId/my-response
// @access  Private
const getMyRSVPForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const rsvp = await RSVP.findOne({
      eventId: eventId,
      userId: req.user.id
    }).populate('eventId', 'title date location');

    if (!rsvp) {
      return res.status(404).json({
        success: false,
        message: 'No RSVP found for this event'
      });
    }

    res.json({
      success: true,
      data: rsvp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete RSVP
// @route   DELETE /api/rsvp/:eventId
// @access  Private
const deleteRSVP = async (req, res) => {
  try {
    const { eventId } = req.params;

    const rsvp = await RSVP.findOneAndDelete({
      eventId: eventId,
      userId: req.user.id
    });

    if (!rsvp) {
      return res.status(404).json({
        success: false,
        message: 'RSVP not found'
      });
    }

    res.json({
      success: true,
      message: 'RSVP deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createRSVP,
  getEventRSVPs,
  getMyRSVPs,
  getMyRSVPForEvent,
  deleteRSVP
};
