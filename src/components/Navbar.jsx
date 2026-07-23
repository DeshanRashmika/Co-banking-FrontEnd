import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { notificationAPI } from '../services/api';
import icon from '../assets/icon.png';
import { FiSettings, FiBell, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import { useWebSocket } from '../hooks/useWebSocket';


export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const handleNewNotification = useCallback((data) => {
    setNotifications((prev) => [data, ...prev]);
  }, []);
  useWebSocket(user?.id, handleNewNotification);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleToggleNotifications = async () => {
    const opening = !isNotificationsOpen;
    setIsNotificationsOpen(opening);
    if (opening) {
      setNotifLoading(true);
      try {
        const res = await notificationAPI.getNotifications();
        setNotifications(res?.data || []);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setNotifLoading(false);
      }
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Transfer', path: '/transfer' },
    { name: 'Bills', path: '/bills' },
    { name: 'Investments', path: '/investments' },
    { name: 'History', path: '/transactions' },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Section: Logo and Links */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={icon} alt="SecureBank" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold tracking-tight text-black">SecureBank</span>
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname === link.path
                      ? 'text-black bg-gray-50'
                      : 'text-gray-500 hover:text-black hover:bg-gray-50'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Section: Icons and Profile */}
          {user && (
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={handleToggleNotifications}
                  className={`p-2 rounded-full transition-colors relative ${isNotificationsOpen ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                    }`}
                  aria-label="Notifications"
                >
                  <FiBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex min-w-5 h-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-xs font-medium text-red-500">{unreadCount} new</span>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifLoading ? (
                        <div className="px-4 py-6 flex justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-black/10 border-t-black"></div>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="px-4 py-4 text-center text-gray-400 text-sm">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => handleMarkAsRead(n.id)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!n.read ? 'bg-blue-50/30' : ''}`}
                          >
                            <p className={`text-sm font-medium text-black ${!n.read ? 'font-bold' : ''}`}>{n.title || 'Notification'}</p>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-gray-300 mt-1">{new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <button
                className="p-2 text-gray-500 hover:bg-gray-50 hover:text-black rounded-full transition-colors"
                aria-label="Settings"
                onClick={() => navigate('/settings')}
              >
                <FiSettings className="w-5 h-5" />
              </button>

              <div className="h-6 w-px bg-gray-100 mx-2"></div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-2 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-sm font-bold text-black truncate">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      <FiUser className="w-4 h-4" />
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      <FiSettings className="w-4 h-4" />
                      Settings
                    </Link>

                    <div className="h-px bg-gray-50 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
