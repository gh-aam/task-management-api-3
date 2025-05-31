// index.js
const dotenv = require('dotenv');
dotenv.config();  // Load environment variables from .env file
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Task = require('./models/task');
const errorHandler = require('./middleware/errorHandler');
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

// POST /tasks: Create a new task
app.post('/tasks', async (req, res, next) => {
  try {
    const task = new Task(req.body);
    const createdTask = await Task.create(task);
    res.status(201).json(createdTask);
  } catch (err) {
    next(err);
  }
});

// GET /tasks: Get all tasks with pagination
app.get('/tasks', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const total = await Task.countDocuments();
    const tasks = await Task.find().skip(skip).limit(limit);
    
    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id: Get a specific task by ID
app.get('/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id: Update an existing task by ID
app.put('/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id: Delete a task by ID
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    
    res.json({
      message: 'Task deleted'
    });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/search: Search tasks by title (case-insensitive)
app.get('/tasks/search', async (req, res, next) => {
  try {
    const { title } = req.query;
    
    if (!title) {
      res.status(400);
      throw new Error('Query parameter "title" is required');
    }
    
    const tasks = await Task.find({
      title: {
        $regex: title,
        $options: 'i'
      }
    });
    
    res.json({
      count: tasks.length,
      results: tasks
    });
  } catch (err) {
    next(err);
  }
});

// Custom error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});