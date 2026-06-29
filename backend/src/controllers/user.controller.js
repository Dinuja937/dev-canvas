import { updateUserService, getUserByIdService } from '../services/user.service.js';

export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await updateUserService(req.user.id, req.body);
    
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
    const result = await getUserByIdService(req.params.id);

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
