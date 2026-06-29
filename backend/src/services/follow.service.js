import Follower from '../models/Follower.js';
import User from '../models/User.js';
import eventBus from '../events/eventBus.js';

export const toggleFollowService = async (followerId, followingId) => {
  if (followerId.toString() === followingId.toString()) {
    throw new Error('You cannot follow yourself');
  }

  const targetUser = await User.findById(followingId);
  if (!targetUser) {
    throw new Error('User not found');
  }

  const existingFollow = await Follower.findOne({ followerId, followingId });

  if (existingFollow) {
    await existingFollow.deleteOne();
    return { following: false };
  }

  await Follower.create({ followerId, followingId });

  // Emit event for notification
  eventBus.emit("user:followed", { followerId, followingId });

  return { following: true };
};

export const getFollowStatusService = async (followerId, followingId) => {
  const following = await Follower.exists({ followerId, followingId });
  return Boolean(following);
};

export const getFollowerCountService = async (followingId) => {
  return await Follower.countDocuments({ followingId });
};

export const getFollowingListService = async (followerId) => {
  const followingList = await Follower.find({ followerId })
    .populate('followingId', 'name email profilePic role')
    .sort({ createdAt: -1 });

  return followingList
    .map((follow) => follow.followingId)
    .filter(Boolean);
};
