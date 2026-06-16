import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiPlus } from 'react-icons/fi';
import PropTypes from 'prop-types';

export default function TotalBalanceCard({ totalBalance, onTopUpClick, hasAccounts }) {
  return (
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
          onClick={onTopUpClick}
          disabled={!hasAccounts}
          className="flex-1 bg-white/10 backdrop-blur-md text-white py-3.5 rounded-2xl font-bold text-center hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiPlus className="w-4 h-4" /> Top Up
        </button>
      </div>
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gray-800 rounded-full opacity-50 blur-3xl"></div>
    </div>
  );
}

TotalBalanceCard.propTypes = {
  totalBalance: PropTypes.number.isRequired,
  onTopUpClick: PropTypes.func.isRequired,
  hasAccounts: PropTypes.bool.isRequired,
};
