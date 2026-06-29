import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLikedProjects } from '../api/like.api';
import ProjectCard from '../components/ProjectCard';

const SkeletonCard = () => (
  <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden animate-pulse">
    <div className="w-full aspect-[16/9] bg-slate-100" />
    <div className="p-5 flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="h-4 w-14 bg-slate-100 rounded-full" />
        <div className="h-4 w-10 bg-slate-100 rounded-full" />
      </div>
      <div className="h-5 w-3/4 bg-slate-100 rounded-lg" />
      <div className="h-4 w-full bg-slate-100 rounded-lg" />
      <div className="mt-2 pt-4 border-t border-slate-50 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-slate-100" />
        <div className="h-4 w-24 bg-slate-100 rounded-lg" />
      </div>
    </div>
  </div>
);

const LikedProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await getLikedProjects();
        setProjects(res.data?.projects || res.data || []);
      } catch {
        setError('Failed to load liked projects.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="flex-1 w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col gap-2" style={{ animation: 'fadeUp 0.5s ease both' }}>
          <div className="flex items-center gap-3">
            {/* Heart icon */}
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Liked Projects</h1>
              <p className="text-slate-400 text-sm font-medium">
                Projects you've marked as favourites
              </p>
            </div>
          </div>
          {!isLoading && (
            <p className="text-xs text-slate-400 font-semibold ml-[52px]">
              {projects.length} project{projects.length !== 1 ? 's' : ''}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-rose-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 className="text-slate-900 text-lg font-extrabold mb-1.5 tracking-tight">No liked projects yet</h3>
            <p className="text-slate-400 text-sm max-w-xs text-center leading-relaxed mb-6">
              Explore the showcase and hit the heart button on projects that catch your eye.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-black transition-colors"
            >
              Browse Projects
            </button>
          </div>
        )}

        {/* Project grid */}
        {!isLoading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <div key={project._id} style={{ animation: `fadeUp 0.4s ease both`, animationDelay: `${idx * 0.05}s` }}>
                <ProjectCard project={project} />
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

export default LikedProjectsPage;
