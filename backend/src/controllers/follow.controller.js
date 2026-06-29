import mongoose from 'mongoose';
import {
  toggleFollowService,
  getFollowStatusService,
  getFollowerCountService,
  getFollowingListService
} from '../services/follow.service.js';

const getAuthenticatedUserId = (req) => req.user.id || req.user._id;

const getTargetUserId = (req) => req.params.studentId || req.params.userId;

const isValidUserId = (userId) => mongoose.Types.ObjectId.isValid(userId);

export const toggleFollow = async (req, res, next) => {
  try {
    const followerId = getAuthenticatedUserId(req);
    const followingId = getTargetUserId(req);

    if (!isValidUserId(followingId)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    try {
      const result = await toggleFollowService(followerId, followingId);
      return res.status(201).json({ success: true, ...result });
    } catch (err) {
      if (err.message === 'You cannot follow yourself' || err.message === 'User not found') {
        const status = err.message === 'User not found' ? 404 : 400;
        return res.status(status).json({ success: false, message: err.message });
      }
      throw err;
    }
  } catch (err) {
    return next(err);
  }
};

export const getFollowStatus = async (req, res, next) => {
  try {
    const followerId = getAuthenticatedUserId(req);
    const followingId = getTargetUserId(req);

    if (!isValidUserId(followingId)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const following = await getFollowStatusService(followerId, followingId);
    return res.json({ success: true, following });
  } catch (err) {
    return next(err);
  }
};

export const getFollowerCount = async (req, res, next) => {
  try {
    const followingId = getTargetUserId(req);

    if (!isValidUserId(followingId)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const count = await getFollowerCountService(followingId);
    return res.json({ success: true, count });
  } catch (err) {
    return next(err);
  }
};

export const getFollowingList = async (req, res, next) => {
  try {
    const followerId = getAuthenticatedUserId(req);
    const users = await getFollowingListService(followerId);
    return res.json({ success: true, users });
  } catch (err) {
    return next(err);
  }
};
