// config/db.js
// Responsible for connecting to MongoDB and providing debug information.

const mongoose = require('mongoose');

async function connectDB() {
  try {
    // MONGO_URI set in .env (Atlas connection string)
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // crash early - developer should fix the connection
    process.exit(1);
  }
}

module.exports = connectDB;
