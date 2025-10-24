import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../utils/api';
import EventCard from '../components/EventCard';
import { 
  HiCalendar, 
  HiUsers, 
  HiLightningBolt, 
  HiSparkles,
  HiArrowRight,
  HiSearch,
  HiFilter
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState([]);

  const categories = [
    { value: 'all', label: 'All Events', icon: '🎉' },
    { value: 'party', label: 'Party', icon: '🎉' },
    { value: 'meeting', label: 'Meeting', icon: '💼' },
    { value: 'conference', label: 'Conference', icon: '🎤' },
    { value: 'wedding', label: 'Wedding', icon: '💒' },
    { value: 'birthday', label: 'Birthday', icon: '🎂' },
    { value: 'other', label: 'Other', icon: '📅' },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, category]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getEvents({ limit: 12 });
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(event => event.category === category);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Plan Events, Track RSVPs
              <span className="block text-yellow-300">Effortlessly</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Create memorable events, send invites, and manage RSVPs in real-time. 
              Perfect for parties, meetings, conferences, and more.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>Go to Dashboard</span>
                    <HiArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/create-event"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <HiCalendar className="w-5 h-5" />
                    <span>Create Event</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>Get Started</span>
                    <HiArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EventEase?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create and manage successful events
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <HiLightningBolt className="w-8 h-8 text-primary-600" />,
                title: 'Real-time Updates',
                description: 'See RSVP responses instantly as they come in. No more manual tracking or follow-ups.'
              },
              {
                icon: <HiUsers className="w-8 h-8 text-primary-600" />,
                title: 'Easy Invitations',
                description: 'Share unique invite links. Guests can RSVP with just a few clicks, no account required.'
              },
              {
                icon: <HiSparkles className="w-8 h-8 text-primary-600" />,
                title: 'Beautiful Interface',
                description: 'Clean, modern design that works perfectly on desktop and mobile devices.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discover Events
            </h2>
            <p className="text-xl text-gray-600">
              Find and join amazing events happening around you
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1 max-w-md">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <HiFilter className="w-5 h-5 text-gray-400" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner"></div>
              <span className="ml-2 text-gray-600">Loading events...</span>
            </div>
          ) : filteredEvents.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((event) => (
                <motion.div key={event._id} variants={itemVariants}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600">
                {searchTerm || category !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No events are available at the moment'
                }
              </p>
            </div>
          )}

          {/* View More Button */}
          {filteredEvents.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/events"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>View All Events</span>
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
