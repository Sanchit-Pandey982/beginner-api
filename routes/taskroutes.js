const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskcontroller');
const verifyToken = require('../middlewares/auth');

// The Routes
router.get('/', verifyToken, taskController.getTasks);
router.post('/', verifyToken, taskController.createTask);
router.put('/:id', verifyToken, taskController.updateTask);
router.delete('/:id', verifyToken, taskController.deleteTask);

module.exports = router;