import User from '../models/User.model.js';
import sendOtpEmail from '../utils/emailService.js';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export const sendOtp = async (req, res) => {
    const { fullName, email, password, role } = req.body;
    const { retry } = req.query;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (!retry) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            // const otp = nanoid(6);
            // existingUser.otp = otp;
            // existingUser.otpExpiration = Date.now() + 15 * 60 * 1000;

            await existingUser.save();
            // await sendOtpEmail(email, otp);

            return res.status(200).json({ message: 'OTP resent to email' });
        }

        // const otp = nanoid(6);
        // const otpExpiration = Date.now() + 15 * 60 * 1000;

        const newUser = new User({
            fullName,
            email,
            password,
            role
            // otp,
            // otpExpiration,
        });

        // await sendOtpEmail(email, otp);
        await newUser.save();

        res.status(200).json({ message: 'Registeration succsessful' });
    } catch (err) {
        console.error('Error in sending OTP:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.query;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpiration < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        user.isVerified = false;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const setupProfile = async (req, res) => {
    const { email, firstName, country, password, confirmPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.firstName = firstName;
        user.country = country;
        user.password = hashedPassword;
        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'Profile setup successful, user registered!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};