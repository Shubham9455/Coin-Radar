// src/pages/Landing.tsx
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-slate-100 to-slate-300">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to CoinRadar</h1>
      <p className="text-lg md:text-xl mb-8 text-muted-foreground">
        Stay ahead with insights, alerts, and your personalized dashboard.
      </p>
      <Button onClick={() => navigate("/login")} className="text-lg px-6 py-2">
        Login
      </Button>
    </div>
  )
}
