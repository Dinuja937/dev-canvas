import User from '../models/User.js';
import Project from '../models/Project.js';
import Follower from '../models/Follower.js';
import { optionalText, parseTechnologies, limits } from '../lib/validation.js';

export const updateUserService = async (userId, data) => {
  const updateFields = {
    bio: optionalText(data.bio, 'Bio', limits.bio),
    technologies: parseTechnologies(data.technologies),
    location: optionalText(data.location, 'Location', limits.location),
    institute: optionalText(data.institute, 'Institute', limits.institute),
  };
  if (data.contactNumber !== undefined) updateFields.contactNumber = optionalText(data.contactNumber, 'Contact number', limits.contactNumber);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select('-__v');

  return updatedUser;
};

export const getUserByIdService = async (id) => {
  const user = await User.findById(id)
    .select('name email username contactNumber profilePic role bio technologies location institute createdAt');

  if (!user) {
    return null;
  }

  const [projects, followerCount] = await Promise.all([
    Project.find({ studentId: id }).sort({ createdAt: -1 }),
    Follower.countDocuments({ followingId: id }),
  ]);

  return { user, projects, followerCount };
};
