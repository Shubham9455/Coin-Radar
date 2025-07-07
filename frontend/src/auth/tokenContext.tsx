import { createContext, useState, useContext, useEffect, useCallback } from "react"
import client from "../api/client"
type AuthContextType = {
  token: string | null
  setToken: (token: string | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => { },
  logout: () => { },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem("access_token"))

  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("access_token", newToken)
    } else {
      localStorage.removeItem("access_token")
    }
    setTokenState(newToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("access_token")
    setTokenState(null)
  }, [])

  // 🔒 Validate token on first load
  useEffect(() => {
    const validateToken = async () => {
      if (!token) return

      try {
        const res = await client.get("/auth/me",{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.data || !res.data.email) {
          console.warn("Token invalid or expired.")
          logout()
        }
      } catch (err) {
        console.error("Error validating token:", err)
        logout()
      }
    }

    validateToken()
  }, [token, logout])

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
