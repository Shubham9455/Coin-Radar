import React from 'react'
import { Button } from '../components/ui/button'
import { useAuth } from '../auth/tokenContext'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate("/login")
  }
  return (
    <div>
      <h1>Dashboard Page</h1>
      <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
        Logout
      </Button>
    </div>
  )
}

export default Dashboard
