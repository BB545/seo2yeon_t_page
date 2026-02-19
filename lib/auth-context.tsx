"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import type { User } from "@/lib/mock-data"
import { currentUser, adminUser } from "@/lib/mock-data"

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  login: (role: "student" | "admin") => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("edu-user-role")
      if (saved === "admin") return adminUser
      if (saved === "student") return currentUser
    }
    return null
  })

  const login = useCallback((role: "student" | "admin") => {
    const nextUser = role === "admin" ? adminUser : currentUser
    setUser(nextUser)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("edu-user-role", role)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem("edu-user-role")
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === "admin", login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
