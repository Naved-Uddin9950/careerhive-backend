import express from 'express';
import { getUserProfile, login, register } from '../controllers/User.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id', verifyToken, getUserProfile);

export default router;