import React from 'react';
import useAuthStore from '../store/authStore';
import StudentProfile from './StudentProfile';
import AdminProfile from './AdminProfile';
import RecruiterProfile from './RecruiterProfile';

const ProfilePage = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  if (user.role === 'ADMIN') {
    return <AdminProfile />;
  }

  if (user.role === 'RECRUITER') {
    return <RecruiterProfile />;
  }

  // Default to student profile
  return <StudentProfile />;
};

export default ProfilePage;
