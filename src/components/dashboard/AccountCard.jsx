import { FiCreditCard } from 'react-icons/fi';
import PropTypes from 'prop-types';

export default function AccountCard({ account }) {
  return (
    <div className="min-w-[320px] bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all group cursor-default">
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
        <p className="text-2xl font-bold mt-1 text-black">
          ${(account.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
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
  );
}

AccountCard.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string.isRequired,
    accountType: PropTypes.string,
    balance: PropTypes.number,
    accountNumber: PropTypes.string,
  }).isRequired,
};
