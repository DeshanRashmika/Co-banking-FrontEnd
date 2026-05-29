import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { accountAPI, notificationAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { FiPlus, FiArrowUpRight, FiArrowDownLeft, FiCreditCard, FiPieChart, FiSettings, FiBell, FiX } from 'react-icons/fi';
import { FaCcVisa, FaPaypal, FaCcMastercard } from 'react-icons/fa';
import homeAsset from '../assets/home.png';
import { motion } from 'framer-motion';

const PAYMENT_METHODS = [
  { id: 'visa', name: 'Visa •••• 4242', icon: <FaCcVisa /> },
  { id: 'paypal', name: 'PayPal', icon: <FaPaypal /> },
  { id: 'mastercard', name: 'Mastercard', icon: <FaCcMastercard /> },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Top Up Modal State
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('visa');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [accountsRes, notificationsRes] = await Promise.all([
        accountAPI.getAccounts(),
        notificationAPI.getNotifications(),
      ]);
      setAccounts(accountsRes?.data || []);
      setNotifications(notificationsRes?.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [accountsRes, notificationsRes] = await Promise.all([
          accountAPI.getAccounts(),
          notificationAPI.getNotifications(),
        ]);

        if (!mounted) return;
        setAccounts(accountsRes?.data || []);
        setNotifications(notificationsRes?.data || []);
      } catch (err) {
        if (!mounted) return;
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!topUpAmount || accounts.length === 0) return;
    
    setIsProcessing(true);
    try {
      await accountAPI.topUp({
        accountId: accounts[0].id,
        amount: Number(topUpAmount),
        paymentMethod: selectedMethod
      });
      setIsTopUpOpen(false);
      setTopUpAmount('');
      await fetchData(); // Refresh data using the stable callback
    } catch (err) {
      console.error('Top up error:', err);
      alert('Top up failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalBalance = useMemo(() => 
    accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
  , [accounts]);

  if (loading && accounts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#F9F9F9] text-black pb-12"
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Good morning, {user?.firstName || 'User'}
            </h1>
            <p className="text-gray-500 mt-1">Here's what's happening with your accounts today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors" aria-label="Notifications">
              <FiBell className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors" aria-label="Settings">
              <FiSettings className="w-5 h-5" />
            </button>
            <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white font-bold select-none">
              {user?.firstName?.[0] || 'U'}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded shadow-sm">
            {error}
          </div>
        )}

        {/* Top Grid: Balance and Account Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Total Balance Card */}
          <div className="bg-black text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden min-h-[220px]">
            <div className="relative z-10">
              <p className="text-gray-400 font-medium">Total Balance</p>
              <h2 className="text-5xl font-bold mt-2 tracking-tighter text-white">
                ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="flex gap-4 mt-8 relative z-10">
              <Link 
                to="/transfer" 
                className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-center hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <FiArrowUpRight /> Transfer
              </Link>
              <button 
                onClick={() => setIsTopUpOpen(true)}
                disabled={accounts.length === 0}
                className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-bold text-center hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPlus /> Top Up
              </button>
            </div>
            {/* Abstract decorative shape */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gray-800 rounded-full opacity-50 blur-3xl"></div>
          </div>

          {/* Account Cards List */}
          <div className="lg:col-span-2 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <div key={account.id} className="min-w-[300px] bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-default">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-gray-50 rounded-2xl">
                      <FiCreditCard className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-black text-white rounded uppercase tracking-widest">
                      Active
                    </span>
                  </div>
                  <div>
                    <h3 className="text-gray-500 font-medium text-sm">{account.name}</h3>
                    <p className="text-xl font-bold mt-1 text-black">${(account.balance || 0).toFixed(2)}</p>
                    <p className="text-gray-400 text-xs mt-4 tracking-widest font-mono">
                      •••• •••• •••• {account.accountNumber?.slice(-4) || '****'}
                    </p>
                  </div>
                </div>
              ))
            ) : !loading && (
              <div className="w-full bg-white border border-dashed border-gray-200 p-8 rounded-3xl flex flex-col items-center justify-center text-gray-400 gap-3">
                <FiPlus className="w-8 h-8 opacity-20" />
                <p className="font-medium text-black">No accounts found</p>
                <button className="text-black font-bold text-sm hover:underline">Open your first account</button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Grid: Transactions and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-black">Recent Transactions</h3>
              <Link to="/transactions" className="text-sm font-bold text-black hover:underline underline-offset-4">
                View all
              </Link>
            </div>
            <div className="space-y-6">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0 group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 rounded-2xl text-black group-hover:bg-black group-hover:text-white transition-colors">
                        {n.message.toLowerCase().includes('received') || n.message.toLowerCase().includes('top up') ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-black">{n.message}</p>
                        <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${n.message.toLowerCase().includes('received') || n.message.toLowerCase().includes('top up') ? 'text-black' : 'text-gray-400'}`}>
                      {n.message.toLowerCase().includes('received') || n.message.toLowerCase().includes('top up') ? '+' : '-'} $--.--
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-300">
                  <FiPieChart className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p className="font-medium text-sm">No recent transactions to show.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Promo */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
              <h3 className="text-xl font-bold mb-6 text-black">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/bills" className="p-4 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all flex flex-col items-center gap-2 group">
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-gray-800"><FiCreditCard /></div>
                  <span className="text-xs font-bold uppercase tracking-wider">Bills</span>
                </Link>
                <Link to="/investments" className="p-4 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all flex flex-col items-center gap-2 group">
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-gray-800"><FiPieChart /></div>
                  <span className="text-xs font-bold uppercase tracking-wider">Invest</span>
                </Link>
              </div>
            </div>

            {/* Promo Card */}
            <div className="bg-[#EFEFEF] rounded-3xl p-8 relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 text-black">Home Loans</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Rates as low as 3.5% APR.<br/>Apply in minutes.</p>
                <button className="bg-black text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors">
                  Learn more
                </button>
              </div>
              <img 
                src={homeAsset} 
                alt="Home" 
                className="absolute -right-4 -bottom-4 w-32 h-32 object-contain opacity-20 grayscale group-hover:scale-110 group-hover:opacity-30 transition-all duration-500" 
              />
            </div>
          </div>
        </div>
      </main>

      {/* Top Up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-black">Top Up Funds</h3>
              <button onClick={() => setIsTopUpOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close modal">
                <FiX className="w-6 h-6 text-black" />
              </button>
            </div>

            <form onSubmit={handleTopUp} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    min="1"
                    step="0.01"
                    className="w-full pl-12 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-2xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1 block">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                        selectedMethod === method.id 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-100 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xl">{method.icon}</div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">{method.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !topUpAmount || accounts.length === 0}
                className="w-full bg-black text-white font-bold py-5 rounded-2xl text-xl hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Add Funds'}
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
