const express = require('express');
const app = express();

// JSON Middleware
app.use(express.json());

// Basic route for root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Task Manager API!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

let tasks = []; // Temp task storage

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Create a new task
app.post('/tasks', (req, res) => {
    const task = req.body;
    task.id = tasks.length + 1;
    tasks.push(task);
    res.status(201).json(task);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
  
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }
  
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    res.json(tasks[taskIndex]);
  });
  
  // Delete a task
  app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== id);
    res.status(204).send();
  });