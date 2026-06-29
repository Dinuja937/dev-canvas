import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { authService } from '../services/auth.service';
import { navigationConfig } from '../routing/navigationConfig';

const Navbar = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = navigationConfig[user?.role] || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${isActive
      ? 'bg-slate-50 border-slate-200/60 text-slate-900'
      : 'border-transparent text-slate-500 hover:text-slate-900'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 sm:px-12 py-4 flex justify-between items-center w-full box-border">
      {/* Left side - Logo & Name */}
      <NavLink to="/" className="flex items-center gap-3.5 no-underline">
        <div className="grid grid-cols-2 gap-1 w-6 h-6 rotate-45">
          <div className="bg-purple-600 rounded-sm w-2.5 h-2.5"></div>
          <div className="bg-purple-400 rounded-sm w-2.5 h-2.5"></div>
          <div className="bg-purple-500/70 rounded-sm w-2.5 h-2.5"></div>
          <div className="bg-indigo-600 rounded-sm w-2.5 h-2.5"></div>
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">
          DevCanvas
        </span>
      </NavLink>

      {/* Middle Section - Navigation Links (Desktop) */}
      <div className="hidden md:flex items-center gap-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={activeLinkClass}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Right Side Actions (Desktop) */}
      <div className="hidden md:flex items-center gap-6">
        {user && (
          <div className="relative" ref={dropdownRef}>
            {/* Profile button - clicking opens dropdown */}
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-3 focus:outline-none cursor-pointer"
            >
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-800 leading-none">{user.name}</span>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mt-1">{user.role}</span>
              </div>
              {/* Chevron */}
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-50">
                {/* Dashboard - ADMIN only */}
                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => { setIsDropdownOpen(false); navigate('/admin'); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer text-left"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </button>
                )}
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={() => { setIsDropdownOpen(false); authService.logout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile menu hamburger button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-600 hover:text-slate-900 focus:outline-none cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-lg md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-600 hover:text-slate-900 font-semibold py-1.5"
            >
              {link.label}
            </NavLink>
          ))}
          <div className="h-px bg-slate-100 my-1"></div>
          {user && (
            <div className="flex items-center gap-3 py-1.5">
              {user.profilePic && (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                />
              )}
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-800 leading-none">{user.name}</span>
                <span className="text-xs text-purple-600 font-bold mt-1 uppercase tracking-wider">{user.role}</span>
              </div>
            </div>
          )}
          {/* Dashboard link in mobile - ADMIN only */}
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => { setIsMobileMenuOpen(false); navigate('/admin'); }}
              className="w-full py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm transition-all cursor-pointer"
            >
              Dashboard
            </button>
          )}
          <button
            onClick={() => { setIsMobileMenuOpen(false); authService.logout(); }}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
