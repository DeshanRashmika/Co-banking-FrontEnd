import { useState, useEffect } from 'react';
import { accountAPI, transactionAPI } from '../services/api';
import { FiArrowRight, FiInfo, FiCheck, FiCreditCard, FiArrowLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Selection, 2: Amount/Note, 3: Review
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

  const handleSelectAccount = (type, id) => {
    setFormData(prev => {
      const newData = { ...prev, [type]: id };
      if (type === 'fromAccountId' && id === prev.toAccountId) newData.toAccountId = '';
      if (type === 'toAccountId' && id === prev.fromAccountId) newData.fromAccountId = '';
      return newData;
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.fromAccountId || !formData.toAccountId) {
        setError('Please select both source and destination accounts.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const amount = Number.parseFloat(formData.amount);
      const sourceAccount = accounts.find(a => a.id === formData.fromAccountId);
      
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount greater than zero.');
        return;
      }
      if (sourceAccount && amount > sourceAccount.balance) {
        setError(`Insufficient funds. Available: $${sourceAccount.balance.toLocaleString()}`);
        return;
      }
      setStep(3);
    }
    setError('');
  };

  const handleConfirmTransfer = async () => {
    setLoading(true);
    try {
      const amount = Number.parseFloat(formData.amount);
      await transactionAPI.transfer({
        ...formData,
        amount,
      });
      setMessage('Transfer successful!');
      setFormData({
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        description: '',
      });
      setStep(1);
      const res = await accountAPI.getAccounts();
      setAccounts(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const sourceAccount = accounts.find(a => a.id === formData.fromAccountId);
  const destAccount = accounts.find(a => a.id === formData.toAccountId);

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-12">
      <header className="bg-white border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold tracking-tight">Transfer Money</h1>
          <div className="flex items-center gap-4 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step === s ? 'bg-black text-white scale-110' : step > s ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s ? <FiCheck /> : s}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${step === s ? 'text-black' : 'text-gray-400'}`}>
                  {s === 1 ? 'Accounts' : s === 2 ? 'Amount' : 'Review'}
                </span>
                {s < 3 && <div className="w-8 h-px bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded shadow-sm">
            {error}
          </motion.div>
        )}

        {message && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-black text-white p-6 mb-8 rounded-[2rem] flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-2 rounded-full"><FiCheck /></div>
              <span className="font-bold text-lg">{message}</span>
            </div>
            <button onClick={() => setMessage('')} className="text-gray-400 hover:text-white transition-colors">✕</button>
          </motion.div>
        )}

        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 block">From Account</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {accounts.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => handleSelectAccount('fromAccountId', acc.id)}
                        className={`p-6 rounded-3xl border-2 text-left transition-all ${
                          formData.fromAccountId === acc.id
                            ? 'border-black bg-black text-white shadow-xl scale-[1.02]'
                            : 'border-gray-50 bg-gray-50 text-black hover:border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <FiCreditCard className="w-6 h-6" />
                          {formData.fromAccountId === acc.id && <FiCheck className="text-white" />}
                        </div>
                        <h4 className="font-bold">{acc.accountType === 'SAVINGS' ? 'Savings Account' : 'Checking Account'}</h4>
                        <p className={`text-2xl font-bold mt-1 ${formData.fromAccountId === acc.id ? 'text-white' : 'text-black'}`}>
                          ${acc.balance?.toLocaleString()}
                        </p>
                        <p className={`text-xs mt-4 opacity-50 font-mono ${formData.fromAccountId === acc.id ? 'text-white' : 'text-gray-400'}`}>
                          •••• {acc.accountNumber?.slice(-4)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 block">To Account</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {accounts.map((acc) => (
                      <button
                        key={acc.id}
                        disabled={acc.id === formData.fromAccountId}
                        onClick={() => handleSelectAccount('toAccountId', acc.id)}
                        className={`p-6 rounded-3xl border-2 text-left transition-all ${
                          formData.toAccountId === acc.id
                            ? 'border-black bg-black text-white shadow-xl scale-[1.02]'
                            : acc.id === formData.fromAccountId
                            ? 'opacity-30 cursor-not-allowed border-gray-100 bg-gray-50'
                            : 'border-gray-50 bg-gray-50 text-black hover:border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <FiCreditCard className="w-6 h-6" />
                          {formData.toAccountId === acc.id && <FiCheck className="text-white" />}
                        </div>
                        <h4 className="font-bold">{acc.accountType === 'SAVINGS' ? 'Savings Account' : 'Checking Account'}</h4>
                        <p className={`text-xs mt-4 opacity-50 font-mono ${formData.toAccountId === acc.id ? 'text-white' : 'text-gray-400'}`}>
                          •••• {acc.accountNumber?.slice(-4)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full bg-black text-white font-bold py-5 rounded-[2rem] text-xl hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
                >
                  Continue
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-400 font-bold hover:text-black transition-colors">
                  <FiArrowLeft /> Back to Selection
                </button>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 block">Amount to Transfer</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-bold text-gray-300">$</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      className="w-full pl-12 pr-6 py-8 bg-gray-50 border-none rounded-[2rem] text-5xl font-bold focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-100"
                      placeholder="0.00"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 block">Note (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-6 py-6 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-black outline-none transition-all resize-none text-lg"
                    placeholder="What's this for?"
                    rows="3"
                  />
                </div>

                <div className="p-6 bg-blue-50/50 rounded-[2rem] flex gap-4 items-start text-sm text-blue-800 border border-blue-100">
                  <FiInfo className="mt-1 shrink-0" />
                  <p className="leading-relaxed">Transfers between your own accounts are instant and free of charge. You can review the details on the next screen.</p>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full bg-black text-white font-bold py-5 rounded-[2rem] text-xl hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
                >
                  Review Transfer
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-8"
              >
                <div className="w-24 h-24 bg-gray-50 text-black rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-inner">
                  <FiArrowRight size={40} className="animate-pulse" />
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold mb-2">Review Transfer</h3>
                  <p className="text-gray-500">Double check the details before confirming.</p>
                </div>

                <div className="bg-gray-50 rounded-[2.5rem] p-8 space-y-6 text-left border border-gray-100">
                  <div className="flex justify-between items-center pb-6 border-b border-gray-200/50">
                    <span className="text-gray-400 font-medium">From</span>
                    <div className="text-right">
                      <p className="font-bold">{sourceAccount?.accountType}</p>
                      <p className="text-xs text-gray-400 font-mono">•••• {sourceAccount?.accountNumber?.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-6 border-b border-gray-200/50">
                    <span className="text-gray-400 font-medium">To</span>
                    <div className="text-right">
                      <p className="font-bold">{destAccount?.accountType}</p>
                      <p className="text-xs text-gray-400 font-mono">•••• {destAccount?.accountNumber?.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-6 border-b border-gray-200/50">
                    <span className="text-gray-400 font-medium">Amount</span>
                    <span className="text-2xl font-bold text-black">${Number(formData.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  {formData.description && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400 font-medium">Note</span>
                      <span className="text-right text-gray-600 font-medium italic">"{formData.description}"</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex-1 px-8 py-5 border-2 border-gray-100 rounded-[2rem] font-bold hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={handleConfirmTransfer}
                    disabled={loading}
                    className="flex-3 px-12 py-5 bg-black text-white rounded-[2rem] font-bold text-xl hover:bg-gray-800 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : 'Confirm Transfer'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
