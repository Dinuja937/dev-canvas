import api from './axios';

export const toggleLike = (projectId) => {
  return api.post(`/likes/${projectId}/toggle`);
};

export const getLikeStatus = (projectId) => {
  return api.get(`/likes/${projectId}/status`);
};

export const getLikeCount = (projectId) => {
  return api.get(`/likes/${projectId}/count`);
};
