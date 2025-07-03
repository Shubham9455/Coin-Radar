// src/pages/Login.tsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import client from "@/api/client"
import { useAuth } from "@/auth/tokenContext"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { token,setToken } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (token) {
      navigate("/dashboard")
    }
    console.log("Token in Login:", token)
  }, [token, navigate])
  const handleLogin = async () => {
    try {
      const form = new URLSearchParams()
      form.append("username", email)
      form.append("password", password)

      const res = await client.post("/auth/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })

      const user_token = res.data.access_token
      localStorage.setItem("access_token", user_token)
      setToken(user_token)
      console.log("Token set in Login:", user_token)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-4">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Login</h2>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <Input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
