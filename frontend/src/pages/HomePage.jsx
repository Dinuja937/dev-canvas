import React from 'react';
import useAuthStore from '../store/authStore';
import { authService } from '../services/auth.service';

const HomePage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 sm:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            DevCanvas
          </span>
        </div>

        {/* Search bar placeholder */}
        <div className="hidden md:flex items-center w-full max-w-sm mx-8">
          <div className="relative w-full">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search student projects..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm placeholder-slate-400 text-slate-900 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Profile Area */}
        <div className="flex items-center gap-4 sm:gap-6">
          {user && (
            <div className="flex items-center gap-3">
              {user.profilePic && (
                <img 
                  src={user.profilePic} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full border-2 border-purple-500/30 object-cover"
                />
              )}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-800 leading-none">{user.name}</span>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mt-1">{user.role}</span>
              </div>
            </div>
          )}
          <button 
            onClick={authService.logout} 
            className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all focus:outline-none cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-10 flex flex-col gap-10 box-border">
        {/* Banner Area */}
        <section className="text-center py-16 px-6 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08)_0%,rgba(255,255,255,0)_70%)] border border-purple-500/5">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Student Project Showcase
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Discover, review, and appreciate innovative tech concepts and builds created by the Faculty of Computing students.
          </p>
        </section>

        {/* Feed section */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Projects</h2>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 focus:outline-none cursor-pointer">
                All
              </button>
              <button className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:bg-slate-50 focus:outline-none cursor-pointer">
                Web
              </button>
              <button className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:bg-slate-50 focus:outline-none cursor-pointer">
                Mobile
              </button>
            </div>
          </div>

          {/* Empty state container */}
          <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h3 className="text-slate-900 text-lg font-bold mb-2">No Projects Uploaded Yet</h3>
            <p className="text-slate-400 text-sm max-w-xs text-center leading-relaxed">
              Check back shortly or publish your own computing project showcase to get started!
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
