import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setSession } = useAuth();

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

      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
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

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin'),
          { theme: 'outline', size: 'large' }
        );
      }
    };

    script.addEventListener('load', onLoad);
    return () => {
      script.removeEventListener('load', onLoad);
      document.body.removeChild(script);
    };
  }, [navigate, setSession]);

  return (
    <div className="min-h-screen bg-blue-500, from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white-50 rounded-lg shadow-lg p-8 w-full max-w-md">
        <img src="/src/assets/home.png" alt="" />
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
              placeholder="Enter your password"
            />
          </div>
          <form className="mt-4" align="center"></form>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-gray-600 hover:underline"
            >
              Forgot Password?
            </button>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white font-semibold py-2 rounded-lg bg-color-green-500 bg-green-600 transition duration-200 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-secondary font-semibold hover:underline">
            Register
          </a>
        </p>

        {/* Google Sign-In button */}
        <div id="google-signin" className="mb-4 flex justify-center"></div>
        
      </div>
    </div>
  );
}