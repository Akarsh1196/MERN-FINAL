const express = require('express');
const { body } = require('express-validator');
const {
  getEvents,
  getEvent,
  getEventByInviteLink,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', getEvents);

// @route   GET /api/events/my-events
// @desc    Get user's events
// @access  Private
router.get('/my-events', protect, getMyEvents);

// @route   GET /api/events/invite/:link
// @desc    Get event by invite link
// @access  Public
router.get('/invite/:link', getEventByInviteLink);

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', getEvent);

// @route   POST /api/events
// @desc    Create new event
// @access  Private
router.post('/', protect, [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Event description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Event date cannot be in the past');
      }
      return true;
    }),
  body('time')
    .notEmpty()
    .withMessage('Event time is required'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Event location is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Location must be between 3 and 100 characters'),
  body('category')
    .optional()
    .isIn(['party', 'meeting', 'conference', 'wedding', 'birthday', 'other'])
    .withMessage('Invalid category'),
  body('maxAttendees')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max attendees must be a positive number')
], createEvent);

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private
router.put('/:id', protect, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('location')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Location must be between 3 and 100 characters'),
  body('category')
    .optional()
    .isIn(['party', 'meeting', 'conference', 'wedding', 'birthday', 'other'])
    .withMessage('Invalid category'),
  body('maxAttendees')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max attendees must be a positive number')
], updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private
router.delete('/:id', protect, deleteEvent);

module.exports = router;
