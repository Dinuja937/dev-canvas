import User from '../models/User.js';
import Project from '../models/Project.js';
import Follower from '../models/Follower.js';

export const updateProfile = async (req, res) => {
  try {
    const { bio, technologies, location, institute } = req.body;
    
    let techArray = [];
    if (typeof technologies === 'string') {
      techArray = technologies.split(',').map((t) => t.trim()).filter((t) => t);
    } else if (Array.isArray(technologies)) {
      techArray = technologies;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          bio,
          technologies: techArray,
          location,
          institute,
        },
      },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('name email profilePic role bio technologies location institute createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [projects, followerCount] = await Promise.all([
      Project.find({ studentId: id }).sort({ createdAt: -1 }),
      Follower.countDocuments({ followingId: id }),
    ]);

    res.json({ user, projects, followerCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
