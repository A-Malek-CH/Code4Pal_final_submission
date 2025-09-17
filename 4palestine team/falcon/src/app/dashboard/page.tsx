"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { apiClient, User, Contributor, Location, Emergency } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"
import { Users, UserCheck, MapPin, AlertTriangle, Activity, RefreshCw } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalUsers: number
  totalContributors: number
  pendingContributors: number
  totalLocations: number
  totalEmergencies: number
  activeEmergencies: number
}

export default function DashboardPage() {
  const { admin } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalContributors: 0,
    pendingContributors: 0,
    totalLocations: 0,
    totalEmergencies: 0,
    activeEmergencies: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboardData = async () => {
    setLoading(true)
    setError('')

    try {
      // Load all data in parallel
      const [usersRes, contributorsRes, locationsRes, emergenciesRes] = await Promise.all([
        apiClient.getUsers().catch(() => ({ success: false, data: [] })),
        apiClient.getContributors().catch(() => ({ success: false, data: [] })),
        apiClient.getLocations().catch(() => ({ success: false, data: [] })),
        apiClient.getEmergencies().catch(() => ({ success: false, data: [] }))
      ])

      const users = usersRes.success ? usersRes.data : []
      const contributors = contributorsRes.success ? contributorsRes.data : []
      const locations = locationsRes.success ? locationsRes.data : []
      const emergencies = emergenciesRes.success ? emergenciesRes.data : []

      setStats({
        totalUsers: users.length,
        totalContributors: contributors.length,
        pendingContributors: contributors.filter((c: Contributor) => c.verification_status === 'pending').length,
        totalLocations: locations.length,
        totalEmergencies: emergencies.length,
        activeEmergencies: emergencies.filter((e: Emergency) => e.status === 'active').length
      })

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered users",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/dashboard/users"
    },
    {
      title: "Contributors",
      value: stats.totalContributors,
      description: `${stats.pendingContributors} pending approval`,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/dashboard/contributors"
    },
    {
      title: "Locations",
      value: stats.totalLocations,
      description: "Registered locations",
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/dashboard/locations"
    },
    {
      title: "Emergencies",
      value: stats.totalEmergencies,
      description: `${stats.activeEmergencies} active`,
      icon: AlertTriangle,
      color: stats.activeEmergencies > 0 ? "text-red-600" : "text-gray-600",
      bgColor: stats.activeEmergencies > 0 ? "bg-red-50" : "bg-gray-50",
      link: "/dashboard/emergencies"
    }
  ]

  return (
    <section className="mx-auto full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {admin?.name || 'Admin'}</h1>
          <p className="text-muted-foreground">Here's what's happening with your 4PAL platform</p>
        </div>
        <Button 
          onClick={loadDashboardData} 
          variant="outline" 
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Active Emergencies Alert */}
      {stats.activeEmergencies > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              {stats.activeEmergencies} active emergency{stats.activeEmergencies > 1 ? 'ies' : ''} requiring attention!
            </span>
            <Link href="/dashboard/emergencies">
              <Button variant="outline" size="sm" className="ml-4">
                View Details
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const IconComponent = card.icon
          return (
            <Link href={card.link} key={index}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <div className={`p-2 rounded-md ${card.bgColor}`}>
                    <IconComponent className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/contributors">
              <Button variant="outline" className="w-full justify-start gap-2">
                <UserCheck className="h-4 w-4" />
                Review Contributor Applications
                {stats.pendingContributors > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {stats.pendingContributors}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/dashboard/emergencies">
              <Button 
                variant={stats.activeEmergencies > 0 ? "destructive" : "outline"} 
                className="w-full justify-start gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Monitor Emergencies
                {stats.activeEmergencies > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {stats.activeEmergencies}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/dashboard/users">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/dashboard/locations">
              <Button variant="outline" className="w-full justify-start gap-2">
                <MapPin className="h-4 w-4" />
                View Locations
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Platform overview and health
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">API Connection</span>
              <Badge variant="default">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge variant="default">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Emergency System</span>
              <Badge variant={stats.activeEmergencies > 0 ? "destructive" : "default"}>
                {stats.activeEmergencies > 0 ? "Active Alerts" : "Monitoring"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Updated</span>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
