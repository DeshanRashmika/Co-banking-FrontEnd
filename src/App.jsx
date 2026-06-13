
import 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext.jsx'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transfer from './pages/Transfer'
import Transactions from './pages/Transactions'
import Bills from './pages/Bills'
import Investments from './pages/Investments'

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navbar />
              <Navigate to="/dashboard" />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/transfer"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Transfer />
              </>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Transactions />
              </>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/bills"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Bills />
              </>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/investments"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Investments />
              </>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Profile />
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </AnimatePresence>
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