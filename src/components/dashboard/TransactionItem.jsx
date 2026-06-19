import { FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import PropTypes from 'prop-types';

export default function TransactionItem({ notification }) {
  const isCredit = notification.message.toLowerCase().includes('received') || 
                   notification.message.toLowerCase().includes('top up');

  return (
    <div className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0 group">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl transition-colors ${
          isCredit
            ? 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white'
            : 'bg-gray-50 text-black group-hover:bg-black group-hover:text-white'
        }`}>
          {isCredit ? <FiArrowDownLeft className="w-5 h-5" /> : <FiArrowUpRight className="w-5 h-5" />}
        </div>
        <div>
          <p className="font-bold text-sm text-black leading-tight">{notification.title || 'Transaction'}</p>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{notification.message}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold text-sm ${isCredit ? 'text-green-600' : 'text-black'}`}>
          {isCredit ? '+' : '-'} $--.--
        </p>
        <p className="text-[10px] text-gray-300 uppercase font-bold tracking-tighter mt-0.5">
          {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}

TransactionItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};
