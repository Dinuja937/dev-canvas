import mongoose from 'mongoose';
import Follower from '../models/Follower.js';
import User from '../models/User.js';
import eventBus from '../events/eventBus.js';

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

    if (followerId.toString() === followingId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself',
      });
    }

    const targetUser = await User.findById(followingId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existingFollow = await Follower.findOne({ followerId, followingId });

    if (existingFollow) {
      await existingFollow.deleteOne();
      return res.json({ success: true, following: false });
    }

    await Follower.create({ followerId, followingId });

    // Emit event for notification
    eventBus.emit("user:followed", { followerId, followingId });

    return res.status(201).json({ success: true, following: true });
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

    const following = await Follower.exists({ followerId, followingId });

    return res.json({ success: true, following: Boolean(following) });
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

    const count = await Follower.countDocuments({ followingId });

    return res.json({ success: true, count });
  } catch (err) {
    return next(err);
  }
};

export const getFollowingList = async (req, res, next) => {
  try {
    const followerId = getAuthenticatedUserId(req);

    const followingList = await Follower.find({ followerId })
      .populate('followingId', 'name email profilePic role')
      .sort({ createdAt: -1 });

    const users = followingList
      .map((follow) => follow.followingId)
      .filter(Boolean);

    return res.json({ success: true, users });
  } catch (err) {
    return next(err);
  }
};
