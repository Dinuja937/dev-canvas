import Project from '../models/Project.js';
import eventBus from '../events/eventBus.js';
import cloudinary from '../lib/cloudinary.js';
import { optionalHttpUrl, parseTags, requiredText, limits } from '../lib/validation.js';

const projectFields = (data, { partial = false } = {}) => {
    const fields = {};
    if (!partial || data.title !== undefined) fields.title = requiredText(data.title, 'Title', limits.title);
    if (!partial || data.description !== undefined) fields.description = requiredText(data.description, 'Description', limits.description);
    if (!partial || data.githubUrl !== undefined) fields.githubUrl = optionalHttpUrl(data.githubUrl, 'GitHub URL');
    if (!partial || data.demoUrl !== undefined) fields.demoUrl = optionalHttpUrl(data.demoUrl, 'Demo URL');
    if (!partial || data.tags !== undefined) fields.tags = parseTags(data.tags);
    return fields;
};

export const uploadToCloudinary = async (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

export const createProject = async (projectData, files, user) => {
    const fields = projectFields(projectData);
    let coverImageUrl = '';
    let extraImageUrls = [];

    if (files?.coverImage?.[0]) {
        coverImageUrl = await uploadToCloudinary(
            files.coverImage[0].buffer,
            'dev-canvas/projects'
        );
    }

    if (files?.extraImages?.length) {
        extraImageUrls = await Promise.all(
            files.extraImages.map((file) =>
                uploadToCloudinary(file.buffer, 'dev-canvas/projects/extras')
            )
        );
    }

    const project = new Project({
        ...fields,
        studentId: user.id,
        coverImage: coverImageUrl,
        images: extraImageUrls,
    });

    await project.save();

    eventBus.emit("project:created", {
        project,
        creator: user,
    });

    return project;
};

export const getProjects = async (userId) => {
    const query = {};
    if (userId) {
        query.studentId = userId;
    }
    return await Project.find(query)
        .sort({ createdAt: -1 })
        .populate('studentId', 'name email profilePic');
};

export const getProjectById = async (projectId) => {
    const project = await Project.findById(projectId).populate('studentId', 'name email profilePic');
    if (!project) throw new Error('Project not found');
    return project;
};

export const updateProject = async (projectId, updateData, files, userId) => {
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');
    if (project.studentId.toString() !== userId) throw new Error('Unauthorized');

    if (files?.coverImage?.[0]) {
        project.coverImage = await uploadToCloudinary(
            files.coverImage[0].buffer,
            'dev-canvas/projects'
        );
    }

    let updatedImages = project.images || [];
    if (updateData.existingImages !== undefined) {
        try {
            updatedImages = JSON.parse(updateData.existingImages);
        } catch (e) {
            updatedImages = Array.isArray(updateData.existingImages) ? updateData.existingImages : [updateData.existingImages];
        }
        if (!Array.isArray(updatedImages) || updatedImages.some((image) => typeof image !== 'string') ||
            updatedImages.some((image) => !project.images.includes(image))) {
            throw new Error('Invalid existing images');
        }
    }

    if (files?.extraImages?.length) {
        const newlyUploaded = await Promise.all(
            files.extraImages.map((file) =>
                uploadToCloudinary(file.buffer, 'dev-canvas/projects/extras')
            )
        );
        updatedImages = [...updatedImages, ...newlyUploaded];
    }
    project.images = updatedImages;

    Object.assign(project, projectFields(updateData, { partial: true }));

    await project.save();
    return project;
};

export const deleteProject = async (projectId, userId) => {
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');
    if (project.studentId.toString() !== userId) throw new Error('Unauthorized');

    await project.deleteOne();
    return { message: 'Project deleted' };
};
