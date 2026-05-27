import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { accountAPI, notificationAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { FiPlus, FiArrowUpRight, FiArrowDownLeft, FiCreditCard, FiPieChart, FiSettings, FiBell, FiX } from 'react-icons/fi';
import { FaCcVisa, FaPaypal, FaCcMastercard } from 'react-icons/fa';
import homeAsset from '../assets/home.png';

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

  const paymentMethods = [
    { id: 'visa', name: 'Visa •••• 4242', icon: <FaCcVisa /> },
    { id: 'paypal', name: 'PayPal', icon: <FaPaypal /> },
    { id: 'mastercard', name: 'Mastercard', icon: <FaCcMastercard /> },
  ];

  const fetchData = async () => {
    try {
      const [accountsRes, notificationsRes] = await Promise.all([
        accountAPI.getAccounts(),
        notificationAPI.getNotifications(),
      ]);
      setAccounts(accountsRes.data || []);
      setNotifications(notificationsRes.data || []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!topUpAmount || !accounts.length) return;
    
    setIsProcessing(true);
    try {
      await accountAPI.topUp({
        accountId: accounts[0].id, // Default to first account
        amount: Number(topUpAmount),
        paymentMethod: selectedMethod
      });
      setIsTopUpOpen(false);
      setTopUpAmount('');
      fetchData(); // Refresh data
    } catch (err) {
      alert('Top up failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Good morning, {user?.firstName || 'User'}</h1>
            <p className="text-gray-500 mt-1">Here's what's happening with your accounts today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              <FiBell className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              <FiSettings className="w-5 h-5" />
            </button>
            <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
              {user?.firstName?.[0] || 'U'}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded">
            {error}
          </div>
        )}

        {/* Top Grid: Balance and Account Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Total Balance Card */}
          <div className="bg-black text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-gray-400 font-medium">Total Balance</p>
              <h2 className="text-5xl font-bold mt-2 tracking-tighter">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            </div>
            <div className="flex gap-4 mt-8 relative z-10">
              <Link to="/transfer" className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-center hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm">
                <FiArrowUpRight /> Transfer
              </Link>
              <button 
                onClick={() => setIsTopUpOpen(true)}
                className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-bold text-center hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <FiPlus /> Top Up
              </button>
            </div>
            {/* Abstract decorative shape */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gray-800 rounded-full opacity-50 blur-3xl"></div>
          </div>

          {/* Account Cards Carousel/List */}
          <div className="lg:col-span-2 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {accounts.map((account) => (
              <div key={account.id} className="min-w-[300px] bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-gray-50 rounded-2xl">
                    <FiCreditCard className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600 uppercase tracking-widest">Active</span>
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium text-sm">{account.name}</h3>
                  <p className="text-xl font-bold mt-1">${account.balance?.toFixed(2)}</p>
                  <p className="text-gray-400 text-xs mt-4 tracking-widest">•••• •••• •••• {account.accountNumber?.slice(-4)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Grid: Transactions and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Recent Transactions</h3>
              <Link to="/transactions" className="text-sm font-bold hover:underline">View all</Link>
            </div>
            <div className="space-y-6">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 rounded-2xl text-black">
                        {n.message.toLowerCase().includes('received') || n.message.toLowerCase().includes('top up') ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{n.message}</p>
                        <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${n.message.toLowerCase().includes('received') || n.message.toLowerCase().includes('top up') ? 'text-black' : 'text-gray-400'}`}>
                      {n.message.toLowerCase().includes('received') || n.message.toLowerCase().includes('top up') ? '+' : '-'} $--.--
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FiPieChart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No recent transactions to show.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Promo */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/bills" className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors flex flex-col items-center gap-2">
                  <div className="p-2 bg-white rounded-xl shadow-sm"><FiCreditCard /></div>
                  <span className="text-xs font-bold">Pay Bills</span>
                </Link>
                <Link to="/investments" className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors flex flex-col items-center gap-2">
                  <div className="p-2 bg-white rounded-xl shadow-sm"><FiPieChart /></div>
                  <span className="text-xs font-bold">Invest</span>
                </Link>
              </div>
            </div>

            {/* Promo Card using home.png */}
            <div className="bg-[#EFEFEF] rounded-3xl p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Home Loans</h3>
                <p className="text-sm text-gray-600 mb-6">Rates as low as 3.5% APR. Apply in minutes.</p>
                <button className="bg-black text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                  Learn more
                </button>
              </div>
              <img src={homeAsset} alt="Home" className="absolute -right-4 -bottom-4 w-32 h-32 object-contain opacity-20 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </main>

      {/* Top Up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">Top Up Funds</h3>
              <button onClick={() => setIsTopUpOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleTopUp} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Amount</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full pl-12 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-2xl font-bold focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
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
                      <span className="text-[10px] font-bold uppercase">{method.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !topUpAmount}
                className="w-full bg-black text-white font-bold py-5 rounded-2xl text-xl hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Add Funds'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
