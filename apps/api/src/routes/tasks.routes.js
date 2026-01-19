import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import * as tasksController from '../controllers/tasks.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('MANAGER', 'ADMIN', 'OWNER', 'EMPLOYEE'));

router.route('/')
    .get(tasksController.getTasks)
    .post(tasksController.createTask);

router.route('/:id')
    .get(tasksController.getTask)
    .patch(tasksController.updateTask)
    .delete(tasksController.deleteTask);

router.post('/generate', tasksController.generateTasks);

export default router;
