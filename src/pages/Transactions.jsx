import { useState, useEffect } from 'react';
import { transactionAPI, accountAPI } from '../services/api';
import { FiArrowUpRight, FiArrowDownLeft, FiFilter, FiDownload, FiSearch } from 'react-icons/fi';

export default function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [transactions, setTransactions] = useState([]);
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

  if (loading && accounts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black pb-12">
      <header className="bg-white border-b border-gray-100 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Transactions</h1>
            <p className="text-gray-500 mt-2 text-lg">Keep track of your spending and income across all accounts.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-colors shadow-sm">
              <FiDownload /> Export
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-lg">
              <FiFilter /> Filter
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded text-sm">
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
              {account.name}
              <span className={`ml-3 text-xs opacity-50 ${selectedAccountId === account.id ? 'text-white' : 'text-gray-400'}`}>
                {account.accountNumber?.slice(-4)}
              </span>
            </button>
          ))}
        </div>

        {/* Transactions Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-bold">Transaction History</h3>
            <div className="relative max-w-md w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by description or amount..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-50">
                  <th className="px-8 py-6">Date</th>
                  <th className="px-8 py-6">Description</th>
                  <th className="px-8 py-6">Type</th>
                  <th className="px-8 py-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 text-sm font-medium text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${
                            transaction.type === 'credit' ? 'bg-black text-white' : 'bg-gray-100 text-black'
                          }`}>
                            {transaction.type === 'credit' ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                          </div>
                          <div>
                            <p className="font-bold">{transaction.description}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">{transaction.category || 'General'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
                          transaction.type === 'credit' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className={`px-8 py-6 text-right font-bold text-lg ${
                        transaction.type === 'credit' ? 'text-black' : 'text-gray-400'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}${transaction.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-32 text-center text-gray-400">
                      <div className="mb-6 opacity-10">
                        <FiDownload className="w-16 h-16 mx-auto" />
                      </div>
                      <p className="text-xl font-bold">No transactions found</p>
                      <p className="text-sm mt-1">Try selecting a different account or adjusting filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 border-t border-gray-50 flex items-center justify-center">
            <button className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
              Load more transactions
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
