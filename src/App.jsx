
import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext.jsx'
import { useAuth } from './hooks/useAuth'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Transfer = lazy(() => import('./pages/Transfer'))
const Transactions = lazy(() => import('./pages/Transactions'))
const Bills = lazy(() => import('./pages/Bills'))
const Investments = lazy(() => import('./pages/Investments'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-950">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) return <LoadingFallback />;
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {user && <Navbar />}
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
            
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/transfer" element={<PrivateRoute><Transfer /></PrivateRoute>} />
            <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
            <Route path="/bills" element={<PrivateRoute><Bills /></PrivateRoute>} />
            <Route path="/investments" element={<PrivateRoute><Investments /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
