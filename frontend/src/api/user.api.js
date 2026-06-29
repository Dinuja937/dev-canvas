import api from './axios';

export const updateProfile = (profileData) => api.put('/users/profile', profileData);
