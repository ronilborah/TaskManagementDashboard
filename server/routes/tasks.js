const express = require('express');
const router = express.Router();
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
} = require('../controllers/taskController');

// Task routes
router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

// Special route for updating task status (drag and drop)
router.route('/:id/status')
    .patch(updateTaskStatus);

module.exports = router; 