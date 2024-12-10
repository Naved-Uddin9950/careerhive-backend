import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            trim: true,
            default: null,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            default: null,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        password: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ['recruiter', 'jobseeker', 'admin'],
            default: 'jobseeker',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;