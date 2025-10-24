import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventsAPI } from '../utils/api';
import { 
  HiCalendar, 
  HiLocationMarker, 
  HiClock, 
  HiUsers,
  HiTag,
  HiInformationCircle
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'other',
    maxAttendees: '',
    isPublic: true,
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'party', label: 'Party', icon: '🎉' },
    { value: 'meeting', label: 'Meeting', icon: '💼' },
    { value: 'conference', label: 'Conference', icon: '🎤' },
    { value: 'wedding', label: 'Wedding', icon: '💒' },
    { value: 'birthday', label: 'Birthday', icon: '🎂' },
    { value: 'other', label: 'Other', icon: '📅' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.date) < new Date()) {
      toast.error('Event date cannot be in the past');
      return;
    }

    setLoading(true);
    try {
      const eventData = {
        ...formData,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
      };

      const response = await eventsAPI.createEvent(eventData);
      
      if (response.data.success) {
        toast.success('Event created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create event';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
            <p className="text-gray-600">
              Fill in the details below to create your event and start collecting RSVPs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <HiInformationCircle className="w-5 h-5 mr-2 text-primary-600" />
                Basic Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field resize-none"
                    placeholder="Describe your event..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    <HiTag className="inline w-4 h-4 mr-1" />
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <HiCalendar className="w-5 h-5 mr-2 text-primary-600" />
                Date & Time
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    <HiClock className="inline w-4 h-4 mr-1" />
                    Event Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <HiLocationMarker className="w-5 h-5 mr-2 text-primary-600" />
                Location
              </h2>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter event location"
                  required
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <HiUsers className="w-5 h-5 mr-2 text-primary-600" />
                Additional Settings
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Attendees (Optional)
                  </label>
                  <input
                    type="number"
                    id="maxAttendees"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Leave empty for unlimited"
                    min="1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Set a limit on the number of attendees for your event
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                    Make this event public
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Public events can be discovered by other users. Private events are only accessible via invite link.
                </p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner"></div>
                    <span>Creating Event...</span>
                  </div>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateEvent;
