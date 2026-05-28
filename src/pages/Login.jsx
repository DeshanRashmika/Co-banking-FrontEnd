import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';

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
          { theme: 'outline', size: 'large', width: '100%' }
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
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen bg-white flex flex-col md:flex-row"
    >
      {/* Left Side: Illustration/Hero */}
      <div className="hidden md:flex md:w-1/2 bg-[#F5F5F5] items-center justify-center p-12">
        <div className="max-w-md w-full">
          <img src="/src/assets/home2.png" alt="Banking" className="w-full h-auto mb-8 grayscale hover:grayscale-0 transition-all duration-700" />
          <h2 className="text-4xl font-bold tracking-tighter mb-4">Secure, Simple, and Modern Banking.</h2>
          <p className="text-gray-500 text-lg">Experience the next generation of financial management with SecureBank.</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="flex items-center gap-2 mb-6">
            <img src="/src/assets/icon.png" alt="SecureBank" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-bold tracking-tight">SecureBank</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-500 mb-8">Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-gray-500">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-bold uppercase tracking-wider text-gray-500">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-4 rounded-xl transition duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-white px-4 text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div id="google-signin" className="flex justify-center"></div>
          </form>

          <p className="text-center text-gray-500 mt-10">
            Don't have an account?{' '}
            <Link to="/register" className="text-black font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}