import { useState, useEffect } from 'react';
import { accountAPI, transactionAPI } from '../services/api';
import { FiArrowRight, FiInfo } from 'react-icons/fi';

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await accountAPI.getAccounts();
        setAccounts(res.data || []);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load accounts');
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await transactionAPI.transfer({
        ...formData,
        amount: Number.parseFloat(formData.amount),
      });
      setMessage('Transfer successful!');
      setFormData({
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        description: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-12">
      <header className="bg-white border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold tracking-tight">Transfer Money</h1>
          <p className="text-gray-500 mt-2 text-lg">Send funds securely between your accounts or to others.</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-50">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-gray-900 text-white p-4 mb-8 rounded-2xl flex items-center justify-between">
              <span className="font-medium">{message}</span>
              <button onClick={() => setMessage('')} className="text-gray-400 hover:text-white">✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-500">From Account</label>
                <select
                  name="fromAccountId"
                  value={formData.fromAccountId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select source</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} (${account.balance?.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="hidden md:flex justify-center text-gray-300 pt-6">
                <FiArrowRight size={24} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-500">To Account</label>
                <select
                  name="toAccountId"
                  value={formData.toAccountId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select destination</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Amount to Transfer</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full pl-10 pr-4 py-6 bg-gray-50 border border-gray-100 rounded-3xl text-3xl font-bold focus:outline-none focus:border-black transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Note (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="What's this for?"
                rows="3"
              />
            </div>

            <div className="p-4 bg-blue-50/30 rounded-2xl flex gap-3 items-start text-sm text-gray-600 border border-blue-50">
              <FiInfo className="mt-0.5 text-black shrink-0" />
              <p>Transfers between your own accounts are instant and free of charge. External transfers may take up to 24 hours.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-5 rounded-3xl text-xl transition duration-300 hover:bg-gray-800 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing Transfer...' : 'Confirm Transfer'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
