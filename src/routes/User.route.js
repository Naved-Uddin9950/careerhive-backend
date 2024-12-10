import express from 'express';
import { sendOtp, verifyOtp, setupProfile } from '../controllers/User.controller.js';

const router = express.Router();

router.post('/register', sendOtp);
router.get('/verify-otp', verifyOtp);
router.post('/setup-profile', setupProfile);

export default router;