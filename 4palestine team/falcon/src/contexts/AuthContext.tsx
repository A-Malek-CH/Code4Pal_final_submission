"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { apiClient } from '@/services/api'

interface AuthContextType {
  isAuthenticated: boolean
  admin: any | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication status on mount and route changes
  useEffect(() => {
    checkAuth()
  }, [pathname])

  const checkAuth = async () => {
    setLoading(true)
    
    if (apiClient.isAuthenticated()) {
      try {
        const response = await apiClient.getAdminProfile()
        if (response.success) {
          setAdmin(response.data.admin)
          setIsAuthenticated(true)
        } else {
          // Token is invalid, clear it
          await apiClient.adminLogout()
          setIsAuthenticated(false)
          setAdmin(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        await apiClient.adminLogout()
        setIsAuthenticated(false)
        setAdmin(null)
      }
    } else {
      setIsAuthenticated(false)
      setAdmin(null)
    }
    
    setLoading(false)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.adminLogin(email, password)
      if (response.success) {
        setAdmin(response.data.admin)
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await apiClient.adminLogout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsAuthenticated(false)
      setAdmin(null)
      router.push('/admin/login')
    }
  }

  // Redirect logic
  useEffect(() => {
    if (!loading) {
      const isLoginPage = pathname === '/admin/login'
      const isDashboardRoute = pathname?.startsWith('/dashboard')
      
      if (isDashboardRoute && !isAuthenticated) {
        router.push('/admin/login')
      } else if (isLoginPage && isAuthenticated) {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, loading, pathname, router])

  const value = {
    isAuthenticated,
    admin,
    login,
    logout,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/admin/login')
      }
    }, [isAuthenticated, loading, router])

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}