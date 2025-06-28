const Task = require('../models/Task');
const Project = require('../models/Project');
const mongoose = require('mongoose');

// @desc    Get all tasks (with optional filtering)
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
    try {
        const { projectId, priority, status, assignee, search, sortBy } = req.query;

        // Build filter object
        const filter = {};

        if (projectId) {
            // Validate if projectId is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid project ID format'
                });
            }
            filter.projectId = projectId;
        }

        if (priority) {
            filter.priority = priority;
        }

        if (status) {
            filter.status = status;
        }

        if (assignee) {
            filter.assignee = { $regex: assignee, $options: 'i' };
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        let sort = { createdAt: -1 };

        if (sortBy === 'priority') {
            sort = { priority: 1, createdAt: -1 };
        } else if (sortBy === 'dueDate') {
            sort = { dueDate: 1, createdAt: -1 };
        } else if (sortBy === 'title') {
            sort = { title: 1, createdAt: -1 };
        }

        const tasks = await Task.find(filter)
            .populate('projectId', 'name color')
            .sort(sort);

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching tasks'
        });
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('projectId', 'name color');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching task'
        });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
    try {
        const { title, description, priority, status, assignee, dueDate, projectId } = req.body;

        // Validate required fields
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Task title is required'
            });
        }

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: 'Project ID is required'
            });
        }

        // Validate if projectId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID format'
            });
        }

        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || '',
            priority: priority || 'Medium',
            status: status || 'To Do',
            assignee: assignee?.trim() || '',
            dueDate: dueDate || null,
            projectId
        });

        const populatedTask = await Task.findById(task._id).populate('projectId', 'name color');

        res.status(201).json({
            success: true,
            data: populatedTask
        });
    } catch (error) {
        console.error('Error creating task:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating task'
        });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
    try {
        const { title, description, priority, status, assignee, dueDate, projectId } = req.body;

        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Update fields
        if (title !== undefined) task.title = title.trim();
        if (description !== undefined) task.description = description.trim();
        if (priority !== undefined) task.priority = priority;
        if (status !== undefined) task.status = status;
        if (assignee !== undefined) task.assignee = assignee.trim();
        if (dueDate !== undefined) task.dueDate = dueDate || null;
        if (projectId !== undefined) {
            // Validate if projectId is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid project ID format'
                });
            }

            // Check if project exists
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
            }
            task.projectId = projectId;
        }

        await task.save();

        const updatedTask = await Task.findById(task._id).populate('projectId', 'name color');

        res.status(200).json({
            success: true,
            data: updatedTask
        });
    } catch (error) {
        console.error('Error updating task:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while updating task'
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting task'
        });
    }
};

// @desc    Update task status (for drag and drop)
// @route   PATCH /api/tasks/:id/status
// @access  Public
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['To Do', 'In Progress', 'Done'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Valid status is required'
            });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        task.status = status;
        await task.save();

        const updatedTask = await Task.findById(task._id).populate('projectId', 'name color');

        res.status(200).json({
            success: true,
            data: updatedTask
        });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating task status'
        });
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
}; 