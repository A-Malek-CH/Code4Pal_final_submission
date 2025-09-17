"use client"

import { useState, useEffect } from 'react'
import { DataTable } from "@/components/tables/data-table"
import { emergenciesColumns } from "@/components/tables/emergencies-columns"
import { apiClient, Emergency } from "@/services/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react"

export default function EmergenciesPage() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null)

  const loadEmergencies = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await apiClient.getEmergencies()
      if (response.success) {
        setEmergencies(response.data)
      } else {
        setError(response.message || 'Failed to load emergencies')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load emergencies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmergencies()
  }, [])

  const handleView = (emergency: Emergency) => {
    setSelectedEmergency(emergency)
  }

  const handleViewOnMap = (emergency: Emergency) => {
    // Open in a new window/tab with Google Maps or similar
    const googleMapsUrl = `https://www.google.com/maps?q=${emergency.latitude},${emergency.longitude}`
    window.open(googleMapsUrl, '_blank')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-red-100 text-red-800"
      case "in_progress": return "bg-yellow-100 text-yellow-800"
      case "resolved": return "bg-green-100 text-green-800"
      case "closed": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "medical": return "bg-red-100 text-red-800"
      case "fire": return "bg-orange-100 text-orange-800"
      case "accident": return "bg-yellow-100 text-yellow-800"
      case "crime": return "bg-purple-100 text-purple-800"
      case "natural_disaster": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  // Count active emergencies for dashboard stats
  const activeEmergencies = emergencies.filter(e => e.status === 'active').length

  return (
    <section className="mx-auto full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Emergencies</h1>
          <p className="text-muted-foreground">Monitor and manage emergency reports</p>
        </div>
        <div className="flex items-center gap-4">
          {activeEmergencies > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {activeEmergencies} Active
            </Badge>
          )}
          <Button 
            onClick={loadEmergencies} 
            variant="outline" 
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Emergency Reports</CardTitle>
          <CardDescription>
            View and track emergency incidents reported by users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={emergenciesColumns} 
            data={emergencies}
            meta={{
              onView: handleView,
              onViewOnMap: handleViewOnMap,
            }}
          />
        </CardContent>
      </Card>

      {/* Emergency Details Dialog */}
      <Dialog open={!!selectedEmergency} onOpenChange={() => setSelectedEmergency(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Emergency Details
            </DialogTitle>
            <DialogDescription>
              View detailed emergency report information
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmergency && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Emergency ID</label>
                  <p className="text-sm text-muted-foreground">{selectedEmergency.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Reporter (User ID)</label>
                  <p className="text-sm text-muted-foreground">{selectedEmergency.user_id}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Emergency Type</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getTypeColor(selectedEmergency.emergency_type)}`}>
                      <AlertTriangle className="h-3 w-3" />
                      {selectedEmergency.emergency_type}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(selectedEmergency.status)}`}>
                      {selectedEmergency.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground mt-1 p-2 bg-gray-50 rounded">
                  {selectedEmergency.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Latitude</label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedEmergency.latitude?.toFixed(6)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Longitude</label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedEmergency.longitude?.toFixed(6)}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Reported At</label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedEmergency.created_at).toLocaleString()}
                </p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleViewOnMap(selectedEmergency)}
                  variant="outline"
                  className="gap-2"
                >
                  View on Map
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEmergency(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}