"use client"

import { useState, useEffect } from 'react'
import { DataTable } from "@/components/tables/data-table"
import { usersColumns } from "@/components/tables/users-columns"
import { apiClient, User } from "@/services/api"
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, RefreshCw } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await apiClient.getUsers()
      if (response.success) {
        setUsers(response.data)
      } else {
        setError(response.message || 'Failed to load users')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleDelete = async (user: User) => {
    setUserToDelete(user)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return
    
    setActionLoading(true)
    try {
      const response = await apiClient.deleteUser(userToDelete.id)
      
      if (response.success) {
        await loadUsers() // Refresh the data
        setUserToDelete(null)
      } else {
        setError(response.message || 'Failed to delete user')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete user')
    } finally {
      setActionLoading(false)
    }
  }

  const handleView = (user: User) => {
    setSelectedUser(user)
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
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage registered users</p>
        </div>
        <Button 
          onClick={loadUsers} 
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
          <CardTitle>Users List</CardTitle>
          <CardDescription>
            View and manage registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={usersColumns} 
            data={users}
            meta={{
              onDelete: handleDelete,
              onView: handleView,
            }}
          />
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View user information and verification status
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">ID</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.first_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.last_name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">User Type</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.user_type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email Verified</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.is_email_verified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Verified</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.is_phone_verified ? 'Yes' : 'No'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Preferred Language</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.preferred_language.toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Registration Date</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedUser.registration_date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              {userToDelete && ` for ${userToDelete.first_name} ${userToDelete.last_name} (${userToDelete.email})`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}