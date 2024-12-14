import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
    jobPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPost',
        required: true,
    },
    jobSeeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    resume: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['applied', 'interviewing', 'hired', 'rejected'],
        default: 'applied',
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;