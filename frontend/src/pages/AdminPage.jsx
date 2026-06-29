// Admin dashboard to manage users and projects
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllUsers, getAllProjects, deleteProject, toggleUserStatus } from '../api/admin.api';
import useAuthStore from '../store/authStore';

/* ─── Delete Confirmation Modal ──────────────────────────────────── */
const DeleteModal = ({ projectTitle, onConfirm, onCancel, isDeleting }) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(8,12,30,0.65)' }}
    >
        <div
            className="relative w-full max-w-md rounded-3xl overflow-hidden"
            style={{
                animation: 'modalPop 0.28s cubic-bezier(.34,1.56,.64,1) both',
                background: 'linear-gradient(135deg,#ffffff 0%,#fff5f5 100%)',
                boxShadow: '0 32px 80px -12px rgba(220,38,38,0.25), 0 0 0 1px rgba(220,38,38,0.08)',
            }}
        >
            {/* Top gradient band */}
            <div style={{ background: 'linear-gradient(90deg,#ef4444,#f43f5e,#ec4899)', height: 4 }} />

            {/* Decorative blurred circles */}
            <div style={{
                position: 'absolute', top: -40, right: -40,
                width: 180, height: 180, borderRadius: '50%',
                background: 'radial-gradient(circle,rgba(239,68,68,0.12),transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: -30, left: -30,
                width: 140, height: 140, borderRadius: '50%',
                background: 'radial-gradient(circle,rgba(244,63,94,0.10),transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div className="relative p-8 flex flex-col items-center text-center gap-6">

                {/* Animated pulse icon */}
                <div className="relative flex items-center justify-center">
                    <span className="absolute inline-flex w-20 h-20 rounded-full opacity-20"
                        style={{ background: '#ef4444', animation: 'ping 1.6s cubic-bezier(0,0,0.2,1) infinite' }} />
                    <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg,#fee2e2,#fecdd3)',
                            boxShadow: '0 8px 24px rgba(239,68,68,0.22)',
                        }}>
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"
                            stroke="url(#trashGrad)" strokeWidth={1.8}>
                            <defs>
                                <linearGradient id="trashGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" />
                                    <stop offset="100%" stopColor="#f43f5e" />
                                </linearGradient>
                            </defs>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <div className="flex flex-col gap-2">
                    <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                        Delete this project?
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        You're about to permanently remove
                    </p>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'linear-gradient(90deg,#fef2f2,#fff0f3)',
                        border: '1px solid #fecaca', borderRadius: 10,
                        padding: '8px 14px', margin: '0 auto',
                    }}>
                        <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span style={{ fontWeight: 700, fontSize: 13, color: '#b91c1c', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {projectTitle}
                        </span>
                    </div>
                </div>

                {/* Consequence checklist */}
                <div style={{
                    width: '100%', background: '#fafafa',
                    border: '1px solid #f1f5f9', borderRadius: 14, padding: '14px 16px',
                    display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                    {[
                        'Project details & description',
                        'All associated media & files',
                        'Submission record from the system',
                    ].map((item) => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                                background: 'linear-gradient(135deg,#ef4444,#f43f5e)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <span style={{ fontSize: 12.5, color: '#475569', fontWeight: 500 }}>{item}</span>
                        </div>
                    ))}
                </div>

                {/* Warning badge */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'linear-gradient(90deg,#fff1f2,#fdf2f8)',
                    border: '1px solid #fecdd3', borderRadius: 999,
                    padding: '6px 14px', fontSize: 11.5, fontWeight: 700,
                    color: '#be123c', letterSpacing: '0.02em',
                }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    This action is irreversible and cannot be undone
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        style={{
                            flex: 1, padding: '11px 0', borderRadius: 14,
                            border: '1.5px solid #e2e8f0', background: '#fff',
                            fontSize: 13.5, fontWeight: 700, color: '#64748b',
                            cursor: 'pointer', transition: 'all 0.18s',
                        }}
                        onMouseEnter={e => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#cbd5e1'; }}
                        onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#e2e8f0'; }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        style={{
                            flex: 1, padding: '11px 0', borderRadius: 14, border: 'none',
                            background: isDeleting
                                ? 'linear-gradient(135deg,#fca5a5,#fda4af)'
                                : 'linear-gradient(135deg,#ef4444 0%,#f43f5e 60%,#ec4899 100%)',
                            fontSize: 13.5, fontWeight: 700, color: '#fff',
                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 18px rgba(239,68,68,0.35)',
                            transition: 'all 0.18s',
                            opacity: isDeleting ? 0.75 : 1,
                        }}
                    >
                        {isDeleting ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                <svg style={{ width: 15, height: 15, animation: 'spin 0.8s linear infinite' }}
                                    viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M12 3v3m0 12v3m9-9h-3M6 12H3" />
                                </svg>
                                Deleting…
                            </span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Yes, Delete Project
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>

        <style>{`
            @keyframes modalPop {
                from { opacity:0; transform:scale(0.82) translateY(24px); }
                to   { opacity:1; transform:scale(1)   translateY(0); }
            }
            @keyframes ping {
                75%,100% { transform:scale(1.8); opacity:0; }
            }
            @keyframes spin {
                to { transform:rotate(360deg); }
            }
            @keyframes tabFadeIn {
                from { opacity:0; transform:translateY(12px); }
                to   { opacity:1; transform:translateY(0); }
            }
        `}</style>
    </div>
);

/* ─── Main AdminPage ─────────────────────────────────────────────── */
const AdminPage = () => {
    const [searchParams] = useSearchParams();
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const validTabs = ['Users', 'Projects', 'Profile'];
    const initialTab = validTabs.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'Users';
    const [activeTab, setActiveTab] = useState(initialTab);
    const { user: adminUser } = useAuthStore();

    // Modal state
    const [modalTarget, setModalTarget] = useState(null); // { id, title }
    const [isDeleting, setIsDeleting] = useState(false);

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

    const confirmDelete = async () => {
        if (!modalTarget) return;
        setIsDeleting(true);
        try {
            await deleteProject(modalTarget.id);
            setProjects((prev) => prev.filter((p) => p._id !== modalTarget.id));
            setModalTarget(null);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to delete project.');
            setModalTarget(null);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleUser = async (userId) => {
        try {
            await toggleUserStatus(userId);
            setUsers(users.map(u => u._id === userId ? { ...u, isDisabled: !u.isDisabled } : u));
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to toggle user status');
        }
    };

    return (
        <div className="flex-1 w-full bg-white text-slate-800 font-sans flex flex-col">

            {/* ── Delete Confirmation Modal ── */}
            {modalTarget && (
                <DeleteModal
                    projectTitle={modalTarget.title}
                    onConfirm={confirmDelete}
                    onCancel={() => setModalTarget(null)}
                    isDeleting={isDeleting}
                />
            )}

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
                    <section key="users" className="flex flex-col gap-4" style={{ animation: 'tabFadeIn 0.3s ease both' }}>
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
                                            <th className="px-5 py-3.5">Status</th>
                                            <th className="px-5 py-3.5">Joined</th>
                                            <th className="px-5 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {user.profilePic ? (
                                                            <img src={user.profilePic} alt={user.name}
                                                                className={`w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 ${user.isDisabled ? 'grayscale opacity-50' : ''}`} />
                                                        ) : (
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${user.isDisabled ? 'bg-slate-100 text-slate-400' : 'bg-purple-100 text-purple-600'}`}>
                                                                {user.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <span className={`font-semibold ${user.isDisabled ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className={`px-5 py-4 ${user.isDisabled ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</td>
                                                <td className="px-5 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${roleColors[user.role] || 'bg-slate-100 text-slate-500'} ${user.isDisabled ? 'opacity-50' : ''}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    {user.isDisabled ? (
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">Disabled</span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">Active</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-slate-400">{formatDate(user.createdAt)}</td>
                                                <td className="px-5 py-4 flex justify-end">
                                                    {user._id !== adminUser?.id && user._id !== adminUser?._id && (
                                                        <button
                                                            onClick={() => handleToggleUser(user._id)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer focus:outline-none ${user.isDisabled
                                                                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                }`}
                                                        >
                                                            {user.isDisabled ? 'Enable' : 'Disable'}
                                                        </button>
                                                    )}
                                                </td>
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
                    <section key="projects" className="flex flex-col gap-4" style={{ animation: 'tabFadeIn 0.3s ease both' }}>
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
                                        {project.coverImage && (
                                            <img src={project.coverImage} alt={project.title}
                                                className="w-full h-36 object-cover" />
                                        )}

                                        <div className="flex flex-col gap-3 p-4 flex-1">
                                            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{project.title}</h3>
                                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{project.description}</p>

                                            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-50">
                                                {project.studentId?.profilePic ? (
                                                    <img src={project.studentId.profilePic} alt={project.studentId.name}
                                                        className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0" />
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
                                                onClick={() => setModalTarget({ id: project._id, title: project.title })}
                                                className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors cursor-pointer focus:outline-none"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

                {/* ── PROFILE TAB ── */}
                {!isLoading && activeTab === 'Profile' && (
                    <section key="profile" className="flex flex-col gap-6" style={{ animation: 'tabFadeIn 0.3s ease both' }}>

                        {/* Admin Info Card */}
                        <div style={{
                            borderRadius: 20,
                            background: 'linear-gradient(135deg,#faf5ff 0%,#f5f3ff 100%)',
                            border: '1px solid #ede9fe',
                            padding: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 24,
                            flexWrap: 'wrap',
                        }}>
                            {/* Avatar */}
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                {adminUser?.profilePic ? (
                                    <img
                                        src={adminUser.profilePic}
                                        alt={adminUser.name}
                                        style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid #7c3aed', boxShadow: '0 8px 24px rgba(124,58,237,0.22)' }}
                                    />
                                ) : (
                                    <div style={{
                                        width: 88, height: 88, borderRadius: '50%',
                                        background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 34, fontWeight: 900, color: '#fff',
                                        boxShadow: '0 8px 24px rgba(124,58,237,0.25)',
                                    }}>
                                        {adminUser?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {/* Online dot */}
                                <span style={{
                                    position: 'absolute', bottom: 4, right: 4,
                                    width: 14, height: 14, borderRadius: '50%',
                                    background: '#22c55e', border: '2px solid #fff',
                                }} />
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                    <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.4px' }}>
                                        {adminUser?.name}
                                    </h2>
                                    {/* Role badge */}
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                        background: 'linear-gradient(90deg,#7c3aed,#a78bfa)',
                                        color: '#fff', fontSize: 10, fontWeight: 800,
                                        letterSpacing: '0.08em', textTransform: 'uppercase',
                                        padding: '3px 10px', borderRadius: 999,
                                    }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                        </svg>
                                        Admin
                                    </span>
                                </div>
                                <p style={{ color: '#64748b', fontSize: 13.5, marginTop: 4 }}>{adminUser?.email}</p>
                                {adminUser?.createdAt && (
                                    <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                        Member since {new Date(adminUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16 }}>
                            {[
                                { label: 'Total Users', value: users.length || '—', icon: '👥', color: '#7c3aed', bg: '#f5f3ff' },
                                { label: 'Total Projects', value: projects.length || '—', icon: '📁', color: '#0ea5e9', bg: '#f0f9ff' },
                                { label: 'Your Role', value: 'Admin', icon: '🛡️', color: '#059669', bg: '#f0fdf4' },
                            ].map((stat) => (
                                <div key={stat.label} style={{
                                    borderRadius: 16, border: `1px solid ${stat.bg}`,
                                    background: stat.bg, padding: '20px 22px',
                                    display: 'flex', flexDirection: 'column', gap: 8,
                                }}>
                                    <span style={{ fontSize: 26 }}>{stat.icon}</span>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</p>
                                    <p style={{ fontSize: 26, fontWeight: 900, color: stat.color, letterSpacing: '-0.5px' }}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Permissions Card */}
                        <div style={{ borderRadius: 16, border: '1px solid #f1f5f9', background: '#fafafa', padding: '20px 22px' }}>
                            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Admin Permissions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[
                                    'View all registered users',
                                    'Browse and manage all project submissions',
                                    'Delete any project from the system',
                                    'Full platform oversight & moderation',
                                ].map((perm) => (
                                    <div key={perm} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{
                                            width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                                            background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </div>
                                        <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{perm}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </section>
                )}

            </main>
        </div>
    );
};

export default AdminPage;
