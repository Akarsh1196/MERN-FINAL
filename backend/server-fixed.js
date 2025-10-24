const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./config/db');
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');

// Error handler
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();
const server = createServer(app);

// Enhanced Socket.io setup with better error handling
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true
});

// Enhanced middleware with better error handling
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rsvp', rsvpRoutes);

// Health check endpoint with more details
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5001,
    database: 'connected'
  });
});

// Enhanced Socket.io connection handling with error handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join event room for real-time updates
  socket.on('join-event', (eventId) => {
    try {
      socket.join(`event-${eventId}`);
      console.log(`User ${socket.id} joined event ${eventId}`);
    } catch (error) {
      console.error('Error joining event room:', error);
    }
  });

  // Leave event room
  socket.on('leave-event', (eventId) => {
    try {
      socket.leave(`event-${eventId}`);
      console.log(`User ${socket.id} left event ${eventId}`);
    } catch (error) {
      console.error('Error leaving event room:', error);
    }
  });

  // Handle RSVP updates
  socket.on('rsvp-update', (data) => {
    try {
      const { eventId, rsvpData } = data;
      socket.to(`event-${eventId}`).emit('rsvp-received', rsvpData);
    } catch (error) {
      console.error('Error handling RSVP update:', error);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);
  });

  // Handle socket errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Enhanced server startup with better error handling
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 Socket.io server ready for connections`);
  console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});

// Enhanced error handling
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err.message);
  console.error('Stack:', err.stack);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

module.exports = { app, io };
