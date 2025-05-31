// index.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
dotenv.config();  // Load environment variables from .env file
const port = process.env.EXPRESS_PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB connection
async function mongoConnect(connectionString) {
  try {
    const connection = await mongoose.connect(connectionString, {
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASS
    });
    
    console.log('Successfully connected to MongoDB:', connection.connection.host);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

mongoConnect(process.env.MONGODB_URI);

// GET /: Root route
app.get('/', (req, res) => {
  res.send('Welcome to Task Management API 3!');
});

// Task routes
app.use('/tasks', taskRoutes);

// Custom error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Graceful shutdown on Ctrl+C or SIGINT
process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down...');
  await mongoose.disconnect();
  console.log('MongoDB connection closed');
  process.exit(0);
});