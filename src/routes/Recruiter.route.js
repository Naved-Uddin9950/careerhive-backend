import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createPost, deletePost, getPost, listPosts, updatePost } from '../controllers/Recruiter.controller.js';

const router = express.Router();

router.post('/create-post', verifyToken, createPost);
router.get('/post-listings', verifyToken, listPosts);
router.get('/post', getPost);
router.put('/post', verifyToken, updatePost);
router.delete('/post', verifyToken, deletePost);

export default router;