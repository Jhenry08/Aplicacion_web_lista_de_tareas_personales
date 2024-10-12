// routes/tasks.js

const express = require('express');
const router = express.Router();

const tasksController = require('../controllers/tasksController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', tasksController.getTasks);
router.post('/', tasksController.createTask);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
