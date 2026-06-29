import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toggleLike, getLikeStatus, getLikeCount } from '../api/like.api';

/* ── Time helper ───────────────────────────────────────────────── */
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

/* ── GitHub icon ───────────────────────────────────────────────── */
const GitHubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

/* ── External link icon ────────────────────────────────────────── */
const ExternalIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

/* ── Heart icon ────────────────────────────────────────────────── */
const HeartIcon = ({ filled }) => (
  <svg className="w-5 h-5 transition-transform duration-150 group-active:scale-75" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

/* ── ProjectCard ───────────────────────────────────────────────── */
const ProjectCard = ({ project, onLikeChange }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isRecruiter = user?.role === 'RECRUITER';

  const [liked, setLiked] = useState(Boolean(project?.liked));
  const [likeCount, setLikeCount] = useState(project?.likeCount ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);

  // Sync real like status and count from the database on mount
  useEffect(() => {
    const syncLikeState = async () => {
      if (!project?._id || !isRecruiter) return;
      try {
        const [statusRes, countRes] = await Promise.all([
          getLikeStatus(project._id),
          getLikeCount(project._id),
        ]);
        setLiked(Boolean(statusRes.data?.liked));
        setLikeCount(countRes.data?.count ?? 0);
      } catch {
        // keep defaults on error
      }
    };
    syncLikeState();
  }, [project?._id, isRecruiter]);

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    if (!project?._id || isSubmitting || !isRecruiter) return;

    try {
      setIsSubmitting(true);
      setError('');
      const response = await toggleLike(project._id);
      const nextLiked = Boolean(response.data?.liked);
      setLiked(nextLiked);
      setLikeCount((c) => c + (nextLiked ? 1 : -1));
      if (onLikeChange) onLikeChange(project._id, nextLiked);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update like');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) return null;

  const author = project.studentId;
  const authorName = author?.name || project.studentName || 'Unknown';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <article
      onClick={() => navigate(`/projects/${project._id}`, { state: { project } })}
      className="group relative flex flex-col rounded-2xl border border-slate-100 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-12px_rgba(124,58,237,0.13)] hover:border-purple-100 cursor-pointer"
    >

      {/* ── Cover image ─────────────────────────────────────── */}
      <div className="relative w-full aspect-[16/9] bg-slate-100 overflow-hidden">
        {project.coverImage && !imgError ? (
          <img
            src={project.coverImage}
            alt={project.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-slate-100">
            <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* ── Card body ───────────────────────────────────────── */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-3">

        {/* Tags */}
        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-extrabold text-slate-900 leading-snug tracking-tight line-clamp-2 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 font-medium flex-1">
          {project.description}
        </p>

        {/* ── Links row ───────────────────────────────────────── */}
        {(project.githubUrl || project.demoUrl) && (
          <div className="flex gap-2 pt-0.5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <GitHubIcon /> GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <ExternalIcon /> Live Demo
              </a>
            )}
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-50 mt-auto">
          {/* Author */}
          <div className="flex items-center gap-2 min-w-0">
            {author?.profilePic ? (
              <img
                src={author.profilePic}
                alt={authorName}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white flex items-center justify-center font-bold text-[11px] ring-2 ring-white shadow-sm shrink-0">
                {authorInitial}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-semibold text-slate-700 truncate leading-none">
                {authorName}
              </span>
              {project.createdAt && (
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {timeAgo(project.createdAt)}
                </span>
              )}
            </div>
          </div>


          <button
            type="button"
            onClick={handleLikeToggle}
            disabled={isSubmitting || !isRecruiter}
            aria-pressed={liked}
            title={!isRecruiter ? 'Only recruiters can like projects' : liked ? 'Unlike' : 'Like'}
            className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none focus:outline-none shrink-0 ${liked
              ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100'
              : isRecruiter
                ? 'text-slate-400 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 border border-slate-100 hover:border-rose-100'
                : 'text-slate-300 bg-slate-50 border border-slate-100 cursor-default'
              } disabled:opacity-60`}
          >
            <span className={`${liked ? 'text-rose-500' : isRecruiter ? 'group-hover:text-rose-400' : 'text-slate-300'} transition-colors`}>
              <HeartIcon filled={liked} />
            </span>
            <span>{likeCount}</span>
          </button>
        </div>

        {/* Inline error */}
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      </div>
    </article>
  );
};

export default ProjectCard;
