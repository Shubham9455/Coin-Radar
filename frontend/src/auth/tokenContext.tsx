import { createContext, useState, useContext, useEffect, useCallback } from "react"
import client from "../api/client"
type AuthContextType = {
  token: string | null,
  user: {
    email: string,
    telegram_linked: boolean,
  } | null,
  setToken: (token: string | null) => void
  logout: () => void,
  validateToken: () => void,
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  setToken: () => { },
  logout: () => { },
  validateToken: () => { },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem("access_token"))
  const [user, setUser] = useState<AuthContextType["user"]>(null)

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
    setUser(null)
  }, [])

  const validateToken = async () => {
    if (!token) return

    try {
      const res = await client.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.data || !res.data.email) {
        console.warn("Token invalid or expired.")
        logout()
      } else {
        setUser({
          email: res.data.email,
          telegram_linked: res.data.telegram_linked || false,
        })
      }
    } catch (err) {
      console.error("Error validating token:", err)
      logout()
    }
  }
  // Validate token on first load
  useEffect(() => {
    validateToken()
  }, [token])

  return (
    <AuthContext.Provider value={{ token, setToken, logout, user, validateToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
