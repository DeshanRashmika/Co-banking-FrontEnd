import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  // Google social login - backend should accept the ID token and return app token + user
  loginWithGoogle: (payload) => api.post('/auth/google', payload),
};

// Account APIs
export const accountAPI = {
  getAccounts: () => api.get('/accounts'),
  getAccountDetails: (accountId) => api.get(`/accounts/${accountId}`),
  getBalance: (accountId) => api.get(`/accounts/${accountId}/balance`),
};

// Transaction APIs
export const transactionAPI = {
  getTransactionHistory: (accountId) => api.get(`/transactions/${accountId}`),
  transfer: (transferData) => api.post('/transactions/transfer', transferData),
};

// Bill Pay APIs
export const billPayAPI = {
  getBills: () => api.get('/bills'),
  payBill: (billData) => api.post('/bills/pay', billData),
};

// Investment APIs
export const investmentAPI = {
  getPortfolio: () => api.get('/investments/portfolio'),
  buyInvestment: (investmentData) => api.post('/investments/buy', investmentData),
  sellInvestment: (investmentId) => api.post(`/investments/sell/${investmentId}`),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

export default api;
