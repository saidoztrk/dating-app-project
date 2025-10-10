// web-app/src/pages/Notifications.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Notification {
    NotificationID: number;
    NotificationType: string;
    Title: string;
    Message: string;
    IsRead: boolean;
    CreatedAt: string;
    RelatedUserID: number;
    RelatedUserName: string;
    RelatedEntityID: number;
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data.data.notifications);
            setUnreadCount(response.data.data.unreadCount);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/notifications/${notificationId}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                'http://localhost:5000/api/notifications/mark-all-read',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchNotifications();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteNotification = async (notificationId: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:5000/api/notifications/${notificationId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchNotifications();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.NotificationID);

        switch (notification.NotificationType) {
            case 'MATCH':
                navigate('/matches');
                break;
            case 'MESSAGE':
                if (notification.RelatedEntityID) {
                    navigate(`/chat/${notification.RelatedEntityID}`);
                }
                break;
            case 'LIKE':
            case 'SUPER_LIKE':
                navigate('/likes');
                break;
            default:
                break;
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'MATCH': return '🎉';
            case 'MESSAGE': return '💬';
            case 'LIKE': return '❤️';
            case 'SUPER_LIKE': return '⭐';
            default: return '🔔';
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">
                        Notifications {unreadCount > 0 && (
                            <span className="text-xl text-pink-500">({unreadCount})</span>
                        )}
                    </h1>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-pink-500 hover:underline"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        <div className="text-6xl mb-4">🔔</div>
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((notification) => (
                            <div
                                key={notification.NotificationID}
                                onClick={() => handleNotificationClick(notification)}
                                className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition ${!notification.IsRead ? 'border-l-4 border-pink-500' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="text-3xl">
                                        {getNotificationIcon(notification.NotificationType)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-semibold ${!notification.IsRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {notification.Title}
                                            </h3>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification.NotificationID);
                                                }}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {notification.Message}
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                            {notification.RelatedUserName && (
                                                <span className="text-sm text-pink-500 font-medium">
                                                    {notification.RelatedUserName}
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-400">
                                                {getTimeAgo(notification.CreatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}