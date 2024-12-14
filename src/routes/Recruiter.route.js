import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createPost } from '../controllers/Recruiter.controller.js';

const router = express.Router();

router.post('/create-post', verifyToken, createPost);

export default router;