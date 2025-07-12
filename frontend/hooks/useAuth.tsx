"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authAPI, setAuthToken, removeAuthToken, getAuthToken } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  avatar?: { url: string }
  points: number
  isAdmin: boolean
  stats?: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken()
      console.log("Auth token:", token)
      if (token) {
        try {
          const response = await authAPI.getProfile()
          console.log("Profile response:", response)
          setUser(response.data.user)
        } catch (error) {
          console.error("Auth initialization error:", error)
          removeAuthToken()
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authAPI.login({ email, password })
      const { token, user: userData } = response.data

      setAuthToken(token)
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await authAPI.register({ name, email, password })
      const { token, user: userData } = response.data

      setAuthToken(token)
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const logout = (): void => {
    removeAuthToken()
    setUser(null)
  }

  const updateUser = (userData: Partial<User>): void => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
