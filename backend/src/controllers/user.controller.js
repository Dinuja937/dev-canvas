import User from '../models/User.js';

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
