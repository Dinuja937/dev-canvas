import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import { toggleLike } from '../api/like.api';

const ProjectCard = ({ project, onLikeChange }) => {
  const { user } = useAuthStore();
  const isRecruiter = user?.role === 'RECRUITER';
  const [liked, setLiked] = useState(Boolean(project?.liked));
  const [likeCount, setLikeCount] = useState(project?.likeCount ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLiked(Boolean(project?.liked));
    setLikeCount(project?.likeCount ?? 0);
  }, [project]);

  const handleLikeToggle = async () => {
    if (!project?._id || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError('');

      const response = await toggleLike(project._id);
      const nextLiked = Boolean(response.data?.liked);

      setLiked(nextLiked);
      setLikeCount((current) => current + (nextLiked ? 1 : -1));

      if (onLikeChange) {
        onLikeChange(project._id, nextLiked);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update like');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) {
    return null;
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
          <p className="mt-1 text-sm text-slate-600 line-clamp-3">{project.description}</p>
        </div>

        {isRecruiter && (
          <button
            type="button"
            onClick={handleLikeToggle}
            disabled={isSubmitting}
            aria-pressed={liked}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              liked
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-slate-900 text-white hover:bg-slate-700'
            } disabled:opacity-60`}
          >
            {liked ? 'Liked' : 'Like'}
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>Likes {likeCount}</span>
        {project.studentName && <span>{project.studentName}</span>}
      </div>

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
    </article>
  );
};

export default ProjectCard;
