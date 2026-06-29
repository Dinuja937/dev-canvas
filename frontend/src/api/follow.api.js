import api from './axios';

export const toggleFollow = (userId) => {
  return api.post(`/follows/${userId}/toggle`);
};

export const getFollowStatus = (userId) => {
  return api.get(`/follows/${userId}/status`);
};

export const getFollowerCount = (userId) => {
  return api.get(`/follows/${userId}/count`);
};

export const getFollowingList = () => {
  return api.get('/follows/following');
};
