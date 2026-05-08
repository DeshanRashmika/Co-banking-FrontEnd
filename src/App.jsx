
import 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}