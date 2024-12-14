import User from '../models/User.model.js';
import JobPost from '../models/JobPost.model.js';

export const homePage = async (req, res) => {
    const { title, location, skills, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (title) filter.title = new RegExp(title, 'i');
    if (location) filter.location = new RegExp(location, 'i');
    if (skills) filter.skills = { $in: skills.split(',') };

    try {
        const totalJobs = await JobPost.countDocuments(filter);

        const jobPosts = await JobPost.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: jobPosts,
            totalJobs,
            totalPages: Math.ceil(totalJobs / limit),
            currentPage: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (err) {
        console.error('Error fetching job posts:', err);
        res.status(500).json({ success: false, message: 'Error fetching job posts' });
    }
};