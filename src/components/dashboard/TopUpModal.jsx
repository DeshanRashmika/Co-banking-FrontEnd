import { FiX, FiCheck, FiChevronDown, FiDollarSign } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_AMOUNTS = [10, 50, 100, 500];

export default function TopUpModal({ 
  isOpen, 
  onClose, 
  onTopUp, 
  accounts, 
  activeAccountId, 
  setActiveAccountId, 
  topUpAmount, 
  setTopUpAmount, 
  selectedMethod, 
  setSelectedMethod, 
  isProcessing,
  paymentMethods
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          <div className="p-8 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-black">Top Up Funds</h3>
                <p className="text-gray-500 text-sm mt-1">Add money to your account instantly.</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95" 
                aria-label="Close modal"
              >
                <FiX className="w-6 h-6 text-black" />
              </button>
            </div>

            <form onSubmit={onTopUp} className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 ml-1 block">Enter Amount</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-300">$</span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    min="1"
                    step="0.01"
                    className="w-full pl-12 pr-6 py-6 bg-gray-50 border-none rounded-3xl text-3xl font-bold focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-200"
                  />
                </div>
                <div className="flex gap-2">
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt.toString())}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                        topUpAmount === amt.toString()
                          ? 'border-black bg-black text-white shadow-md'
                          : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      +${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 ml-1 block">Target Account</label>
                <div className="relative">
                  <select
                    value={activeAccountId || ''}
                    onChange={(e) => setActiveAccountId(e.target.value)}
                    required
                    className="w-full p-5 pr-12 bg-gray-50 border-none rounded-2xl font-bold text-black focus:ring-2 focus:ring-black outline-none transition-all appearance-none cursor-pointer"
                  >
                    {!activeAccountId && <option value="">Select an account</option>}
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountType === 'SAVINGS' ? 'Savings' : 'Checking'} •••• {acc.accountNumber?.slice(-4)} (${acc.balance?.toFixed(2)})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <FiChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 ml-1 block">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        selectedMethod === method.id
                          ? 'border-black bg-black text-white shadow-lg'
                          : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      <div className="text-2xl mb-1">{method.icon}</div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{method.id}</span>
                      {selectedMethod === method.id && (
                        <div className="absolute top-2 right-2 bg-white text-black p-0.5 rounded-full">
                          <FiCheck className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !topUpAmount || accounts.length === 0}
                className="w-full bg-black text-white font-bold py-5 rounded-[2rem] text-xl hover:bg-gray-800 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FiDollarSign />
                    <span>Add Funds</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

TopUpModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onTopUp: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  activeAccountId: PropTypes.string,
  setActiveAccountId: PropTypes.func.isRequired,
  topUpAmount: PropTypes.string.isRequired,
  setTopUpAmount: PropTypes.func.isRequired,
  selectedMethod: PropTypes.string.isRequired,
  setSelectedMethod: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  paymentMethods: PropTypes.array.isRequired,
};
