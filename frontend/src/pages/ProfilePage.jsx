import React from 'react';
import useAuthStore from '../store/authStore';
import StudentProfile from './StudentProfile';
import AdminProfile from './AdminProfile';

const ProfilePage = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  if (user.role === 'ADMIN') {
    return <AdminProfile />;
  }

  // Default to student profile for now, can add RecruiterProfile later if needed.
  return <StudentProfile />;
};

export default ProfilePage;
