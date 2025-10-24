# EventEase - Event Planning & RSVP System

A comprehensive event planning and RSVP management system built with the MERN stack, featuring real-time updates, beautiful UI, and seamless user experience.

## 🌟 Features

### Core Functionality
- **Event Creation**: Create and manage events with detailed information
- **Real-time RSVP**: Track responses with live updates using Socket.io
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Mobile-first design that works on all devices
- **Event Categories**: Organize events by type (Party, Meeting, Conference, etc.)
- **Invite Links**: Share unique links for easy event access

### Advanced Features
- **Real-time Updates**: See RSVP responses as they come in
- **Event Statistics**: Track attendance and response rates
- **User Dashboard**: Comprehensive overview of events and RSVPs
- **Search & Filter**: Find events by category, location, or keywords
- **Plus Ones**: Allow guests to bring additional attendees
- **Event Management**: Edit, delete, and manage your events

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Bcrypt.js** - Password hashing
- **Express Validator** - Input validation

### Frontend
- **React.js** - UI framework
- **React Router v6** - Navigation
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Socket.io Client** - Real-time updates

## 📁 Project Structure

```
eventease/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── eventController.js    # Event management
│   │   └── rsvpController.js     # RSVP handling
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication
│   │   └── errorMiddleware.js    # Error handling
│   ├── models/
│   │   ├── userModel.js          # User schema
│   │   ├── eventModel.js         # Event schema
│   │   └── rsvpModel.js          # RSVP schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── eventRoutes.js        # Event endpoints
│   │   └── rsvpRoutes.js         # RSVP endpoints
│   └── server.js                 # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation component
│   │   │   ├── EventCard.jsx     # Event display
│   │   │   └── RSVPModal.jsx      # RSVP interface
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication state
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── Dashboard.jsx     # User dashboard
│   │   │   ├── CreateEvent.jsx   # Event creation
│   │   │   ├── EventDetails.jsx  # Event details
│   │   │   └── NotFound.jsx      # 404 page
│   │   ├── utils/
│   │   │   └── api.js            # API utilities
│   │   ├── App.jsx              # Main app component
│   │   └── index.js             # App entry point
│   └── tailwind.config.js       # Tailwind configuration
├── package.json                 # Root package.json
└── README.md                   # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MERN-PROJECT-FINAL
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eventease?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5001
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Socket.io Configuration
SOCKET_CORS_ORIGIN=http://localhost:3000
```

### 4. Database Setup

1. Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and update the `MONGO_URI` in your `.env` file
4. Make sure to whitelist your IP address in MongoDB Atlas

### 5. Run the Application

#### Development Mode
```bash
# From the root directory
npm run dev
```

This will start both the backend (port 5001) and frontend (port 3000) concurrently.

#### Individual Services
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user profile (requires authentication)

### Event Endpoints

#### GET /api/events
Get all public events
- Query parameters: `page`, `limit`, `category`, `search`

#### GET /api/events/:id
Get event by ID

#### GET /api/events/invite/:link
Get event by invite link

#### POST /api/events
Create new event (requires authentication)
```json
{
  "title": "My Event",
  "description": "Event description",
  "date": "2024-01-15",
  "time": "18:00",
  "location": "123 Main St",
  "category": "party",
  "maxAttendees": 50
}
```

#### PUT /api/events/:id
Update event (requires authentication, owner only)

#### DELETE /api/events/:id
Delete event (requires authentication, owner only)

### RSVP Endpoints

#### POST /api/rsvp/:eventId
Create or update RSVP (requires authentication)
```json
{
  "response": "Yes",
  "message": "Looking forward to it!",
  "plusOnes": 2
}
```

#### GET /api/rsvp/:eventId
Get all RSVPs for an event

#### GET /api/rsvp/my-rsvps
Get user's RSVPs (requires authentication)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `PORT` | Server port | 5001 |
| `NODE_ENV` | Environment mode | development |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |

### MongoDB Schema

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: "user"),
  createdAt: Date
}
```

#### Event Model
```javascript
{
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  createdBy: ObjectId (ref: User),
  inviteLink: String (unique),
  category: String,
  maxAttendees: Number,
  isPublic: Boolean,
  status: String (default: "active")
}
```

#### RSVP Model
```javascript
{
  eventId: ObjectId (ref: Event),
  userId: ObjectId (ref: User),
  response: String (enum: ["Yes", "No", "Maybe"]),
  message: String,
  plusOnes: Number,
  timestamp: Date
}
```

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. **Prepare for deployment:**
   ```bash
   cd backend
   npm install --production
   ```

2. **Environment variables:**
   - Set all environment variables in your hosting platform
   - Update `CLIENT_URL` to your frontend URL
   - Update `SOCKET_CORS_ORIGIN` to your frontend URL

3. **Deploy:**
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`

### Frontend Deployment (Vercel/Netlify)

1. **Build the project:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Environment variables:**
   - Set `REACT_APP_API_URL` to your backend URL

3. **Deploy:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`

### Database Deployment

1. **MongoDB Atlas:**
   - Create a cluster
   - Get connection string
   - Update `MONGO_URI` in your environment variables

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- Rate limiting (recommended for production)

## 🚀 Performance Optimizations

- MongoDB indexing
- React lazy loading
- Image optimization
- Code splitting
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Future Enhancements

- [ ] Email notifications
- [ ] Calendar integration
- [ ] Event templates
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Social media integration
- [ ] Payment integration
- [ ] Multi-language support

## 📊 Project Status

✅ **Completed Features:**
- User authentication and authorization
- Event creation and management
- Real-time RSVP system
- Responsive design
- Search and filtering
- Event statistics
- User dashboard

🚧 **In Progress:**
- Advanced event analytics
- Email notifications

📋 **Planned:**
- Mobile application
- Calendar integration
- Payment processing

---

**Built with ❤️ by the EventEase Team**
