import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../services/api';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiMail, FiPhone, FiCheck, FiAlertCircle, FiCamera, FiShield } from 'react-icons/fi';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal'); 
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await userAPI.updateProfile(personalInfo);
      updateUser(personalInfo);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await userAPI.changePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black pb-12">
      <header className="bg-white border-b border-gray-100 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="h-24 w-24 bg-black rounded-full flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white shadow-lg group-hover:opacity-90 transition-opacity">
                {user?.firstName?.[0] || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-black transition-colors">
                <FiCamera className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight">{user?.firstName} {user?.lastName}</h1>
              <p className="text-gray-500 mt-1">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-md flex items-center gap-1">
                  <FiCheck className="w-3 h-3" /> Verified Account
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <aside className="w-full md:w-64 space-y-1">
            <button
              onClick={() => setActiveTab('personal')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'personal'
                ? 'bg-black text-white shadow-md'
                : 'text-gray-500 hover:bg-white hover:text-black'
                }`}
            >
              <FiUser className="w-5 h-5" /> Personal Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'security'
                ? 'bg-black text-white shadow-md'
                : 'text-gray-500 hover:bg-white hover:text-black'
                }`}
            >
              <FiLock className="w-5 h-5" /> Security & Password
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-400 cursor-not-allowed"
              disabled
            >
              <FiShield className="w-5 h-5" /> Two-Factor Auth <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded ml-auto">SOON</span>
            </button>
          </aside>

          {/* Content Area */}
          <div className="flex-1 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
              >
                {message.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
                <p className="text-sm font-medium">{message.text}</p>
              </motion.div>
            )}

            {activeTab === 'personal' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="personal"
              >
                <div className="mb-8">
                  <h2 className="text-xl font-bold">Personal Information</h2>
                  <p className="text-gray-500 text-sm mt-1">Update your basic profile details.</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">First Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={personalInfo.firstName}
                          onChange={handlePersonalChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          placeholder="First Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Last Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={personalInfo.lastName}
                          onChange={handlePersonalChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          placeholder="Last Name"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handlePersonalChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="Email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full sm:w-auto px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 shadow-lg shadow-black/10"
                    >
                      {isSaving ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="security"
              >
                <div className="mb-8">
                  <h2 className="text-xl font-bold">Security Settings</h2>
                  <p className="text-gray-500 text-sm mt-1">Update your password to keep your account secure.</p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Current Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="currentPassword"
                        value={securityData.currentPassword}
                        onChange={handleSecurityChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">New Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          name="newPassword"
                          value={securityData.newPassword}
                          onChange={handleSecurityChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Confirm New Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={securityData.confirmPassword}
                          onChange={handleSecurityChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full sm:w-auto px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 shadow-lg shadow-black/10"
                    >
                      {isSaving ? 'Updating Password...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
