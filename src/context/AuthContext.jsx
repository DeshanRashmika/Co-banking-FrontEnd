import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { authAPI } from '../services/api';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      setUser(user);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      setUser(user);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
    }
  }, []);

  // Set session from external auth provider (Google, etc.)
  const setSession = useCallback((token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, login, register, logout, setSession }),
    [user, loading, error, login, register, logout, setSession]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
