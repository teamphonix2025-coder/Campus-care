// index.js
// Entry file: sets up Express, connects to MongoDB, attaches routes.
// Comments explain why lines exist.

require('dotenv').config(); // load variables from .env into process.env

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db'); // connection helper
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

const app = express();

// CORS configuration: allow requests from your React dev server
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Built-in middleware to parse incoming JSON bodies
app.use(express.json());

// Connect to MongoDB via mongoose
connectDB();

// Routes
app.use('/api/auth', authRoutes);      // signup, verify, login, forgot, reset
app.use('/api', protectedRoutes);      // protected endpoints like /me

// Start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
