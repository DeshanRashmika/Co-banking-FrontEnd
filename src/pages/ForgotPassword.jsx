import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const isResetMode = Boolean(token);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await authAPI.requestPasswordReset({ email });
      setMessage('If the account exists, a password reset link has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to start password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword({ token, newPassword });
      setMessage('Your password has been reset successfully. You can now sign in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-600 mb-3">Account Recovery</p>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          {isResetMode ? 'Create a new password' : 'Reset your password'}
        </h1>
        <p className="text-gray-500 mb-8">
          {isResetMode
            ? 'Choose a new password for your account.'
            : 'Enter the email address tied to your account and we’ll send a reset link.'}
        </p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm mb-6">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-green-700 text-sm leading-relaxed mb-6">
            {message}
          </div>
        )}

        {isResetMode ? (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-bold uppercase tracking-wider text-gray-500">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black caret-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black caret-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-4 rounded-xl transition duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestReset} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="reset-email" className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black caret-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                placeholder="name@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-4 rounded-xl transition duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="text-center text-gray-500 mt-8">
          Remembered your password?{' '}
          <Link to="/login" className="text-black font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}