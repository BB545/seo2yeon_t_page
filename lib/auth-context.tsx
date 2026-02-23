"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import type { User, UserRole } from "@/lib/mock-data"
import { currentUser, adminUser, assistantAdminUser } from "@/lib/mock-data"

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  isAssistantAdmin: boolean
  isStaff: boolean
  login: (role: "student" | "admin" | "assistant_admin") => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("edu-user-role")
      if (saved === "admin") return adminUser
      if (saved === "assistant_admin") return assistantAdminUser
      if (saved === "student") return currentUser
    }
    return null
  })

  const login = useCallback((role: UserRole) => {
    let nextUser

    if (role === "admin") nextUser = adminUser
    else if (role === "assistant_admin") nextUser = assistantAdminUser
    else nextUser = currentUser

    setUser(nextUser)
    sessionStorage.setItem("edu-user-role", role)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem("edu-user-role")
  }, [])

  const isAdmin = user?.role === "admin"
  const isAssistantAdmin = user?.role === "assistant_admin"
  const isStaff = user?.role === "admin" || user?.role === "assistant_admin"

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isAssistantAdmin,
      isStaff,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
