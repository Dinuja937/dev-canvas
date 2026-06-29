import React, { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

const ProfilePage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    // Edit states
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [profilePic, setProfilePic] = useState(user?.profilePic || '');
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const roleColors = {
        ADMIN: { bg: 'linear-gradient(90deg,#7c3aed,#a78bfa)', label: 'Admin' },
        STUDENT: { bg: 'linear-gradient(90deg,#7c3aed,#818cf8)', label: 'Student' },
        RECRUITER: { bg: 'linear-gradient(90deg,#0ea5e9,#38bdf8)', label: 'Recruiter' },
    };
    const roleStyle = roleColors[user?.role] || { bg: '#94a3b8', label: user?.role };

    const adminPermissions = [
        'View all registered users',
        'Browse and manage all project submissions',
        'Delete any project from the system',
        'Full platform oversight & moderation',
    ];

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setErrorMsg('Name is required');
            return;
        }
        setIsSaving(true);
        setErrorMsg(null);
        try {
            const res = await authService.updateProfile(name, profilePic);
            if (res.success) {
                setIsEditing(false);
            } else {
                setErrorMsg(res.message || 'Failed to update profile');
            }
        } catch (err) {
            setErrorMsg('An unexpected error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setName(user?.name || '');
        setProfilePic(user?.profilePic || '');
        setErrorMsg(null);
        setIsEditing(false);
    };

    return (
        <div className="flex-1 w-full bg-white font-sans">
            <style>{`
                @keyframes profileFadeIn {
                    from { opacity:0; transform:translateY(18px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .profile-fade { animation: profileFadeIn 0.35s ease both; }
                .profile-fade-1 { animation: profileFadeIn 0.35s ease 0.05s both; }
                .profile-fade-2 { animation: profileFadeIn 0.35s ease 0.12s both; }
                .profile-fade-3 { animation: profileFadeIn 0.35s ease 0.20s both; }
            `}</style>

            <main className="max-w-3xl mx-auto px-6 sm:px-10 py-12 flex flex-col gap-7">

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="profile-fade self-start flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors cursor-pointer focus:outline-none"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back
                </button>

                {/* Error Banner */}
                {errorMsg && (
                    <div className="profile-fade bg-red-50 border border-red-100 rounded-2xl px-5 py-3 text-red-600 font-semibold text-sm flex items-center gap-2.5">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {errorMsg}
                    </div>
                )}

                {/* Hero / Edit Card */}
                <div
                    className="profile-fade rounded-3xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg,#faf5ff 0%,#f5f3ff 60%,#ede9fe 100%)',
                        border: '1px solid #ede9fe',
                        boxShadow: '0 20px 60px -12px rgba(124,58,237,0.15)',
                    }}
                >
                    {/* Purple banner */}
                    <div style={{ height: 90, background: 'linear-gradient(135deg,#7c3aed 0%,#a78bfa 60%,#818cf8 100%)' }} />

                    {!isEditing ? (
                        <div className="px-8 pb-8" style={{ marginTop: -44 }}>
                            {/* Avatar */}
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                {user?.profilePic ? (
                                    <img
                                        src={user.profilePic}
                                        alt={user.name}
                                        style={{
                                            width: 88, height: 88, borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '4px solid #fff',
                                            boxShadow: '0 8px 24px rgba(124,58,237,0.22)',
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: 88, height: 88, borderRadius: '50%',
                                        background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 34, fontWeight: 900, color: '#fff',
                                        border: '4px solid #fff',
                                        boxShadow: '0 8px 24px rgba(124,58,237,0.25)',
                                    }}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {/* Online dot */}
                                <span style={{
                                    position: 'absolute', bottom: 6, right: 6,
                                    width: 14, height: 14, borderRadius: '50%',
                                    background: '#22c55e', border: '2.5px solid #fff',
                                }} />
                            </div>

                            {/* Name + badge */}
                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                                    {user?.name}
                                </h1>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                    background: roleStyle.bg,
                                    color: '#fff', fontSize: 10.5, fontWeight: 800,
                                    letterSpacing: '0.08em', textTransform: 'uppercase',
                                    padding: '4px 12px', borderRadius: 999,
                                    boxShadow: '0 2px 8px rgba(124,58,237,0.25)',
                                }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                    {roleStyle.label}
                                </span>
                            </div>

                            {/* Email + joined */}
                            <div className="mt-3 flex flex-wrap gap-5">
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#64748b', fontWeight: 500 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    {user?.email}
                                </span>
                                {user?.createdAt && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#94a3b8', fontWeight: 500 }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                        Member since {formatDate(user.createdAt)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSave} className="px-8 pb-8 flex flex-col gap-6" style={{ marginTop: -44 }}>
                            {/* Avatar Picker / Display */}
                            <div className="flex items-end gap-5">
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    {profilePic ? (
                                        <img
                                            src={profilePic}
                                            alt="Preview"
                                            style={{
                                                width: 88, height: 88, borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '4px solid #fff',
                                                boxShadow: '0 8px 24px rgba(124,58,237,0.22)',
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: 88, height: 88, borderRadius: '50%',
                                            background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 34, fontWeight: 900, color: '#fff',
                                            border: '4px solid #fff',
                                            boxShadow: '0 8px 24px rgba(124,58,237,0.25)',
                                        }}>
                                            {name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-purple-700 uppercase tracking-widest mb-1.5">
                                        Profile Image URL
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/avatar.jpg"
                                        value={profilePic}
                                        onChange={(e) => setProfilePic(e.target.value)}
                                        className="w-full bg-white/70 border border-purple-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Name Input */}
                            <div>
                                <label className="block text-xs font-bold text-purple-700 uppercase tracking-widest mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Jane Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/70 border border-purple-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-sm"
                                />
                            </div>

                            {/* Form Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
                                        color: '#fff', fontSize: 13.5, fontWeight: 700,
                                        padding: '10px 20px', borderRadius: 12, border: 'none',
                                        boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
                                        cursor: 'pointer', transition: 'all 0.18s',
                                        opacity: isSaving ? 0.7 : 1,
                                    }}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        background: '#fff', color: '#64748b', fontSize: 13.5, fontWeight: 700,
                                        padding: '10px 20px', borderRadius: 12,
                                        border: '1.5px solid #e2e8f0',
                                        cursor: 'pointer', transition: 'all 0.18s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Admin Permissions Card */}
                {user?.role === 'ADMIN' && (
                    <div
                        className="profile-fade-1 rounded-2xl"
                        style={{ border: '1px solid #f1f5f9', background: '#fafafa', padding: '22px 24px' }}
                    >
                        <h2 style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                            Admin Permissions
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {adminPermissions.map((perm) => (
                                <div key={perm} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                                        background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    <span style={{ fontSize: 13.5, color: '#475569', fontWeight: 500 }}>{perm}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                {!isEditing && (
                    <div className="profile-fade-2 flex flex-wrap gap-3">
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
                                color: '#fff', fontSize: 13.5, fontWeight: 700,
                                padding: '10px 20px', borderRadius: 12, border: 'none',
                                boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
                                cursor: 'pointer', transition: 'all 0.18s',
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                            Edit Profile
                        </button>

                        {user?.role === 'ADMIN' && (
                            <button
                                onClick={() => navigate('/admin')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: '#fff', color: '#7c3aed', fontSize: 13.5, fontWeight: 700,
                                    padding: '10px 20px', borderRadius: 12,
                                    border: '1.5px solid #ddd6fe',
                                    cursor: 'pointer', transition: 'all 0.18s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#f5f3ff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Open Dashboard
                            </button>
                        )}
                        <button
                            onClick={() => { authService.logout(); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: '#fff', color: '#ef4444', fontSize: 13.5, fontWeight: 700,
                                padding: '10px 20px', borderRadius: 12,
                                border: '1.5px solid #fecaca',
                                cursor: 'pointer', transition: 'all 0.18s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
};

export default ProfilePage;
