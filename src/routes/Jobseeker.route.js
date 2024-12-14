import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { homePage } from '../controllers/Jobseeker.controller.js';

const router = express.Router();

router.get('/home', homePage);

export default router;