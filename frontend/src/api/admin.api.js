// API calls for admin (users, projects)
import api from './axios.js';

export const getAllUsers = () => api.get('/admin/users');

export const getAllProjects = () => api.get('/admin/projects');

export const deleteProject = (id) => api.delete(`/admin/projects/${id}`);

