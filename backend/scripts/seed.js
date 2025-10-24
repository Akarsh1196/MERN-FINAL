const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Event = require('../models/eventModel');
const RSVP = require('../models/rsvpModel');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await RSVP.deleteMany({});

    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'user'
      }
    ]);

    console.log('Created users:', users.length);

    // Create sample events
    const events = await Event.create([
      {
        title: 'Summer BBQ Party',
        description: 'Join us for a fun summer BBQ with great food, drinks, and music!',
        date: new Date('2024-07-15'),
        time: '18:00',
        location: 'Central Park, New York',
        createdBy: users[0]._id,
        category: 'party',
        maxAttendees: 50,
        isPublic: true
      },
      {
        title: 'Tech Conference 2024',
        description: 'Annual technology conference featuring the latest trends and innovations.',
        date: new Date('2024-08-20'),
        time: '09:00',
        location: 'Convention Center, San Francisco',
        createdBy: users[1]._id,
        category: 'conference',
        maxAttendees: 200,
        isPublic: true
      },
      {
        title: 'Team Meeting',
        description: 'Weekly team sync to discuss project progress and upcoming tasks.',
        date: new Date('2024-06-25'),
        time: '14:00',
        location: 'Conference Room A, Office Building',
        createdBy: users[2]._id,
        category: 'meeting',
        maxAttendees: 15,
        isPublic: false
      },
      {
        title: 'Birthday Celebration',
        description: 'Celebrate Sarah\'s birthday with cake, games, and surprises!',
        date: new Date('2024-07-10'),
        time: '19:00',
        location: 'Sarah\'s House, 123 Main St',
        createdBy: users[3]._id,
        category: 'birthday',
        maxAttendees: 25,
        isPublic: true
      },
      {
        title: 'Wedding Reception',
        description: 'Join us to celebrate the union of Alex and Taylor!',
        date: new Date('2024-09-05'),
        time: '17:00',
        location: 'Grand Hotel Ballroom, Chicago',
        createdBy: users[0]._id,
        category: 'wedding',
        maxAttendees: 100,
        isPublic: true
      }
    ]);

    console.log('Created events:', events.length);

    // Create sample RSVPs
    const rsvps = await RSVP.create([
      {
        eventId: events[0]._id,
        userId: users[1]._id,
        response: 'Yes',
        message: 'Looking forward to it!',
        plusOnes: 1
      },
      {
        eventId: events[0]._id,
        userId: users[2]._id,
        response: 'Maybe',
        message: 'I\'ll try to make it',
        plusOnes: 0
      },
      {
        eventId: events[1]._id,
        userId: users[0]._id,
        response: 'Yes',
        message: 'Excited to learn about new technologies!',
        plusOnes: 0
      },
      {
        eventId: events[1]._id,
        userId: users[2]._id,
        response: 'Yes',
        message: 'Great networking opportunity',
        plusOnes: 0
      },
      {
        eventId: events[1]._id,
        userId: users[3]._id,
        response: 'No',
        message: 'Sorry, I have a conflict',
        plusOnes: 0
      },
      {
        eventId: events[3]._id,
        userId: users[0]._id,
        response: 'Yes',
        message: 'Happy birthday!',
        plusOnes: 0
      },
      {
        eventId: events[3]._id,
        userId: users[1]._id,
        response: 'Yes',
        message: 'Can\'t wait to celebrate!',
        plusOnes: 1
      },
      {
        eventId: events[4]._id,
        userId: users[1]._id,
        response: 'Yes',
        message: 'So happy for you both!',
        plusOnes: 1
      },
      {
        eventId: events[4]._id,
        userId: users[2]._id,
        response: 'Yes',
        message: 'Congratulations!',
        plusOnes: 0
      },
      {
        eventId: events[4]._id,
        userId: users[3]._id,
        response: 'Maybe',
        message: 'I\'ll try to attend',
        plusOnes: 0
      }
    ]);

    console.log('Created RSVPs:', rsvps.length);

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Sample Data Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`📅 Events: ${events.length}`);
    console.log(`📝 RSVPs: ${rsvps.length}`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('Email: john@example.com | Password: password123');
    console.log('Email: jane@example.com | Password: password123');
    console.log('Email: mike@example.com | Password: password123');
    console.log('Email: sarah@example.com | Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder
connectDB().then(() => {
  seedData();
});
