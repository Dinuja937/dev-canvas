import User from '../models/User.js';
import Project from '../models/Project.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        return res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        next(err);
    }
};

export const getAllProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({}).populate('studentId', 'name email profilePic');
        return res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (err) {
        next(err);
    }
};

export const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (err) {
        next(err);
    }
};

export const toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent admin from disabling themselves
        if (user._id.toString() === req.user.id.toString()) {
            return res.status(400).json({ success: false, message: 'Cannot disable your own account' });
        }

        user.isDisabled = !user.isDisabled;
        await user.save();

        return res.status(200).json({ success: true, message: `User ${user.isDisabled ? 'disabled' : 'enabled'} successfully`, data: user });
    } catch (err) {
        next(err);
    }
};

