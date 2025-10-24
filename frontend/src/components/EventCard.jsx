import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  HiCalendar, 
  HiLocationMarker, 
  HiUsers, 
  HiClock,
  HiEye
} from 'react-icons/hi';

const EventCard = ({ event, showActions = true }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card-hover group"
    >
      <div className="flex flex-col h-full">
        {/* Event Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{getCategoryIcon(event.category)}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Event Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <HiCalendar className="w-4 h-4 text-primary-500" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <HiClock className="w-4 h-4 text-primary-500" />
            <span>{formatTime(event.time)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <HiLocationMarker className="w-4 h-4 text-primary-500" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          
          {event.maxAttendees && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <HiUsers className="w-4 h-4 text-primary-500" />
              <span>Max {event.maxAttendees} attendees</span>
            </div>
          )}
        </div>

        {/* Event Stats */}
        {event.rsvpStats && (
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-green-600 font-medium">
                {event.rsvpStats.Yes} Going
              </span>
              <span className="text-yellow-600 font-medium">
                {event.rsvpStats.Maybe} Maybe
              </span>
              <span className="text-red-600 font-medium">
                {event.rsvpStats.No} Not Going
              </span>
            </div>
          </div>
        )}

        {/* Event Creator */}
        {event.createdBy && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span>Created by</span>
            <span className="font-medium text-gray-700">
              {event.createdBy.name}
            </span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Link
              to={`/events/${event._id}`}
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
            >
              <HiEye className="w-4 h-4" />
              <span>View Details</span>
            </Link>
            
            {event.inviteLink && (
              <Link
                to={`/invite/${event.inviteLink}`}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
              >
                Invite Link
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
