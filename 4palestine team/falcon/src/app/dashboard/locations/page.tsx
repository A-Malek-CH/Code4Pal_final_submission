"use client"

import { useState, useEffect } from 'react'
import { DataTable } from "@/components/tables/data-table"
import { locationsColumns } from "@/components/tables/locations-columns"
import { apiClient, Location } from "@/services/api"
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
import { Loader2, RefreshCw } from "lucide-react"

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  const loadLocations = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await apiClient.getLocations()
      if (response.success) {
        setLocations(response.data)
      } else {
        setError(response.message || 'Failed to load locations')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load locations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLocations()
  }, [])

  const handleView = (location: Location) => {
    setSelectedLocation(location)
  }

  const handleViewOnMap = (location: Location) => {
    // Open in a new window/tab with Google Maps or similar
    const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    window.open(googleMapsUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <section className="mx-auto full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Locations</h1>
          <p className="text-muted-foreground">View and manage location data</p>
        </div>
        <Button 
          onClick={loadLocations} 
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

      <Card>
        <CardHeader>
          <CardTitle>Locations List</CardTitle>
          <CardDescription>
            Browse all registered locations and their coordinates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={locationsColumns} 
            data={locations}
            meta={{
              onView: handleView,
              onViewOnMap: handleViewOnMap,
            }}
          />
        </CardContent>
      </Card>

      {/* Location Details Dialog */}
      <Dialog open={!!selectedLocation} onOpenChange={() => setSelectedLocation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Location Details</DialogTitle>
            <DialogDescription>
              View detailed location information
            </DialogDescription>
          </DialogHeader>
          
          {selectedLocation && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">ID</label>
                  <p className="text-sm text-muted-foreground">{selectedLocation.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="text-sm text-muted-foreground">{selectedLocation.type}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-sm text-muted-foreground">{selectedLocation.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Address</label>
                <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Latitude</label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedLocation.latitude?.toFixed(6)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Longitude</label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedLocation.longitude?.toFixed(6)}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Created At</label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedLocation.created_at).toLocaleString()}
                </p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleViewOnMap(selectedLocation)}
                  variant="outline"
                  className="gap-2"
                >
                  View on Map
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedLocation(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}