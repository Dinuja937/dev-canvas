// API calls for project CRUD
import api from './axios';   

export const createProject = (projectData) => api.post('/projects', projectData);
export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get('/projects/' + id);
export const updateProject = (id, projectData) => api.put('/projects/' + id, projectData);
export const deleteProject = (id) => api.delete('/projects/' + id);