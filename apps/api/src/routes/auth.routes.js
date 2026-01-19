import express from 'express';
import { login, register, logout, forgotPassword, resetPassword, refresh } from '../controllers/auth.controller.js';

import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/employee/login', login);
router.post('/manager/login', login);
router.post('/admin/login', login);

router.post('/register', register);
router.post('/signup-company', register);
router.post('/manager/create-employee', register);
router.post('/admin/create-company', register);
router.post('/admin/create-manager', register);

router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh', protect, refresh);

export default router;
