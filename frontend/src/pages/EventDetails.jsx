import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, rsvpAPI } from '../utils/api';
import RSVPModal from '../components/RSVPModal';
import { 
  HiCalendar, 
  HiLocationMarker, 
  HiClock, 
  HiUsers,
  HiShare,
  HiEdit,
  HiTrash,
  HiArrowLeft,
  HiCheckCircle,
  HiXCircle,
  HiQuestionMarkCircle
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [myRSVP, setMyRSVP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getEvent(id);
      
      if (response.data.success) {
        setEvent(response.data.data);
        
        // Fetch RSVPs if user is authenticated
        if (isAuthenticated) {
          try {
            const rsvpsResponse = await rsvpAPI.getEventRSVPs(id);
            if (rsvpsResponse.data.success) {
              setRsvps(rsvpsResponse.data.data);
            }
            
            // Check if user has already RSVP'd
            try {
              const myRSVPResponse = await rsvpAPI.getMyRSVPForEvent(id);
              if (myRSVPResponse.data.success) {
                setMyRSVP(myRSVPResponse.data.data);
              }
            } catch (error) {
              // User hasn't RSVP'd yet, that's fine
            }
          } catch (error) {
            console.error('Failed to fetch RSVPs:', error);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to fetch event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = () => {
    if (!isAuthenticated) {
      toast.error('Please login to RSVP');
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }
    setShowRSVPModal(true);
  };

  const handleRSVPUpdate = () => {
    fetchEventDetails();
    setShowRSVPModal(false);
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await eventsAPI.deleteEvent(id);
      toast.success('Event deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete event';
      toast.error(message);
    }
  };

  const copyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/invite/${event.inviteLink}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite link copied to clipboard!');
    setShowShareModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getCategoryColor = (category) => {
    const colors = {
      party: 'bg-pink-100 text-pink-800',
      meeting: 'bg-blue-100 text-blue-800',
      conference: 'bg-purple-100 text-purple-800',
      wedding: 'bg-rose-100 text-rose-800',
      birthday: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      party: '🎉',
      meeting: '💼',
      conference: '🎤',
      wedding: '💒',
      birthday: '🎂',
      other: '📅',
    };
    return icons[category] || icons.other;
  };

  const getResponseIcon = (response) => {
    switch (response) {
      case 'Yes': return <HiCheckCircle className="w-5 h-5 text-green-600" />;
      case 'Maybe': return <HiQuestionMarkCircle className="w-5 h-5 text-yellow-600" />;
      case 'No': return <HiXCircle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events" className="btn-primary">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const isEventCreator = user && event.createdBy && event.createdBy._id === user._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card">
              {/* Event Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl">{getCategoryIcon(event.category)}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                    <p className="text-gray-600 text-lg">{event.description}</p>
                  </div>
                  
                  {isEventCreator && (
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/events/${event._id}/edit`}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <HiEdit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={handleDeleteEvent}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <HiCalendar className="w-5 h-5 text-primary-600" />
                    <span className="font-medium">{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <HiClock className="w-5 h-5 text-primary-600" />
                    <span className="font-medium">{formatTime(event.time)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <HiLocationMarker className="w-5 h-5 text-primary-600" />
                    <span className="font-medium">{event.location}</span>
                  </div>
                  
                  {event.maxAttendees && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <HiUsers className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Max {event.maxAttendees} attendees</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Creator */}
              {event.createdBy && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {event.createdBy.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Created by {event.createdBy.name}</p>
                      <p className="text-sm text-gray-600">{event.createdBy.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* RSVP Section */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">RSVP</h3>
              
              {myRSVP ? (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {getResponseIcon(myRSVP.response)}
                    <span className="font-medium">You're {myRSVP.response}</span>
                  </div>
                  {myRSVP.message && (
                    <p className="text-sm text-gray-600 italic">"{myRSVP.message}"</p>
                  )}
                  {myRSVP.plusOnes > 0 && (
                    <p className="text-sm text-gray-600">+{myRSVP.plusOnes} guests</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 mb-4">You haven't responded yet</p>
              )}

              <button
                onClick={handleRSVP}
                className="w-full btn-primary"
              >
                {myRSVP ? 'Update RSVP' : 'RSVP Now'}
              </button>
            </div>

            {/* RSVP Stats */}
            {event.rsvpStats && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">RSVP Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HiCheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Going</span>
                    </div>
                    <span className="font-semibold text-green-600">{event.rsvpStats.Yes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HiQuestionMarkCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-gray-600">Maybe</span>
                    </div>
                    <span className="font-semibold text-yellow-600">{event.rsvpStats.Maybe}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HiXCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-gray-600">Not Going</span>
                    </div>
                    <span className="font-semibold text-red-600">{event.rsvpStats.No}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Share Event */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Event</h3>
              <button
                onClick={() => setShowShareModal(true)}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <HiShare className="w-4 h-4" />
                <span>Share Invite Link</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Recent RSVPs */}
        {rsvps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent RSVPs</h3>
              <div className="space-y-4">
                {rsvps.slice(0, 5).map((rsvp) => (
                  <div key={rsvp._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {rsvp.userId?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{rsvp.userId?.name}</p>
                        {rsvp.message && (
                          <p className="text-sm text-gray-600">"{rsvp.message}"</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getResponseIcon(rsvp.response)}
                      <span className="text-sm text-gray-500">
                        {new Date(rsvp.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* RSVP Modal */}
      <RSVPModal
        isOpen={showRSVPModal}
        onClose={() => setShowRSVPModal(false)}
        event={event}
        onRSVPUpdate={handleRSVPUpdate}
      />

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Event</h3>
            <p className="text-gray-600 mb-4">
              Share this link with people you want to invite to your event:
            </p>
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <code className="text-sm text-gray-800 break-all">
                {window.location.origin}/invite/{event.inviteLink}
              </code>
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                onClick={copyInviteLink}
                className="btn-primary"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
