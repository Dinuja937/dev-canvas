import React, { useState, useEffect } from 'react';
import { getProjects } from '../api/project.api';
import ProjectCard from '../components/ProjectCard';

/* ── Skeleton Card ─────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="rounded-xl border border-slate-100 bg-white overflow-hidden animate-pulse">
    <div className="w-full aspect-[16/9] bg-slate-100" />
    <div className="p-5 flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="h-4 w-14 bg-slate-100 rounded-full" />
        <div className="h-4 w-10 bg-slate-100 rounded-full" />
      </div>
      <div className="h-5 w-3/4 bg-slate-100 rounded-lg" />
      <div className="h-4 w-full bg-slate-100 rounded-lg" />
      <div className="h-4 w-2/3 bg-slate-100 rounded-lg" />
      <div className="mt-2 pt-4 border-t border-slate-50 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-slate-100" />
        <div className="h-4 w-24 bg-slate-100 rounded-lg" />
      </div>
    </div>
  </div>
);

/* ── Main HomePage ─────────────────────────────────────────────── */
const HomePage = () => {
  const [projects, setProjects]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState(null);
  const [activeTag, setActiveTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getProjects();
        setProjects(res.data?.data || res.data || []);
      } catch {
        setError('Failed to load projects.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Collect unique tags dynamically from all projects
  const allTags = ['All', ...new Set(projects.flatMap((p) => p.tags || []))].slice(0, 8);

  const filtered = projects.filter((p) => {
    const matchesTag = activeTag === 'All' || p.tags?.includes(activeTag);
    
    if (!matchesTag) return false;
    
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const matchesTitle = p.title?.toLowerCase().includes(query);
    const matchesDesc = p.description?.toLowerCase().includes(query);
    const matchesAuthor = p.studentId?.name?.toLowerCase().includes(query);
    const matchesTags = p.tags?.some(tag => tag.toLowerCase().includes(query));

    return matchesTitle || matchesDesc || matchesAuthor || matchesTags;
  });

  return (
    <div className="flex-1 w-full bg-white text-slate-800 font-sans flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-12 flex flex-col gap-12 box-border">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section
          className="relative flex flex-col items-center text-center gap-6 py-14 px-6 overflow-hidden"
          style={{ animation: 'cardFadeIn 0.6s ease both' }}
        >
          {/* Ambient glow blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div style={{ position: 'absolute', top: -60, left: '20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(168,85,247,0.09) 0%, transparent 70%)', filter: 'blur(40px)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: -40, right: '20%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)', filter: 'blur(40px)', borderRadius: '50%' }} />
          </div>

          <div className="relative flex flex-col gap-4 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Where Great Code{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-500">
                  Gets Seen
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-400 opacity-40" />
              </span>
            </h1>
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed font-medium">
              Real projects. Real builders. Explore what the next generation of developers is shipping.
            </p>
          </div>

          {/* Live stats — only shown once data loads */}
          {!isLoading && projects.length > 0 && (
            <div className="relative flex items-center gap-6 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{projects.length}</span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Projects</span>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {new Set(projects.map((p) => p.studentId?._id).filter(Boolean)).size}
                </span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Builders</span>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {new Set(projects.flatMap((p) => p.tags || [])).size}
                </span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Technologies</span>
              </div>
            </div>
          )}
        </section>

        {/* ── Big Search Bar ─────────────────────────────────────────────── */}
        <div className="flex justify-center -mt-6 mb-4 relative z-10 px-4" style={{ animation: 'cardFadeIn 0.7s ease both' }}>
          <div className="relative w-full max-w-2xl group">
            <input
              type="text"
              placeholder="Search projects, builders, or technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl text-lg font-medium text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] focus:shadow-[0_12px_40px_rgb(0,0,0,0.1)] transition-all duration-300 placeholder:text-slate-400 focus:outline-none focus:ring-0 border-none"
            />
            <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* ── Feed ─────────────────────────────────────────────── */}
        <section className="flex flex-col gap-8">

          {/* Filter bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mr-2">Browse</h2>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer focus:outline-none border ${
                    activeTag === tag
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
              {isLoading ? '—' : `${filtered.length} project${filtered.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          {/* Skeletons while loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 px-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/30">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 className="text-slate-900 text-lg font-extrabold mb-1.5 tracking-tight">Nothing here yet</h3>
              <p className="text-slate-400 text-sm max-w-xs text-center leading-relaxed">
                {activeTag === 'All'
                  ? 'Be the first to publish your project and claim your spot on the showcase.'
                  : `No projects tagged with "${activeTag}" yet.`}
              </p>
            </div>
          )}

          {/* Project grid using the shared ProjectCard component */}
          {!isLoading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map((project, idx) => (
                <div key={project._id} className="h-full" style={{ animation: `cardFadeIn 0.4s ease both`, animationDelay: `${idx * 0.05}s` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
