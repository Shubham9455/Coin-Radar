import { Button } from "../components/ui/button"
import { useAuth } from "../auth/tokenContext"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { BellIcon, LogOut } from "lucide-react"
import {  } from "lucide-react"
const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/coins", label: "Coins" },
  { to: "/news", label: "News" },
]

export default function Navbar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Coin<span className="text-blue-400">Radar</span>
          </span>
        </Link>

        {/* Nav links */}
        {token && (
          <div className="flex flex-wrap gap-2 md:gap-4">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button
                  variant="ghost"
                  className={`rounded-md px-4 py-2 font-medium transition-all duration-200 ${location.pathname === link.to
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        )}

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          {token ? (
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="rounded-md px-2 py-2 text-white text-center justify-center"
                onClick={() => navigate("/telegram")}
              >
                <BellIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="rounded-md px-4 py-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <>
             
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
