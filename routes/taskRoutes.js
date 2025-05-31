// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// POST /tasks: Create a new task
router.post('/', async (req, res, next) => {
  try {
    const task = new Task(req.body);
    const createdTask = await Task.create(task);
    res.status(201).json(createdTask);
  } catch (err) {
    next(err);
  }
});

// GET /tasks: Get all tasks with pagination
router.get('/', async (req, res, next) => {
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

// GET /tasks/search: Search tasks by title (case-insensitive)
router.get('/search', async (req, res, next) => {
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

// GET /tasks/:id: Get a specific task by ID
router.get('/:id', async (req, res, next) => {
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
router.put('/:id', async (req, res, next) => {
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
router.delete('/:id', async (req, res, next) => {
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

module.exports = router;