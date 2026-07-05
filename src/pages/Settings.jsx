import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';
import {
  FiUser, FiLock, FiBell, FiSun, FiGlobe,
  FiCheck, FiAlertCircle, FiCamera,
  FiEye, FiEyeOff, FiTrash2, FiShield,
  FiSmartphone, FiMail, FiSettings,
} from 'react-icons/fi';

/* ── Toggle switch ─────────────────────────────────────────── */
function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 ${
        enabled ? 'bg-cyan-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

Toggle.propTypes = {
  enabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

/* ── Password field with show/hide ─────────────────────────── */
function PasswordField({ label, name, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <div className="relative">
        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || '••••••••'}
          className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition-all"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
        </button>
      </div>
    </div>
  );
}

PasswordField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

/* ── Text input field ───────────────────────────────────────── */
function InputField({ label, icon: Icon, type = 'text', name, value, onChange, placeholder, disabled }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

/* ── Section block ──────────────────────────────────────────── */
function SectionBlock({ title, desc, children }) {
  return (
    <div className="mb-8 pb-8 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

/* ── Toast message ──────────────────────────────────────────── */
function Toast({ message }) {
  if (!message.text) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`mb-6 flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
        message.type === 'success'
          ? 'bg-green-50 text-green-700 border border-green-100'
          : 'bg-red-50 text-red-700 border border-red-100'
      }`}
    >
      {message.type === 'success' ? <FiCheck size={16} /> : <FiAlertCircle size={16} />}
      {message.text}
    </motion.div>
  );
}

/* ── Sidebar tab config ─────────────────────────────────────── */
const TABS = [
  { id: 'profile',       label: 'Profile',           icon: FiUser   },
  { id: 'security',      label: 'Security',           icon: FiLock   },
  { id: 'notifications', label: 'Notifications',      icon: FiBell   },
  { id: 'appearance',    label: 'Appearance',          icon: FiSun    },
  { id: 'language',      label: 'Language & Region',  icon: FiGlobe  },
  { id: 'danger',        label: 'Danger Zone',        icon: FiTrash2, danger: true },
];


/* ══════════════════════════════════════════════════════════════
   TAB PANELS
══════════════════════════════════════════════════════════════ */

/* ── Profile tab ────────────────────────────────────────────── */
function ProfileTab({ user }) {
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
    phone:     user?.phone     || '',
    bio:       user?.bio       || '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });
    try {
      // await userAPI.updateProfile(form);
      await new Promise((r) => setTimeout(r, 800)); // simulate
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch {
      setMsg({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save}>
      <AnimatePresence><Toast message={msg} /></AnimatePresence>

      <SectionBlock title="Profile Picture">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="h-20 w-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {user?.firstName?.[0] || 'U'}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-200 rounded-full shadow text-gray-500 hover:text-black transition-colors"
            >
              <FiCamera size={13} />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or GIF · Max 5 MB</p>
            <button type="button" className="mt-2 text-xs font-semibold text-cyan-600 hover:text-cyan-500">
              Upload new photo
            </button>
          </div>
        </div>
      </SectionBlock>

      <SectionBlock title="Personal Information" desc="Update your name, email and contact details.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="First Name" icon={FiUser} name="firstName" value={form.firstName} onChange={handle} placeholder="First name" />
          <InputField label="Last Name"  icon={FiUser} name="lastName"  value={form.lastName}  onChange={handle} placeholder="Last name"  />
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Email Address" icon={FiMail}        type="email" name="email" value={form.email} onChange={handle} placeholder="you@example.com" />
          <InputField label="Phone Number"  icon={FiSmartphone}  type="tel"   name="phone" value={form.phone} onChange={handle} placeholder="+1 555 000 0000"  />
        </div>
        <div className="mt-4 space-y-1.5">
          <label className="text-sm font-semibold text-gray-600">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handle}
            rows={3}
            placeholder="A short bio about yourself…"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition-all"
          />
        </div>
      </SectionBlock>

      <button
        type="submit"
        disabled={saving}
        className="px-7 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 shadow"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
}

/* ── Security tab ───────────────────────────────────────────── */
function SecurityTab() {
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const handle = (e) => setPwd((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    if (pwd.next !== pwd.confirm) { setMsg({ type: 'error', text: 'Passwords do not match.' }); return; }
    setSaving(true); setMsg({ type: '', text: '' });
    try {
      await new Promise((r) => setTimeout(r, 800));
      setMsg({ type: 'success', text: 'Password changed successfully!' });
      setPwd({ current: '', next: '', confirm: '' });
    } catch { setMsg({ type: 'error', text: 'Failed to change password.' }); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={save}>
      <AnimatePresence><Toast message={msg} /></AnimatePresence>

      <SectionBlock title="Change Password" desc="Use a strong password you don't use anywhere else.">
        <div className="space-y-4 max-w-md">
          <PasswordField label="Current Password"  name="current" value={pwd.current} onChange={handle} />
          <PasswordField label="New Password"      name="next"    value={pwd.next}    onChange={handle} placeholder="Min 8 characters" />
          <PasswordField label="Confirm Password"  name="confirm" value={pwd.confirm} onChange={handle} />
        </div>
        <button type="submit" disabled={saving} className="mt-5 px-7 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 shadow">
          {saving ? 'Updating…' : 'Update Password'}
        </button>
      </SectionBlock>

      <SectionBlock title="Two-Factor Authentication" desc="Add an extra layer of protection to your account.">
        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl max-w-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-50 border border-cyan-100 rounded-xl flex items-center justify-center text-cyan-500">
              <FiShield size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Authenticator App</p>
              <p className="text-xs text-gray-400">Not yet configured</p>
            </div>
          </div>
          <button type="button" className="text-xs font-bold text-cyan-600 hover:text-cyan-500 bg-cyan-50 border border-cyan-100 px-3 py-1.5 rounded-lg transition-colors">
            Set Up
          </button>
        </div>
      </SectionBlock>

      <SectionBlock title="Active Sessions" desc="Devices currently logged into your account.">
        {[
          { device: 'Chrome on Windows', location: 'Mumbai, IN', active: true },
          { device: 'Safari on iPhone',  location: 'Delhi, IN',  active: false },
        ].map((s) => (
          <div key={s.device} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              <FiSmartphone className="text-gray-400" size={16} />
              <div>
                <p className="text-sm font-semibold text-gray-800">{s.device}</p>
                <p className="text-xs text-gray-400">{s.location}</p>
              </div>
            </div>
            {s.active
              ? <span className="text-[11px] font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">Current</span>
              : <button type="button" className="text-xs font-semibold text-red-500 hover:text-red-600">Revoke</button>
            }
          </div>
        ))}
      </SectionBlock>
    </form>
  );
}

/* ── Notifications tab ──────────────────────────────────────── */
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    emailTransactions: true, emailSecurity: true, emailMarketing: false,
    pushTransactions: true,  pushSecurity: true,  pushMarketing: false,
    smsOtp: true,            smsAlerts: false,
  });
  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const rows = [
    { section: 'Email',        items: [
      { key: 'emailTransactions', label: 'Transaction alerts',   desc: 'Receive email for every debit/credit.' },
      { key: 'emailSecurity',     label: 'Security alerts',      desc: 'Login attempts and password changes.'  },
      { key: 'emailMarketing',    label: 'Product updates',      desc: 'News, tips and new features.'          },
    ]},
    { section: 'Push',         items: [
      { key: 'pushTransactions',  label: 'Transaction alerts',   desc: 'Instant push for payments and transfers.' },
      { key: 'pushSecurity',      label: 'Security alerts',      desc: 'Suspicious activity warnings.'            },
      { key: 'pushMarketing',     label: 'Promotions',           desc: 'Offers and rewards.'                      },
    ]},
    { section: 'SMS',          items: [
      { key: 'smsOtp',            label: 'One-time passwords',   desc: 'OTPs for login and transactions.'     },
      { key: 'smsAlerts',         label: 'Account alerts',       desc: 'Low balance and large transactions.'  },
    ]},
  ];

  return (
    <div>
      {rows.map(({ section, items }) => (
        <SectionBlock key={section} title={`${section} Notifications`}>
          <div className="space-y-3">
            {items.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <Toggle enabled={prefs[key]} onChange={() => toggle(key)} />
              </div>
            ))}
          </div>
        </SectionBlock>
      ))}
    </div>
  );
}

/* ── Appearance tab ─────────────────────────────────────────── */
function AppearanceTab() {
  const [theme, setTheme] = useState('light');
  const [accent, setAccent] = useState('cyan');
  const [compact, setCompact] = useState(false);

  const accents = [
    { id: 'cyan',   bg: 'bg-cyan-500'   },
    { id: 'blue',   bg: 'bg-blue-500'   },
    { id: 'violet', bg: 'bg-violet-500' },
    { id: 'green',  bg: 'bg-green-500'  },
    { id: 'amber',  bg: 'bg-amber-500'  },
  ];

  return (
    <div>
      <SectionBlock title="Theme" desc="Choose how Co-Banking looks for you.">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-sm">
          {[
            { id: 'light', label: 'Light', icon: '☀️' },
            { id: 'dark',  label: 'Dark',  icon: '🌙' },
            { id: 'system',label: 'System',icon: '💻' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-sm font-semibold transition-all ${
                theme === t.id
                  ? 'border-cyan-400 bg-cyan-50 text-cyan-700'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Accent Colour" desc="Pick a highlight colour used across the UI.">
        <div className="flex gap-3">
          {accents.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAccent(a.id)}
              className={`w-9 h-9 rounded-full ${a.bg} flex items-center justify-center transition-transform hover:scale-110 ${
                accent === a.id ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
              }`}
            >
              {accent === a.id && <FiCheck className="text-white" size={14} />}
            </button>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Display">
        <div className="flex items-center justify-between max-w-sm">
          <div>
            <p className="text-sm font-semibold text-gray-800">Compact Mode</p>
            <p className="text-xs text-gray-400 mt-0.5">Reduce spacing in tables and lists.</p>
          </div>
          <Toggle enabled={compact} onChange={setCompact} />
        </div>
      </SectionBlock>
    </div>
  );
}

/* ── Language tab ───────────────────────────────────────────── */
function LanguageTab() {
  const [lang, setLang] = useState('en');
  const [tz, setTz] = useState('Asia/Kolkata');
  const [currency, setCurrency] = useState('INR');

  return (
    <div>
      <SectionBlock title="Language & Region" desc="Control how dates, currencies and text are displayed.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-600">Language</label>
            <select value={lang} onChange={(e) => setLang(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-600">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
              <option value="INR">INR — ₹</option>
              <option value="USD">USD — $</option>
              <option value="EUR">EUR — €</option>
              <option value="GBP">GBP — £</option>
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-semibold text-gray-600">Time Zone</label>
            <select value={tz} onChange={(e) => setTz(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
              <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </div>
        </div>
        <button className="mt-5 px-7 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all shadow">
          Save Preferences
        </button>
      </SectionBlock>
    </div>
  );
}

/* ── Danger zone tab ────────────────────────────────────────── */
function DangerTab() {
  const [confirm, setConfirm] = useState('');
  return (
    <div>
      <SectionBlock title="Export Data" desc="Download a copy of all your account data.">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all">
          Export as JSON
        </button>
      </SectionBlock>

      <SectionBlock title="Close Account" desc="Permanently delete your account and all associated data. This action cannot be undone.">
        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl max-w-md">
          <p className="text-sm text-red-700 font-medium mb-4">
            Type <span className="font-black">DELETE</span> to confirm account deletion.
          </p>
          <input
            type="text"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Type DELETE"
            className="w-full px-4 py-2.5 bg-white border border-red-200 rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
          />
          <button
            disabled={confirm !== 'DELETE'}
            className="w-full py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow"
          >
            Permanently Delete Account
          </button>
        </div>
      </SectionBlock>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════
   MAIN SETTINGS PAGE
══════════════════════════════════════════════════════════════ */
export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const panels = {
    profile:       <ProfileTab user={user} />,
    security:      <SecurityTab />,
    notifications: <NotificationsTab />,
    appearance:    <AppearanceTab />,
    language:      <LanguageTab />,
    danger:        <DangerTab />,
  };

  const active = TABS.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600">
              <FiSettings size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900">Settings</h1>
              <p className="text-sm text-gray-400 mt-0.5">Manage your account preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">

          {/* ── Sidebar ── */}
          <aside className="w-full md:w-56 shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm">
              {/* Avatar summary */}
              <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-gray-50">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>

              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-0.5 ${
                      isActive
                        ? tab.danger
                          ? 'bg-red-50 text-red-600'
                          : 'bg-gray-900 text-white shadow'
                        : tab.danger
                          ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ── Content panel ── */}
          <main className="flex-1 min-w-0">
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
              {/* Panel heading */}
              <div className="mb-7 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  {active && <active.icon size={18} className={active.danger ? 'text-red-500' : 'text-gray-500'} />}
                  <h2 className={`text-xl font-black tracking-tight ${active?.danger ? 'text-red-600' : 'text-gray-900'}`}>
                    {active?.label}
                  </h2>
                </div>
              </div>

              {/* Animated panel swap */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {panels[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
