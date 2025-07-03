import { createContext, useState, useContext, useCallback } from "react"

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
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("access_token")
  })

  const logout = useCallback(() => {
    localStorage.removeItem("access_token")
    setToken(null)
  }, [])

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
