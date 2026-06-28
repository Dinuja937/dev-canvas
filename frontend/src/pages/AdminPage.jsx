// Admin dashboard to manage users and projects
import React, { useState } from 'react';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Users'); // 'Users' | 'Projects'

    return (
        <div className="flex-1 w-full bg-white text-slate-800 font-sans flex flex-col">

            {/* Main content container */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-10 flex flex-col gap-10 box-border">

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
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Users', value: '—', icon: '👥' },
                        { label: 'Total Projects', value: '—', icon: '📁' },
                        { label: 'Actions Today', value: '—', icon: '⚡' },
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

                {/* Users Section */}
                <section className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Registered Users</h2>
                    </div>

                    {/* Users Table Placeholder */}
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                        <span className="text-3xl mb-3">👥</span>
                        <p className="text-slate-400 text-sm">No users loaded yet</p>
                    </div>
                </section>

                {/* Projects Section */}
                <section className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Project Submissions</h2>
                    </div>

                    {/* Projects Table Placeholder */}
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                        <span className="text-3xl mb-3">📁</span>
                        <p className="text-slate-400 text-sm">No projects loaded yet</p>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default AdminPage;
