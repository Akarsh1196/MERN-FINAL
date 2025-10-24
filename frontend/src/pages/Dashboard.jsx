import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, rsvpAPI } from '../utils/api';
import EventCard from '../components/EventCard';
import { 
  HiPlus, 
  HiCalendar, 
  HiUsers, 
  HiCheckCircle,
  HiClock,
  HiTrendingUp,
  HiEye
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [myRSVPs, setMyRSVPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRSVPs: 0,
    upcomingEvents: 0,
    totalAttendees: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's events and RSVPs in parallel
      const [eventsResponse, rsvpsResponse] = await Promise.all([
        eventsAPI.getMyEvents(),
        rsvpAPI.getMyRSVPs()
      ]);

      if (eventsResponse.data.success) {
        setMyEvents(eventsResponse.data.data);
        setStats(prev => ({
          ...prev,
          totalEvents: eventsResponse.data.count,
          upcomingEvents: eventsResponse.data.data.filter(event => 
            new Date(event.date) > new Date()
          ).length
        }));
      }

      if (rsvpsResponse.data.success) {
        setMyRSVPs(rsvpsResponse.data.data);
        setStats(prev => ({
          ...prev,
          totalRSVPs: rsvpsResponse.data.count
        }));
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingEvents = () => {
    return myEvents
      .filter(event => new Date(event.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  };

  const getRecentRSVPs = () => {
    return myRSVPs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 3);
  };

  const getResponseColor = (response) => {
    switch (response) {
      case 'Yes': return 'text-green-600 bg-green-100';
      case 'Maybe': return 'text-yellow-600 bg-yellow-100';
      case 'No': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your events and RSVPs.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: 'My Events',
              value: stats.totalEvents,
              icon: HiCalendar,
              color: 'text-blue-600 bg-blue-100',
              change: '+2 this week'
            },
            {
              title: 'My RSVPs',
              value: stats.totalRSVPs,
              icon: HiCheckCircle,
              color: 'text-green-600 bg-green-100',
              change: '+1 this week'
            },
            {
              title: 'Upcoming',
              value: stats.upcomingEvents,
              icon: HiClock,
              color: 'text-orange-600 bg-orange-100',
              change: 'Next 30 days'
            },
            {
              title: 'Total Attendees',
              value: stats.totalAttendees,
              icon: HiUsers,
              color: 'text-purple-600 bg-purple-100',
              change: 'Across all events'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Events</h2>
              <Link
                to="/create-event"
                className="btn-primary flex items-center space-x-2"
              >
                <HiPlus className="w-4 h-4" />
                <span>Create Event</span>
              </Link>
            </div>

            {myEvents.length > 0 ? (
              <div className="space-y-4">
                {getUpcomingEvents().map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
                
                {myEvents.length > 3 && (
                  <div className="text-center">
                    <Link
                      to="/my-events"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View all my events ({myEvents.length})
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No events yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first event to get started
                </p>
                <Link
                  to="/create-event"
                  className="btn-primary"
                >
                  Create Your First Event
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent RSVPs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent RSVPs</h2>
            
            {myRSVPs.length > 0 ? (
              <div className="space-y-4">
                {getRecentRSVPs().map((rsvp) => (
                  <div key={rsvp._id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {rsvp.eventId?.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {formatDate(rsvp.eventId?.date)}
                        </p>
                        {rsvp.message && (
                          <p className="text-sm text-gray-500 italic">
                            "{rsvp.message}"
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResponseColor(rsvp.response)}`}>
                          {rsvp.response}
                        </span>
                        {rsvp.plusOnes > 0 && (
                          <span className="text-xs text-gray-500">
                            +{rsvp.plusOnes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {myRSVPs.length > 3 && (
                  <div className="text-center">
                    <Link
                      to="/my-rsvps"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View all RSVPs ({myRSVPs.length})
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No RSVPs yet
                </h3>
                <p className="text-gray-600 mb-4">
                  You haven't responded to any events yet
                </p>
                <Link
                  to="/events"
                  className="btn-primary"
                >
                  Browse Events
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/create-event"
              className="card-hover p-6 text-center group"
            >
              <div className="text-primary-600 text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                <HiPlus />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Event</h3>
              <p className="text-sm text-gray-600">Start planning your next event</p>
            </Link>
            
            <Link
              to="/events"
              className="card-hover p-6 text-center group"
            >
              <div className="text-primary-600 text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                <HiEye />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Browse Events</h3>
              <p className="text-sm text-gray-600">Discover events to join</p>
            </Link>
            
            <Link
              to="/my-events"
              className="card-hover p-6 text-center group"
            >
              <div className="text-primary-600 text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                <HiTrendingUp />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Manage Events</h3>
              <p className="text-sm text-gray-600">View and edit your events</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
