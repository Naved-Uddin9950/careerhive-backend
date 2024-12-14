import JobApplication from '../models/JobApplication.model.js';
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
        const jobPostsWithApplications = await Promise.all(
            jobPosts.map(async (jobPost) => {
                const applicationCount = await JobApplication.countDocuments({
                    jobPost: jobPost._id,
                });

                return {
                    ...jobPost.toObject(),
                    applications: applicationCount,
                };
            })
        );

        res.status(200).json({ success: true, data: jobPostsWithApplications });
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

        const applications = await JobApplication.find({ jobPost: jobPost._id })
            .populate('jobSeeker', 'email')
            .select('status resume appliedAt')
            .populate('jobPost', 'title');

        const formattedApplications = applications.map(application => ({
            _id: application.jobSeeker._id,
            email: application.jobSeeker.email,
            status: application.status,
            appliedAt: application.appliedAt,
            resume: application.resume
        }));


        res.status(200).json({
            success: true,
            data: {
                jobPost,
                applications: formattedApplications,
            },
        });
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

export const listApplications = async (req, res) => {
    try {
        const jobPosts = await JobPost.find({ createdBy: req.user.userId });

        if (!jobPosts.length) {
            return res.status(404).json({ success: false, message: 'No job posts found' });
        }

        const jobApplications = await JobApplication.find({
            jobPost: { $in: jobPosts.map(post => post._id) }
        })
            .populate('jobSeeker', 'fullname')
            .populate('jobPost', 'title')
            .select('jobPost jobSeeker status appliedAt _id');

        const applicationDetails = jobApplications.map(app => ({
            applicationId: app._id,
            jobId: app.jobPost._id,
            jobTitle: app.jobPost.title,
            applicantName: app.jobSeeker.fullname,
            dateApplied: app.appliedAt,
            applicationStatus: app.status,
        }));

        res.status(200).json({
            success: true,
            data: applicationDetails,
        });
    } catch (error) {
        console.error('Error fetching job applications:', error);
        res.status(500).json({ success: false, message: 'Error fetching job applications' });
    }
};
