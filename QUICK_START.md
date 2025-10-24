# 🚀 Quick Start Guide - EventEase

Get EventEase up and running in under 10 minutes!

## ⚡ Prerequisites

- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- Git - [Download here](https://git-scm.com/)
- MongoDB Atlas account - [Sign up here](https://www.mongodb.com/cloud/atlas)

## 🏃‍♂️ Quick Setup (5 minutes)

### 1. Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd MERN-PROJECT-FINAL

# Install all dependencies
npm run install-all
```

### 2. Database Setup (2 minutes)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (choose FREE tier)
4. Create a database user
5. Get your connection string
6. Copy `env.example` to `.env` in the root directory
7. Update the `MONGO_URI` in your `.env` file

### 3. Start the Application
```bash
# Start both backend and frontend
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health**: http://localhost:5001/api/health

## 🎯 Test the Application

### 1. Register a New User
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in your details
4. Click "Create account"

### 2. Create Your First Event
1. After login, you'll see the Dashboard
2. Click "Create Event"
3. Fill in event details:
   - Title: "My First Event"
   - Description: "This is a test event"
   - Date: Choose a future date
   - Time: Choose any time
   - Location: "Test Location"
   - Category: Choose any category
4. Click "Create Event"

### 3. Test RSVP Functionality
1. Open a new browser window (incognito)
2. Go to your event details page
3. Click "RSVP Now"
4. Choose a response and submit

### 4. Test Real-time Updates
1. Keep both windows open
2. RSVP in one window
3. Watch the stats update in real-time in the other window

## 🧪 Sample Data (Optional)

To populate your database with sample data:

```bash
# Navigate to backend directory
cd backend

# Run the seeder script
node scripts/seed.js
```

This will create:
- 4 sample users
- 5 sample events
- 10 sample RSVPs

**Test Credentials:**
- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`
- Email: `mike@example.com` | Password: `password123`
- Email: `sarah@example.com` | Password: `password123`

## 🔧 Troubleshooting

### Common Issues

#### "Cannot connect to database"
- Check your MongoDB Atlas connection string
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify your database user credentials

#### "Port already in use"
```bash
# Kill processes on ports 3000 and 5001
npx kill-port 3000 5001
```

#### "Module not found"
```bash
# Reinstall dependencies
npm run install-all
```

#### Frontend not loading
- Check if backend is running on port 5001
- Verify CORS settings in backend
- Check browser console for errors

### Reset Everything
```bash
# Stop all processes
# Delete node_modules
rm -rf node_modules backend/node_modules frontend/node_modules

# Reinstall everything
npm run install-all

# Start fresh
npm run dev
```

## 📱 Mobile Testing

Test the responsive design:
1. Open browser developer tools (F12)
2. Toggle device toolbar
3. Test on different screen sizes
4. Verify mobile navigation works

## 🚀 Next Steps

Once you have the application running locally:

1. **Explore Features**:
   - Create multiple events
   - Test different RSVP responses
   - Try the search and filter functionality
   - Test the invite link sharing

2. **Deploy to Production**:
   - Follow the [Deployment Guide](DEPLOYMENT.md)
   - Deploy backend to Render/Railway
   - Deploy frontend to Vercel/Netlify

3. **Customize and Extend**:
   - Modify the UI/UX
   - Add new features
   - Integrate with other services

## 🆘 Need Help?

### Quick Fixes
- **Backend not starting**: Check environment variables
- **Frontend build fails**: Clear cache and reinstall
- **Database errors**: Verify MongoDB connection
- **CORS issues**: Check CLIENT_URL in backend

### Getting Support
1. Check the [README.md](README.md) for detailed documentation
2. Review the [Deployment Guide](DEPLOYMENT.md) for production setup
3. Check the console logs for error messages
4. Verify all environment variables are set correctly

## 🎉 Success!

If you can see the EventEase homepage and create events, you're all set! 

**What you've accomplished:**
- ✅ Set up a full-stack MERN application
- ✅ Configured MongoDB Atlas database
- ✅ Implemented real-time features with Socket.io
- ✅ Created a responsive React frontend
- ✅ Built a complete event management system

**Ready for production?** Check out the [Deployment Guide](DEPLOYMENT.md) to deploy your application to the cloud!

---

**Happy Event Planning! 🎉**
