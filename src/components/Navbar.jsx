import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import icon from '../assets/icon.png';
import { FiSettings, FiBell} from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
            <div className="flex items-center gap-6">
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
          <div className="flex items-right gap-3">
            <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors" aria-label="Notifications">
              <FiBell className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors" aria-label="Settings">
              <FiSettings className="w-5 h-5" />
            </button>
            <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white font-bold select-none">
              {user?.firstName?.[0] || 'U'}
            </div>
          </div>
            </div>
            
          )}
        </div>
      </div>
    </nav>
  );
}
