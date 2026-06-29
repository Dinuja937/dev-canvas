import api from './axios';

export const getMeAPI = async () => {
    return await api.get('/auth/me');
};

export const selectRoleAPI = async (role) => {
    return await api.patch('/auth/select-role', { role });
};

export const updateProfileAPI = async (name, profilePic) => {
    return await api.put('/auth/update-profile', { name, profilePic });
};
