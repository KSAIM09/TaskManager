// routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task');
const router = express.Router();
const User= require('../models/User');

const mongoose = require('mongoose');
 

router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo, status } = req.body;
    // Validate assignedTo ID if provided
    if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({ error: 'Invalid assignedTo ID' });
    }

    // Create a new task
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo: assignedTo || null, // Ensure assignedTo is null if not provided
      status: status || 'To Do', // Default to 'To Do' if not provided
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err); // Log detailed error
    res.status(500).json({ error: 'Task creation failed', details: err.message });
  }
});



// Get all tasks with pagination and populate assigned user
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const tasks = await Task.find()
      .populate('assignedTo', 'name email') // Populate assigned user's name and email
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalTasks = await Task.countDocuments();
    const totalPages = Math.ceil(totalTasks / limit);

    res.json({ tasks, totalPages });
  } catch (err) {
    res.status(500).json({ error: 'Fetching tasks failed' });
  }
});

// Get task by ID with populated assigned user
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Fetching task details failed' });
  }
});

// Update task by ID, including assignedTo field
router.put('/:id', async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo, status } = req.body;

    if (assignedTo) {
      const user = await User.findById(assignedTo); // Validate assignedTo user
      if (!user) return res.status(400).json({ error: 'Assigned user not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, priority, assignedTo, status }, // Update status field as well
      { new: true }
    ).populate('assignedTo', 'name email');
    
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Updating task failed' });
  }
});


// Delete task by ID
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Task deletion failed' });
  }
});

module.exports = router;
