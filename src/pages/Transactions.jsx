import { useState, useEffect, useMemo } from 'react';
import { transactionAPI, accountAPI } from '../services/api';
import { 
  FiArrowUpRight, 
  FiArrowDownLeft, 
  FiFilter, 
  FiDownload, 
  FiSearch, 
  FiShoppingBag, 
  FiCoffee, 
  FiHome, 
  FiTruck, 
  FiSmartphone, 
  FiPlusCircle,
  FiRepeat
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_ICONS = {
  'Shopping': <FiShoppingBag />,
  'Food': <FiCoffee />,
  'Housing': <FiHome />,
  'Transport': <FiTruck />,
  'Entertainment': <FiSmartphone />,
  'Transfer': <FiRepeat />,
  'Top Up': <FiPlusCircle />,
  'General': <FiFilter />
};

export default function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await accountAPI.getAccounts();
        const accountsData = res.data || [];
        setAccounts(accountsData);
        if (accountsData.length > 0) {
          setSelectedAccountId(accountsData[0].id);
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load accounts');
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (!selectedAccountId) return;

    const fetchTransactions = async () => {
      setError('');
      setLoading(true);
      try {
        const res = await transactionAPI.getTransactionHistory(selectedAccountId);
        setTransactions(res.data || []);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [selectedAccountId]);

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    const q = searchQuery.toLowerCase().trim();
    return transactions.filter((t) => {
      const desc = (t.description || '').toLowerCase();
      const cat = (t.category || '').toLowerCase();
      const amt = (t.amount || 0).toString();
      return desc.includes(q) || cat.includes(q) || amt.includes(q);
    });
  }, [transactions, searchQuery]);

  const handleExportCSV = () => {
    const items = filteredTransactions.slice(0, visibleCount);
    if (!items || items.length === 0) return;

    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = items.map((t) => [
      new Date(t.date).toISOString(),
      (t.description || '').replace(/"/g, '""'),
      t.category || '',
      t.type || '',
      (t.amount || 0).toFixed(2),
    ]);

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${selectedAccountId}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const getCategoryIcon = (category) => CATEGORY_ICONS[category] || CATEGORY_ICONS['General'];

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black pb-12">
      <header className="bg-white border-b border-gray-100 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Transactions</h1>
            <p className="text-gray-500 mt-2 text-lg">Keep track of your spending and income.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
              <FiDownload /> Export
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95">
              <FiFilter /> Filter
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded shadow-sm">
            {error}
          </div>
        )}

        {/* Account Selector Tabs */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => setSelectedAccountId(account.id)}
              className={`whitespace-nowrap px-8 py-4 rounded-3xl font-bold transition-all ${
                selectedAccountId === account.id
                  ? 'bg-black text-white shadow-xl scale-[1.02]'
                  : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'
              }`}
            >
              {account.accountType === 'SAVINGS' ? 'Savings Account' : 'Checking Account'}
              <span className={`ml-3 text-xs opacity-50 ${selectedAccountId === account.id ? 'text-white' : 'text-gray-400'}`}>
                •••• {account.accountNumber?.slice(-4)}
              </span>
            </button>
          ))}
        </div>

        {/* Transactions Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-xl font-bold">Transaction History</h3>
            <div className="relative max-w-md w-full">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 text-xl" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search description, category..."
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-xs font-bold uppercase tracking-[0.2em] border-b border-gray-50">
                  <th className="px-8 py-6">Transaction</th>
                  <th className="px-8 py-6">Date</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-black/10 border-t-black mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredTransactions.length > 0 ? (
                  <AnimatePresence>
                    {filteredTransactions.slice(0, visibleCount).map((transaction, idx) => (
                      <motion.tr 
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="group hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl transition-colors ${
                              transaction.type === 'credit' ? 'bg-black text-white' : 'bg-gray-50 text-black group-hover:bg-white'
                            }`}>
                              {transaction.type === 'credit' ? <FiArrowDownLeft className="w-5 h-5" /> : <FiArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-bold text-lg">{transaction.description}</p>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">{transaction.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                            <span className="text-lg opacity-50">{getCategoryIcon(transaction.category)}</span>
                            {transaction.category || 'General'}
                          </div>
                        </td>
                        <td className={`px-8 py-6 text-right font-bold text-xl ${
                          transaction.type === 'credit' ? 'text-black' : 'text-gray-400'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan="4" className="py-32 text-center text-gray-300">
                      <div className="mb-6 opacity-5 flex justify-center">
                        <FiSearch size={80} />
                      </div>
                      <p className="text-2xl font-bold text-black">No transactions found</p>
                      <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 border-t border-gray-50 flex items-center justify-center bg-gray-50/30">
            <button
              onClick={() => setVisibleCount((c) => c + 20)}
              disabled={visibleCount >= filteredTransactions.length}
              className="px-10 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              Load more transactions
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
