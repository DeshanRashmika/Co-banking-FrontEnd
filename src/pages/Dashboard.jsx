import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { accountAPI, notificationAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, notificationsRes] = await Promise.all([
          accountAPI.getAccounts(),
          notificationAPI.getNotifications(),
        ]);
        setAccounts(accountsRes.data);
        setNotifications(notificationsRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/transfer" className="bg-secondary text-white p-4 rounded-lg hover:bg-green-600 transition text-center font-semibold">
            Transfer Money
          </Link>
          <Link to="/bills" className="bg-accent text-white p-4 rounded-lg hover:bg-amber-600 transition text-center font-semibold">
            Pay Bills
          </Link>
          <Link to="/investments" className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition text-center font-semibold">
            Investments
          </Link>
          <Link to="/transactions" className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition text-center font-semibold">
            Transactions
          </Link>
        </div>

        {/* Accounts */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Your Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <div key={account.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-800">{account.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{account.accountNumber}</p>
                <p className="text-2xl font-bold text-secondary">${account.balance?.toFixed(2)}</p>
                <Link to={`/account/${account.id}`} className="text-secondary text-sm hover:underline mt-2 inline-block">
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications */}
        {notifications.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Notifications</h2>
            <div className="space-y-2">
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-800">{notification.message}</p>
                  <p className="text-gray-500 text-sm mt-1">{new Date(notification.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
