// src/pages/Dashboard.tsx
import { useAuth } from "../auth/tokenContext"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-slate-900 text-white px-4 py-3 shadow">
        <div className="text-xl font-bold">CoinRadar</div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-grow p-6 bg-slate-50">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome! Here’s your dashboard data.
        </p>
      </main>
    </div>
  )
}
