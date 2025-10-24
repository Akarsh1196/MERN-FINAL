import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiUsers, HiChat } from 'react-icons/hi';
import { rsvpAPI } from '../utils/api';
import toast from 'react-hot-toast';

const RSVPModal = ({ isOpen, onClose, event, onRSVPUpdate }) => {
  const [response, setResponse] = useState('');
  const [message, setMessage] = useState('');
  const [plusOnes, setPlusOnes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentRSVP, setCurrentRSVP] = useState(null);

  useEffect(() => {
    if (isOpen && event) {
      // Check if user already has an RSVP
      fetchCurrentRSVP();
    }
  }, [isOpen, event]);

  const fetchCurrentRSVP = async () => {
    try {
      const response = await rsvpAPI.getMyRSVPForEvent(event._id);
      if (response.data.success) {
        const rsvp = response.data.data;
        setCurrentRSVP(rsvp);
        setResponse(rsvp.response);
        setMessage(rsvp.message || '');
        setPlusOnes(rsvp.plusOnes || 0);
      }
    } catch (error) {
      // No existing RSVP, that's fine
      setCurrentRSVP(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!response) {
      toast.error('Please select a response');
      return;
    }

    setLoading(true);
    try {
      const rsvpData = {
        response,
        message: message.trim(),
        plusOnes: parseInt(plusOnes) || 0,
      };

      await rsvpAPI.createRSVP(event._id, rsvpData);
      
      toast.success('RSVP submitted successfully!');
      onRSVPUpdate();
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit RSVP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResponse('');
    setMessage('');
    setPlusOnes(0);
    setCurrentRSVP(null);
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                RSVP to Event
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {event.title}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Response Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Will you attend this event?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Yes', 'Maybe', 'No'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setResponse(option)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      response === option
                        ? option === 'Yes'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : option === 'Maybe'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">
                        {option === 'Yes' ? '✅' : option === 'Maybe' ? '🤔' : '❌'}
                      </div>
                      <div className="font-medium">{option}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Plus Ones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <HiUsers className="inline w-4 h-4 mr-1" />
                Plus Ones
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={plusOnes}
                onChange={(e) => setPlusOnes(e.target.value)}
                className="input-field"
                placeholder="Number of additional guests"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <HiChat className="inline w-4 h-4 mr-1" />
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="input-field resize-none"
                placeholder="Add a message for the event organizer..."
                maxLength={200}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {message.length}/200
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>📅 {new Date(event.date).toLocaleDateString()}</div>
                <div>🕐 {event.time}</div>
                <div>📍 {event.location}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!response || loading}
                className={`${
                  response === 'Yes'
                    ? 'btn-success'
                    : response === 'Maybe'
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2'
                    : 'btn-danger'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner"></div>
                    <span>Submitting...</span>
                  </div>
                ) : currentRSVP ? (
                  'Update RSVP'
                ) : (
                  'Submit RSVP'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RSVPModal;
