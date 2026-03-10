import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '../api/api'

interface UserInfo {
  id: number
  name: string
  email: string
  role: string
}

interface AuthContextValue {
  token: string | null
  user: UserInfo | null
  isAdmin: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const TOKEN_KEY = 'papeleria_token'
const USER_KEY  = 'papeleria_user'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Lectura síncrona desde localStorage para evitar parpadeo en PrivateRoute
function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function readUser(): UserInfo | null {
  try {
    const saved = localStorage.getItem(USER_KEY)
    return saved ? (JSON.parse(saved) as UserInfo) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicialización perezosa — lee localStorage en el primer render, no en un efecto
  const [token, setToken] = useState<string | null>(readToken)
  const [user, setUser]   = useState<UserInfo | null>(readUser)

  const login = async (newToken: string) => {
    setToken(newToken)
    localStorage.setItem(TOKEN_KEY, newToken)

    try {
      const users = await apiFetch<UserInfo[]>('/api/users', { token: newToken })
      const payload = JSON.parse(atob(newToken.split('.')[1])) as { sub: string }
      const me = users.find((u) => u.email === payload.sub)
      if (me) {
        setUser(me)
        localStorage.setItem(USER_KEY, JSON.stringify(me))
      }
    } catch {
      // Si falla la carga de usuario, el token sigue siendo válido para navegar
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const isAdmin = user?.role?.toLowerCase().includes('admin') ?? false

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
