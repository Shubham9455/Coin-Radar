// src/pages/Register.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import client from "../api/client"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { toast } from "sonner"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      await client.post("/auth/register", { email, password })
      toast.success("Registered successfully!")
      navigate("/login")
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-4">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Register</h2>
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
          <Button className="w-full" onClick={handleRegister}>
            Create Account
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
