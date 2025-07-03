import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from "./components/ProtectedRoutes"
import Landing from './pages/Landing'
import Navbar from './components/Navbar'
import Coins from './pages/Coins'
import News from './pages/News'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>} />
        <Route path="/coins" element={<ProtectedRoute>
          <Coins />
        </ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute>
          <News />
        </ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}
// 