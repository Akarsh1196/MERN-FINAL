const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not defined in environment variables');
      console.log('Please set MONGO_URI in your .env file');
      console.log('Example: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eventease');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('Please check your MongoDB connection string');
    process.exit(1);
  }
};

module.exports = connectDB;
