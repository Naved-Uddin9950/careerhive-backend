import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test123';
const JWT_EXPIRES_IN = '24h';

export const register = async (req, res) => {
    const { fullname, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(200).json({ message: 'Registeration succsessful' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User doesn't exists" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User profile fetched successfully',
            user,
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
};