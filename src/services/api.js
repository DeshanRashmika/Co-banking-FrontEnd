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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  loginWithGoogle: (payload) => api.post('/auth/google', payload),
  requestPasswordReset: (payload) => api.post('/auth/forgot-password', payload),
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
  changePassword: (passwordData) => api.post('/user/change-password', passwordData),
};

export const accountAPI = {
  getAccounts: () => api.get('/accounts'),
  getAccountDetails: (accountId) => api.get(`/accounts/${accountId}`),
  getBalance: (accountId) => api.get(`/accounts/${accountId}/balance`),
  topUp: (topUpData) => api.post('/accounts/top-up', {
    accountId: topUpData.accountId,
    amount: topUpData.amount,
    accountType: 'SAVINGS', 
    currency: 'USD'
  }),
  createAccount: (accountData) => api.post('/accounts', accountData),
};

export const paymentMethodAPI = {
  getPaymentMethods: () => api.get('/payment-methods'),
  addPaymentMethod: (methodData) => api.post('/payment-methods', methodData),
  deletePaymentMethod: (methodId) => api.delete(`/payment-methods/${methodId}`),
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
  buyInvestment: (investmentData) => api.post('/investments/buy', {
    symbol: investmentData.symbol,
    shares: investmentData.shares,
    purchasePrice: investmentData.price, 
    accountId: investmentData.accountId
  }),
  sellInvestment: (investmentId, sellData) => api.post(`/investments/sell/${investmentId}`, sellData),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

export default api;
