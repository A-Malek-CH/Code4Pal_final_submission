"use client"

import { useState, useEffect } from 'react'
import { DataTable } from "@/components/tables/data-table"
import { contributorsColumns } from "@/components/tables/contributors-columns"
import { apiClient, Contributor } from "@/services/api"
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

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadContributors = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await apiClient.getContributors()
      if (response.success) {
        setContributors(response.data)
      } else {
        setError(response.message || 'Failed to load contributors')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load contributors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContributors()
  }, [])

  const handleApprove = async (contributor: Contributor) => {
    setActionLoading(true)
    try {
      const response = await apiClient.updateContributor(contributor.id, {
        verification_status: 'approved',
        verified: true
      })
      
      if (response.success) {
        await loadContributors() // Refresh the data
      } else {
        setError(response.message || 'Failed to approve contributor')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to approve contributor')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (contributor: Contributor) => {
    setActionLoading(true)
    try {
      const response = await apiClient.updateContributor(contributor.id, {
        verification_status: 'rejected',
        verified: false
      })
      
      if (response.success) {
        await loadContributors() // Refresh the data
      } else {
        setError(response.message || 'Failed to reject contributor')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reject contributor')
    } finally {
      setActionLoading(false)
    }
  }

  const handleView = (contributor: Contributor) => {
    setSelectedContributor(contributor)
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
          <h1 className="text-2xl font-bold">Contributors</h1>
          <p className="text-muted-foreground">Manage contributor applications and verification</p>
        </div>
        <Button 
          onClick={loadContributors} 
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
          <CardTitle>Contributors List</CardTitle>
          <CardDescription>
            Review and approve contributor applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={contributorsColumns} 
            data={contributors}
            meta={{
              onApprove: handleApprove,
              onReject: handleReject,
              onView: handleView,
            }}
          />
        </CardContent>
      </Card>

      {/* Contributor Details Dialog */}
      <Dialog open={!!selectedContributor} onOpenChange={() => setSelectedContributor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contributor Details</DialogTitle>
            <DialogDescription>
              Review contributor application details
            </DialogDescription>
          </DialogHeader>
          
          {selectedContributor && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">ID</label>
                  <p className="text-sm text-muted-foreground">{selectedContributor.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">User ID</label>
                  <p className="text-sm text-muted-foreground">{selectedContributor.user_id}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="text-sm text-muted-foreground">{selectedContributor.contributor_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <p className="text-sm text-muted-foreground">{selectedContributor.verification_status}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Motivation</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedContributor.motivation}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Created At</label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedContributor.created_at).toLocaleString()}
                </p>
              </div>
              
              {selectedContributor.verification_status === 'pending' && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => {
                      handleApprove(selectedContributor)
                      setSelectedContributor(null)
                    }}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      handleReject(selectedContributor)
                      setSelectedContributor(null)
                    }}
                    disabled={actionLoading}
                    variant="destructive"
                  >
                    {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedContributor(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}