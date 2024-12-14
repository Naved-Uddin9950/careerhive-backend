import JobPost from '../models/JobPost.model.js';

export const createPost = async (req, res) => {
    try {
        const { title, description, type, salaryMin, salaryMax, location, skills } = req.body;
        const jobPost = new JobPost({
            title,
            description,
            type,
            salaryMin,
            salaryMax,
            location,
            skills,
            createdBy: req.user.userId,
        });

        await jobPost.save();
        res.status(201).json({ success: true, data: jobPost });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const listPosts = async (req, res) => {
    try {
        const jobPosts = await JobPost.find({ createdBy: req.user.userId });
        res.status(200).json({ success: true, data: jobPosts });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const jobPost = await JobPost.findById(req.query.id);

        if (!jobPost) {
            return res.status(404).json({ success: false, message: 'Job post not found' });
        }

        res.status(200).json({ success: true, data: jobPost });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const jobPost = await JobPost.findById(req.query.id);

        if (!jobPost) {
            return res.status(404).json({ success: false, message: 'Job post not found' });
        }

        if (jobPost.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to edit this job post' });
        }

        const { title, description, type, salaryMin, salaryMax, location, skills } = req.body;

        jobPost.title = title || jobPost.title;
        jobPost.description = description || jobPost.description;
        jobPost.type = type || jobPost.type;
        jobPost.salaryMin = salaryMin || jobPost.salaryMin;
        jobPost.salaryMax = salaryMax || jobPost.salaryMax;
        jobPost.location = location || jobPost.location;
        jobPost.skills = skills || jobPost.skills;
        jobPost.updatedAt = Date.now();

        await jobPost.save();

        res.status(200).json({ success: true, data: jobPost });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const jobPost = await JobPost.findOne({ _id: req.query.id });

        if (!jobPost) {
            return res.status(404).json({ success: false, message: 'Job post not found' });
        }

        if (jobPost.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this job post' });
        }

        await JobPost.findByIdAndDelete(req.query.id);

        res.status(200).json({ success: true, message: 'Job post deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};