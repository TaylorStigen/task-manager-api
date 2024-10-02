const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Task = require('./models/Task');

// JSON Middleware
app.use(express.json());

const dbURI = 'mongodb+srv://taylorstigen:svJRNZFHNhjcTbit@task-manager-api.7qilv.mongodb.net/?retryWrites=true&w=majority&appName=Task-Manager-API';

mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Basic route for root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Task Manager API!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Create a new task
app.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Find the task by ID
        const task = await Task.findById(id);

        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the task fields
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
        task.dueDate = req.body.dueDate || task.dueDate;

        // Save the updated task
        await task.save();

        res.json(task);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Find the task by ID
        const task = await Task.findById(id);

        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Delete the task
        await Task.deleteOne({ _id: id });

        // Send a success response
        res.status(204).send(); // 204 No Content
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
