const express = require('express');
const { body } = require('express-validator');
const {
  createRSVP,
  getEventRSVPs,
  getMyRSVPs,
  getMyRSVPForEvent,
  deleteRSVP
} = require('../controllers/rsvpController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/rsvp/:eventId
// @desc    Create or update RSVP
// @access  Private
router.post('/:eventId', protect, [
  body('response')
    .isIn(['Yes', 'No', 'Maybe'])
    .withMessage('Response must be Yes, No, or Maybe'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Message cannot be more than 200 characters'),
  body('plusOnes')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Plus ones must be between 0 and 10')
], createRSVP);

// @route   GET /api/rsvp/:eventId
// @desc    Get RSVPs for an event
// @access  Public
router.get('/:eventId', getEventRSVPs);

// @route   GET /api/rsvp/my-rsvps
// @desc    Get user's RSVPs
// @access  Private
router.get('/my-rsvps', protect, getMyRSVPs);

// @route   GET /api/rsvp/:eventId/my-response
// @desc    Get user's RSVP for specific event
// @access  Private
router.get('/:eventId/my-response', protect, getMyRSVPForEvent);

// @route   DELETE /api/rsvp/:eventId
// @desc    Delete RSVP
// @access  Private
router.delete('/:eventId', protect, deleteRSVP);

module.exports = router;
