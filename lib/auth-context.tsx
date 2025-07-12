"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier l'état de connexion au chargement
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        // Vérifier que les données sont valides
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.name && parsedUser.email) {
          setUser(parsedUser)
        } else {
          // Nettoyer les données invalides
          localStorage.removeItem('user')
        }
      }
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error)
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (userData: User) => {
    try {
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
    }
  }

  const logout = () => {
    try {
      setUser(null)
      localStorage.removeItem('user')
      // Nettoyer d'autres données liées à l'utilisateur si nécessaire
      localStorage.removeItem('showWelcome')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
} 