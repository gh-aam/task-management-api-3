// models/task.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from .env file

// Load offensive words from .env file and convert to lowercase array
const offensiveWords = process.env.OFFENSIVE_WORDS
  ? process.env.OFFENSIVE_WORDS.toLowerCase().split(',').map(word => word.trim())
  : [];

// MongoDB schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title must not exceed 100 characters']
  },
  description: {
    type: String,
    default: '',
    trim: true,
    validate: {
      validator: (value) => {
        const lower = value.toLowerCase();
        return !offensiveWords.some(word => lower.includes(word));
      },
      message: 'Description contains offensive language'
    }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// MongoDB model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;