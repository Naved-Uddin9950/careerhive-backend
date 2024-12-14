import mongoose from 'mongoose';

const jobPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['internship', 'training', 'part-time', 'full-time', 'freelance'],
    },
    salaryMin: {
        type: Number,
        required: true,
        min: 0,
    },
    salaryMax: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value >= this.salaryMin;
            },
            message: 'Maximum salary must be greater than or equal to minimum salary',
        },
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    skills: {
        type: [String],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: 'At least one skill must be provided',
        },
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

jobPostSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const JobPost = mongoose.model('JobPost', jobPostSchema);

export default JobPost;