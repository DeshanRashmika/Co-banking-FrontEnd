import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import usePeriod from '../hooks/usePeriod';
import icon from '../assets/icon.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { period } = usePeriod({ timeZone: user?.timezone });

  const displayName = user?.name || user?.firstName || (user?.email && user.email.split('@')[0]) || 'User';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={icon} alt="SecureBank" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-black">SecureBank</span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-8">
              <div className="text-sm text-gray-700">{`Good ${period}, ${displayName}`}</div>
              <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Dashboard
              </Link>
              <Link to="/transfer" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Transfer
              </Link>
              <Link to="/bills" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Bills
              </Link>
              <Link to="/investments" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Investments
              </Link>
              <Link to="/transactions" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                History
              </Link>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-1.5 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
