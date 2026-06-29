import api from './axios';

export const updateProfile = (profileData) => api.put('/users/profile', profileData);
export const getUserById   = (id) => api.get(`/users/${id}`);

