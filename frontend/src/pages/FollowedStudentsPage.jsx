import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFollowingList, toggleFollow } from '../api/follow.api';

const SkeletonStudentCard = () => (
  <div className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-white animate-pulse">
    <div className="w-14 h-14 rounded-full bg-slate-100 shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-4 w-32 bg-slate-100 rounded-lg" />
      <div className="h-3 w-48 bg-slate-100 rounded-lg" />
    </div>
    <div className="w-24 h-9 bg-slate-100 rounded-xl shrink-0" />
  </div>
);

const StudentCard = ({ student, onUnfollow }) => {
  const navigate = useNavigate();
  const [isUnfollowing, setIsUnfollowing] = useState(false);

  const handleUnfollow = async (e) => {
    e.stopPropagation();
    if (isUnfollowing) return;
    setIsUnfollowing(true);
    try {
      await toggleFollow(student._id);
      onUnfollow(student._id);
    } finally {
      setIsUnfollowing(false);
    }
  };

  const initial = student.name?.charAt(0).toUpperCase() || '?';

  return (
    <div
      onClick={() => navigate(`/students/${student._id}`)}
      className="group flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
    >
      {/* Avatar */}
      {student.profilePic ? (
        <img
          src={student.profilePic}
          alt={student.name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-black text-xl ring-2 ring-white shadow-md shrink-0">
          {initial}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-extrabold text-slate-900 text-base tracking-tight truncate group-hover:text-purple-700 transition-colors">
          {student.name}
        </p>
        {student.email && (
          <p className="text-sm text-slate-400 font-medium truncate mt-0.5">{student.email}</p>
        )}
        <span className="inline-block mt-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
          {student.role || 'Student'}
        </span>
      </div>

      {/* Unfollow button */}
      <button
        type="button"
        onClick={handleUnfollow}
        disabled={isUnfollowing}
        className="shrink-0 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 disabled:opacity-60 focus:outline-none"
      >
        {isUnfollowing ? 'Removing…' : 'Unfollow'}
      </button>
    </div>
  );
};

const FollowedStudentsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await getFollowingList();
        setStudents(res.data?.users || res.data || []);
      } catch {
        setError('Failed to load followed students.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const handleUnfollow = (studentId) => {
    setStudents((prev) => prev.filter((s) => s._id !== studentId));
  };

  return (
    <div className="flex-1 w-full bg-white">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12 flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col gap-2" style={{ animation: 'fadeUp 0.5s ease both' }}>
          <div className="flex items-center gap-3">
            {/* Users icon */}
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Followed Students</h1>
              <p className="text-slate-400 text-sm font-medium">
                Builders you're keeping an eye on
              </p>
            </div>
          </div>
          {!isLoading && (
            <p className="text-xs text-slate-400 font-semibold ml-[52px]">
              {students.length} student{students.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 -mt-4" />

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        {/* Skeletons */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonStudentCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && students.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-slate-900 text-lg font-extrabold mb-1.5 tracking-tight">No followed students yet</h3>
            <p className="text-slate-400 text-sm max-w-xs text-center leading-relaxed mb-6">
              Browse the showcase, open a project, and follow the builder to track their work.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-black transition-colors"
            >
              Explore Projects
            </button>
          </div>
        )}

        {/* Student list */}
        {!isLoading && !error && students.length > 0 && (
          <div className="flex flex-col gap-3">
            {students.map((student, idx) => (
              <div key={student._id} style={{ animation: `fadeUp 0.4s ease both`, animationDelay: `${idx * 0.04}s` }}>
                <StudentCard student={student} onUnfollow={handleUnfollow} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default FollowedStudentsPage;
