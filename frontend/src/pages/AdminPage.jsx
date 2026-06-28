// Admin dashboard to manage users and projects
import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllProjects, deleteProject } from '../api/admin.api';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Users'); // 'Users' | 'Projects'

    // Fetch data whenever activeTab changes (or on mount)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (activeTab === 'Users') {
                    const res = await getAllUsers();
                    setUsers(res.data.data);
                } else {
                    const res = await getAllProjects();
                    setProjects(res.data.data);
                }
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const roleColors = {
        ADMIN: 'bg-red-50 text-red-600',
        STUDENT: 'bg-purple-50 text-purple-600',
        RECRUITER: 'bg-blue-50 text-blue-600',
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
        try {
            await deleteProject(id);
            setProjects((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            alert(err?.response?.data?.message || 'Failed to delete project.');
        }
    };

    return (
        <div className="flex-1 w-full bg-white text-slate-800 font-sans flex flex-col">
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-10 flex flex-col gap-8 box-border">

                {/* Page Header */}
                <section className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-slate-500 text-sm mt-0.5">Manage users and project submissions</p>
                    </div>
                </section>

                {/* Stats Row */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: 'Total Users', value: users.length || '—', icon: '👥' },
                        { label: 'Total Projects', value: projects.length || '—', icon: '📁' },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-2xl border border-slate-100 bg-slate-50/60 px-6 py-5 flex items-center gap-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{stat.label}</p>
                                <p className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Tab Switcher */}
                <div className="flex gap-2 border-b border-slate-100 pb-0">
                    {['Users', 'Projects'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all cursor-pointer focus:outline-none ${activeTab === tab
                                ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Loading Spinner */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-l-purple-600 animate-spin" />
                    </div>
                )}

                {/* ── USERS TAB ── */}
                {!isLoading && activeTab === 'Users' && (
                    <section className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                                Registered Users
                                {users.length > 0 && (
                                    <span className="ml-2 text-sm font-medium text-slate-400">({users.length})</span>
                                )}
                            </h2>
                        </div>

                        {users.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                                <span className="text-3xl mb-3">👥</span>
                                <p className="text-slate-400 text-sm">No users found</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                            <th className="px-5 py-3.5">User</th>
                                            <th className="px-5 py-3.5">Email</th>
                                            <th className="px-5 py-3.5">Role</th>
                                            <th className="px-5 py-3.5">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-slate-50/60 transition-colors">
                                                {/* Avatar + Name */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {user.profilePic ? (
                                                            <img
                                                                src={user.profilePic}
                                                                alt={user.name}
                                                                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                                {user.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <span className="font-semibold text-slate-800">{user.name}</span>
                                                    </div>
                                                </td>
                                                {/* Email */}
                                                <td className="px-5 py-4 text-slate-500">{user.email}</td>
                                                {/* Role Badge */}
                                                <td className="px-5 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${roleColors[user.role] || 'bg-slate-100 text-slate-500'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                {/* Date */}
                                                <td className="px-5 py-4 text-slate-400">{formatDate(user.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {/* ── PROJECTS TAB ── */}
                {!isLoading && activeTab === 'Projects' && (
                    <section className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                                Project Submissions
                                {projects.length > 0 && (
                                    <span className="ml-2 text-sm font-medium text-slate-400">({projects.length})</span>
                                )}
                            </h2>
                        </div>

                        {projects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                                <span className="text-3xl mb-3">📁</span>
                                <p className="text-slate-400 text-sm">No projects found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projects.map((project) => (
                                    <div
                                        key={project._id}
                                        className="flex flex-col rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                    >
                                        {/* Cover Image */}
                                        {project.coverImage && (
                                            <img
                                                src={project.coverImage}
                                                alt={project.title}
                                                className="w-full h-36 object-cover"
                                            />
                                        )}

                                        <div className="flex flex-col gap-3 p-4 flex-1">
                                            {/* Title */}
                                            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{project.title}</h3>

                                            {/* Description */}
                                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{project.description}</p>

                                            {/* Owner + Date */}
                                            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-50">
                                                {project.studentId?.profilePic ? (
                                                    <img
                                                        src={project.studentId.profilePic}
                                                        alt={project.studentId.name}
                                                        className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                                                        {project.studentId?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="text-xs text-slate-500 font-medium truncate">{project.studentId?.name || 'Unknown'}</span>
                                                <span className="ml-auto text-[11px] text-slate-400 shrink-0">{formatDate(project.createdAt)}</span>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteProject(project._id)}
                                                className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors cursor-pointer focus:outline-none"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete Project
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

            </main>
        </div>
    );
};

export default AdminPage;
