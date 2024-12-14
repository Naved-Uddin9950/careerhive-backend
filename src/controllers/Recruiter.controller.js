import JobPost from '../models/JobPost.model.js';

export const createPost = async (req, res) => {
    try {
        const { title, description, type, salaryMin, salaryMax } = req.body;
        console.log()
        const jobPost = new JobPost({
            title,
            description,
            type,
            salaryMin,
            salaryMax,
            createdBy: req.user.userId,
        });

        await jobPost.save();
        res.status(201).json({ success: true, data: jobPost });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};