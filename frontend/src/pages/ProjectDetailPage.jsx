import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toggleLike, getLikeCount, getLikeStatus } from '../api/like.api';

const ProjectDetailPage = ({ project: projectProp }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const isRecruiter = user?.role === 'RECRUITER';
  const [project, setProject] = useState(projectProp || location.state?.project || null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(project?.likeCount ?? 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProject(projectProp || location.state?.project || null);
  }, [projectProp, location.state]);

  useEffect(() => {
    const syncLikeState = async () => {
      if (!project?._id || !isRecruiter) return;

      try {
        const [statusResponse, countResponse] = await Promise.all([
          getLikeStatus(project._id),
          getLikeCount(project._id),
        ]);

        setLiked(Boolean(statusResponse.data?.liked));
        setLikeCount(countResponse.data?.count ?? 0);
      } catch {
        setLiked(Boolean(project?.liked));
        setLikeCount(project?.likeCount ?? 0);
      }
    };

    syncLikeState();
  }, [project, isRecruiter]);

  const handleLikeToggle = async () => {
    if (!project?._id || loading || !isRecruiter) return;

    try {
      setLoading(true);
      const response = await toggleLike(project._id);
      const nextLiked = Boolean(response.data?.liked);

      setLiked(nextLiked);
      setLikeCount((current) => current + (nextLiked ? 1 : -1));
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="flex-1 px-6 py-10 text-slate-600">
        No project selected.
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
            <p className="mt-2 text-slate-600">{project.description}</p>
          </div>

          {isRecruiter && (
            <button
              type="button"
              onClick={handleLikeToggle}
              disabled={loading}
              aria-pressed={liked}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                liked
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-slate-900 text-white hover:bg-slate-700'
              } disabled:opacity-60`}
            >
              {liked ? 'Liked' : 'Like'}
            </button>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
          <span>Likes {likeCount}</span>
          {project.studentName && <span>{project.studentName}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
