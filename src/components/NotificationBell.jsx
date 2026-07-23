import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!user?.id) return;

        const fetchUnread = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/notifications/unread/${user.id}`);
                setNotifications(response.data || []);
            } catch (error) {
                console.error('Error fetching unread notifications:', error);
            }
        };

        fetchUnread();
    }, [user?.id]);

    const handleNewNotification = useCallback((newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
    }, []);

    useWebSocket(user?.id, handleNewNotification);

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`${API_URL}/api/notifications/${id}/read`);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!user?.id || notifications.length === 0) return;
        try {
            await axios.put(`${API_URL}/api/notifications/read-all/${user.id}`);
            setNotifications([]);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <div className="relative inline-block text-left">
            {/* Bell Icon & Unread Badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Notifications"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>

                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/4 -translate-y-1/4">
                        {notifications.length > 99 ? '99+' : notifications.length}
                    </span>
                )}
            </button>

            {/* Dropdown Card */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* Dropdown Header */}
                    <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-800">Notifications</span>
                            {notifications.length > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full">
                                    {notifications.length}
                                </span>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 text-sm">
                                No new notifications
                            </div>
                        ) : (
                            notifications.map((note, index) => (
                                <div
                                    key={note.id || index}
                                    onClick={() => note.id && handleMarkAsRead(note.id)}
                                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors flex flex-col gap-1"
                                >
                                    <p className="text-sm font-semibold text-gray-800 leading-snug">
                                        {note.title || 'Alert'}
                                    </p>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {note.message}
                                    </p>
                                    <span className="text-[10px] text-gray-400 mt-1">
                                        {note.createdAt ? new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}