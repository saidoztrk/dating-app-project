// web-app/src/components/NotificationBell.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Notification {
    NotificationID: number;
    Title: string;
    Message: string;
    CreatedAt: string;
    NotificationType: string;
}

export default function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/notifications?limit=5', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecentNotifications(response.data.data.notifications.slice(0, 5));
            setUnreadCount(response.data.data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 hover:bg-pink-600 rounded-lg transition"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-20 overflow-hidden">
                        <div className="bg-pink-500 text-white p-4 font-semibold flex justify-between items-center">
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                                <span className="bg-white text-pink-500 px-2 py-1 rounded-full text-xs">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {recentNotifications.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    <div className="text-4xl mb-2">🔔</div>
                                    <p>No notifications</p>
                                </div>
                            ) : (
                                recentNotifications.map((notif) => (
                                    <div
                                        key={notif.NotificationID}
                                        className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            setShowDropdown(false);
                                            navigate('/notifications');
                                        }}
                                    >
                                        <h4 className="font-semibold text-sm">{notif.Title}</h4>
                                        <p className="text-xs text-gray-600 mt-1">{notif.Message}</p>
                                        <span className="text-xs text-gray-400 mt-2 block">
                                            {getTimeAgo(notif.CreatedAt)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setShowDropdown(false);
                                navigate('/notifications');
                            }}
                            className="w-full p-3 bg-gray-50 text-pink-500 hover:bg-gray-100 font-semibold text-sm"
                        >
                            View All Notifications
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}