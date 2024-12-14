import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { apply, homePage } from '../controllers/Jobseeker.controller.js';

const router = express.Router();

router.get('/home', homePage);
router.post('/apply', verifyToken, apply);

export default router;