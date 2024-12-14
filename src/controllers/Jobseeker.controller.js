import JobPost from '../models/JobPost.model.js';
import JobApplication from '../models/JobApplication.model.js';

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

        for (let i = 0; i < jobPosts.length; i++) {
            const applicationsCount = await JobApplication.countDocuments({
                jobPost: jobPosts[i]._id
            });
            jobPosts[i] = {
                ...jobPosts[i]._doc,
                applications: applicationsCount,
            };
        }

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

export const apply = async (req, res) => {
    try {
        const { jobPostId, resume } = req.body;
        const jobSeekerId = req.user.userId;

        const jobPost = await JobPost.findById(jobPostId);
        if (!jobPost) {
            return res.status(404).json({ success: false, message: 'Job post not found' });
        }

        const existingApplication = await JobApplication.findOne({
            jobPost: jobPostId,
            jobSeeker: jobSeekerId,
        });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: 'You have already applied to this job' });
        }

        const jobApplication = new JobApplication({
            jobPost: jobPostId,
            jobSeeker: jobSeekerId,
            resume,
        });

        await jobApplication.save();
        res.status(201).json({ success: true, message: 'Application submitted successfully', data: jobApplication });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ success: false, message: 'Error applying for job' });
    }
};