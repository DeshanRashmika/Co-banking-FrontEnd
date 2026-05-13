import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, setSession } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    const onLoad = () => {
      const googleAccounts = globalThis.google?.accounts?.id;

      if (googleAccounts) {
        googleAccounts.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              setLoading(true);
              setError('');

              const res = await authAPI.loginWithGoogle({ idToken: response.credential });
              const { token, user } = res.data;
              setSession(token, user);
              navigate('/dashboard');
            } catch (err) {
              console.error(err);
              setError('Google sign-in failed');
            } finally {
              setLoading(false);
            }
          },
        });

        googleAccounts.renderButton(
          document.getElementById('google-signin'),
          { theme: 'outline', size: 'large' }
        );
      }
    };

    script.addEventListener('load', onLoad);
    return () => {
      script.removeEventListener('load', onLoad);
      script.remove();
    };
  }, [navigate, setSession]);

  return (
    <div className="min-h-screen bg-linear-to-br bg-amber-40 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <img src="/src/assets/home.png" alt="Co Banking" className="mb-6 w-full rounded-lg" />
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
              placeholder="Enter your password"
            />
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-gray-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-secondary font-semibold hover:underline">
            Register
          </Link>
        </p>

        <div id="google-signin" className="mb-4 flex justify-center"></div>
        
      </div>
    </div>
  );
}