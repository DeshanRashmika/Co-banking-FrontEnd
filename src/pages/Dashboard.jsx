import { useState,useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { accountAPI, notificationAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { FaCcVisa, FaPaypal, FaCcMastercard } from 'react-icons/fa';
import homeAsset from '../assets/home.png';
import { motion } from 'framer-motion';
import { FiPlus, FiArrowUpRight, FiArrowDownLeft, FiCreditCard, FiPieChart, FiX, FiChevronDown } from 'react-icons/fi';
import usePeriod from '../hooks/usePeriod';

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
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('visa');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpenAccountOpen, setIsOpenAccountOpen] = useState(false);
  const [newAccountData, setNewAccountData] = useState({
    accountType: 'SAVINGS',
    currency: 'USD'
  });

  const { period } = usePeriod({ timeZone: user?.timezone });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [accountsRes, notificationsRes] = await Promise.all([
        accountAPI.getAccounts(),
        notificationAPI.getNotifications(),
      ]);
      setAccounts(accountsRes?.data || []);
      setNotifications(notificationsRes?.data || []);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      if (err.response?.status === 500) {
        setError('Server Error: The banking service is temporarily unavailable. Please try again later.');
      } else {
        setError('Failed to load dashboard data. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  const handleOpenAccount = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await accountAPI.createAccount({
        accountType: newAccountData.accountType,
        currency: newAccountData.currency
      });
      setIsOpenAccountOpen(false);
      setNewAccountData({ accountType: 'SAVINGS', currency: 'USD' });
      await fetchData();
    } catch (err) {
      console.error('Open account error:', err);
      alert(err.response?.data?.message || 'Failed to open account. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    const amount = Number(topUpAmount);
    const targetAccountId = selectedAccountId || (accounts.length > 0 ? accounts[0].id : null);

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (!targetAccountId) {
      alert('Please select a target account.');
      return;
    }

    setIsProcessing(true);
    try {
      await accountAPI.topUp({
        accountId: targetAccountId,
        amount: amount,
        paymentMethod: selectedMethod
      });
      setIsTopUpOpen(false);
      setTopUpAmount('');
      await fetchData(); 
    } catch (err) {
      console.error('Top up error:', err);
      const errorMsg = err.response?.data?.message || 'Top up failed. Please try again.';
      alert(errorMsg);
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              {`Good ${period}, `}{user?.firstName || 'User'}
            </h1>
            <p className="text-gray-500 mt-1">Here's what's happening with your accounts today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-black hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
              aria-label="Refresh data"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => setIsTopUpOpen(true)}
              disabled={loading || accounts.length === 0}
              className="px-6 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus /> Add Funds
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded shadow-sm">
            {error}
          </div>
        )}

        {/* Top Grid: Balance and Account Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Total Balance Card */}
          <div className="lg:col-span-4 bg-black text-white p-8 rounded-[2rem] shadow-xl flex flex-col justify-between relative overflow-hidden min-h-[240px]">
            <div className="relative z-10">
              <p className="text-gray-400 text-sm font-medium">Total Balance</p>
              <h2 className="text-5xl font-bold mt-2 tracking-tighter text-white">
                ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="flex gap-3 mt-8 relative z-10">
              <Link
                to="/transfer"
                className="flex-1 bg-white text-black py-3.5 rounded-2xl font-bold text-center hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <FiArrowUpRight className="w-4 h-4" /> Transfer
              </Link>
              <button
                onClick={() => setIsTopUpOpen(true)}
                disabled={accounts.length === 0}
                className="flex-1 bg-white/10 backdrop-blur-md text-white py-3.5 rounded-2xl font-bold text-center hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPlus className="w-4 h-4" /> Top Up
              </button>
            </div>
            {/* Abstract decorative shape */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gray-800 rounded-full opacity-50 blur-3xl"></div>
          </div>

          {/* Account Cards List */}
          <div className="lg:col-span-8 flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <div key={account.id} className="min-w-[320px] bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all group cursor-default">
                  <div className="flex justify-between items-start mb-10">
                    <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
                      <FiCreditCard className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-3 py-1.5 bg-green-50 text-green-600 rounded-full uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  <div>
                    <h3 className="text-gray-400 font-medium text-sm">
                      {account.accountType === 'SAVINGS' ? 'Savings Account' : 'Checking Account'}
                    </h3>
                    <p className="text-2xl font-bold mt-1 text-black">${(account.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <div className="flex justify-between items-center mt-6">
                      <p className="text-gray-400 text-xs tracking-[0.2em] font-mono">
                        •••• {account.accountNumber?.slice(-4) || '****'}
                      </p>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-red-500/80 border border-white"></div>
                        <div className="w-6 h-6 rounded-full bg-orange-400/80 border border-white"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : !loading && (
              <div className="w-full bg-white border border-dashed border-gray-200 p-8 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 gap-3">
                <div className="p-4 bg-gray-50 rounded-full">
                  <FiPlus className="w-8 h-8 opacity-20" />
                </div>
                <p className="font-bold text-black">No accounts found</p>
                <button 
                  onClick={() => setIsOpenAccountOpen(true)}
                  className="text-gray-400 font-medium text-sm hover:text-black transition-colors"
                >
                  Open your first account
                </button>
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
                      <div className={`p-3 rounded-2xl transition-colors ${
                        n.message.toLowerCase().includes('received') || n.message.toLowerCase().includes('top up') 
                        ? 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white' 
                        : 'bg-gray-50 text-black group-hover:bg-black group-hover:text-white'
                      }`}>
                        {n.message.toLowerCase().includes('received') || n.message.toLowerCase().includes('top up') ? <FiArrowDownLeft className="w-5 h-5" /> : <FiArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-black leading-tight">{n.title || 'Transaction'}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{n.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${n.message.toLowerCase().includes('received') || n.message.toLowerCase().includes('top up') ? 'text-green-600' : 'text-black'}`}>
                        {n.message.toLowerCase().includes('received') || n.message.toLowerCase().includes('top up') ? '+' : '-'} $--.--
                      </p>
                      <p className="text-[10px] text-gray-300 uppercase font-bold tracking-tighter mt-0.5">{new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                    </div>
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
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Rates as low as 3.5% APR.<br />Apply in minutes.</p>
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
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1 block">Target Account</label>
                <div className="relative">
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full p-4 pr-12 bg-gray-50 border-none rounded-2xl font-bold text-black focus:ring-2 focus:ring-black outline-none transition-all appearance-none cursor-pointer"
                  >
                    {!selectedAccountId && <option value="">Select an account</option>}
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} (${acc.balance?.toFixed(2)})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <FiChevronDown className="w-5 h-5" />
                  </div>
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
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${selectedMethod === method.id
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
      {/* Open Account Modal */}
      {isOpenAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-black">Open New Account</h3>
              <button onClick={() => setIsOpenAccountOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close modal">
                <FiX className="w-6 h-6 text-black" />
              </button>
            </div>

            <form onSubmit={handleOpenAccount} className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1 block">Account Type</label>
                <div className="relative">
                  <select
                    value={newAccountData.accountType}
                    onChange={(e) => setNewAccountData({ ...newAccountData, accountType: e.target.value })}
                    className="w-full p-4 pr-12 bg-gray-50 border-none rounded-2xl font-bold text-black focus:ring-2 focus:ring-black outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="SAVINGS">Savings Account</option>
                    <option value="CHECKING">Checking Account</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <FiChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1 block">Currency</label>
                <div className="relative">
                  <select
                    value={newAccountData.currency}
                    onChange={(e) => setNewAccountData({ ...newAccountData, currency: e.target.value })}
                    className="w-full p-4 pr-12 bg-gray-50 border-none rounded-2xl font-bold text-black focus:ring-2 focus:ring-black outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <FiChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white font-bold py-5 rounded-2xl text-xl hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Opening Account...' : 'Open Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
