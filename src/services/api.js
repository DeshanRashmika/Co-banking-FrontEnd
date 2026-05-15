import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  loginWithGoogle: (payload) => api.post('/auth/google', payload),
};

export const accountAPI = {
  getAccounts: () => api.get('/accounts'),
  getAccountDetails: (accountId) => api.get(`/accounts/${accountId}`),
  getBalance: (accountId) => api.get(`/accounts/${accountId}/balance`),
};

export const transactionAPI = {
  getTransactionHistory: (accountId) => api.get(`/transactions/${accountId}`),
  transfer: (transferData) => api.post('/transactions/transfer', transferData),
};

export const billPayAPI = {
  getBills: () => api.get('/bills'),
  payBill: (billData) => api.post('/bills/pay', billData),
};

export const investmentAPI = {
  getPortfolio: () => api.get('/investments/portfolio'),
  buyInvestment: (investmentData) => api.post('/investments/buy', investmentData),
  sellInvestment: (investmentId) => api.post(`/investments/sell/${investmentId}`),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

export default api;
