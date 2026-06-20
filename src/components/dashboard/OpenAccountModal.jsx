import { FiX, FiCheck, FiInfo } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const ACCOUNT_TYPES = [
  {
    id: 'SAVINGS',
    title: 'Savings Account',
    description: 'Earn high interest on your deposits with no monthly fees.',
    features: ['4.5% Annual Interest', 'Automatic Savings', 'No Minimum Balance'],
    icon: '💰'
  },
  {
    id: 'CHECKING',
    title: 'Checking Account',
    description: 'Perfect for everyday spending and easy access to your money.',
    features: ['Instant Transfers', 'Free Debit Card', 'Unlimited Transactions'],
    icon: '💳'
  }
];

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' }
];

export default function OpenAccountModal({ 
  isOpen, 
  onClose, 
  onOpenAccount, 
  newAccountData, 
  setNewAccountData, 
  isProcessing 
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          <div className="p-8 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-bold text-black">Open New Account</h3>
                <p className="text-gray-500 mt-1">Choose the account that fits your needs.</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 hover:bg-gray-100 rounded-full transition-colors active:scale-95" 
                aria-label="Close modal"
              >
                <FiX className="w-6 h-6 text-black" />
              </button>
            </div>

            <form onSubmit={onOpenAccount} className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 ml-1 block">Select Account Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ACCOUNT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setNewAccountData({ ...newAccountData, accountType: type.id })}
                      className={`relative p-6 rounded-3xl border-2 text-left transition-all duration-300 ${
                        newAccountData.accountType === type.id
                          ? 'border-black bg-black text-white shadow-xl scale-[1.02]'
                          : 'border-gray-100 bg-gray-50 text-black hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-3xl">{type.icon}</span>
                        {newAccountData.accountType === type.id && (
                          <div className="bg-white text-black p-1 rounded-full">
                            <FiCheck className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <h4 className="text-xl font-bold mb-2">{type.title}</h4>
                      <p className={`text-sm mb-4 leading-relaxed ${
                        newAccountData.accountType === type.id ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {type.description}
                      </p>
                      <ul className="space-y-2">
                        {type.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                            <FiCheck className={newAccountData.accountType === type.id ? 'text-white' : 'text-black'} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 ml-1 block">Account Currency</label>
                <div className="flex gap-3">
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => setNewAccountData({ ...newAccountData, currency: curr.code })}
                      className={`flex-1 py-4 rounded-2xl font-bold transition-all border-2 ${
                        newAccountData.currency === curr.code
                          ? 'border-black bg-black text-white'
                          : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {curr.code} ({curr.symbol})
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-2xl flex gap-3 items-start border border-blue-100/50">
                <FiInfo className="mt-1 text-blue-600 shrink-0" />
                <p className="text-sm text-blue-800 leading-relaxed">
                  By opening an account, you agree to our <span className="font-bold underline cursor-pointer">Terms of Service</span> and <span className="font-bold underline cursor-pointer">Banking Regulations</span>.
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white font-bold py-5 rounded-[2rem] text-xl hover:bg-gray-800 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : 'Confirm & Open Account'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

OpenAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpenAccount: PropTypes.func.isRequired,
  newAccountData: PropTypes.shape({
    accountType: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
  }).isRequired,
  setNewAccountData: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};
