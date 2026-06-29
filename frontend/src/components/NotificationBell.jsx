import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getNotifications, markAsRead } from '../api/notification.api';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotifications();
        setNotifications(data.notifications || []);
        setError('');
      } catch (err) {
        setError('Unable to load notifications');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const data = await markAsRead(id);

      if (data.success) {
        setNotifications((currentNotifications) =>
          currentNotifications.map((notification) =>
            notification._id === id ? data.notification : notification
          )
        );
      }
    } catch (err) {
      setError('Unable to update notification');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative w-10 h-10 rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer focus:outline-none"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 01-6 0m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-100 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
            <span className="text-xs font-semibold text-slate-500">{unreadCount} unread</span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="px-4 py-6 text-sm text-slate-500 text-center">
                Loading notifications...
              </div>
            )}

            {!loading && error && (
              <div className="px-4 py-6 text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            {!loading && !error && notifications.length === 0 && (
              <div className="px-4 py-6 text-sm text-slate-500 text-center">
                No notifications yet
              </div>
            )}

            {!loading && !error && notifications.map((notification) => (
              <div
                key={notification._id}
                className={`px-4 py-3 border-b border-slate-100 last:border-b-0 ${
                  notification.isRead ? 'bg-white' : 'bg-purple-50/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    notification.isRead ? 'bg-slate-200' : 'bg-purple-600'
                  }`}></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700 leading-snug break-words">
                      {notification.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-400">
                        {formatDate(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-xs font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
