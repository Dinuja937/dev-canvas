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


