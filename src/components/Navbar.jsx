import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          SecureBank
        </Link>

        {user && (
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-secondary transition">
              Dashboard
            </Link>
            <Link to="/transfer" className="hover:text-secondary transition">
              Transfer
            </Link>
            <Link to="/bills" className="hover:text-secondary transition">
              Bills
            </Link>
            <Link to="/investments" className="hover:text-secondary transition">
              Investments
            </Link>
            <Link to="/transactions" className="hover:text-secondary transition">
              History
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
