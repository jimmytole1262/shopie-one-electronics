"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface Admin {
  id: string
  email: string
  role: string
  created_at: string
}

const ADMIN_EMAIL = 'jimmytole1262@gmail.com'

export default function AdminsContent() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false)
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)
  const [isRemovingAdmin, setIsRemovingAdmin] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState('')

  // Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoadingAdmins(true)
      try {
        const response = await fetch('/api/admins')
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            toast.error("Authentication error: You don't have permission to access this resource")
            return
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        setAdmins(data)
      } catch (error) {
        console.error("Failed to fetch admins:", error)
        toast.error("Failed to load admins")
      } finally {
        setIsLoadingAdmins(false)
      }
    }
    
    fetchAdmins()
  }, [])

  // Handle add admin
  const handleAddAdmin = async () => {
    if (!newAdminEmail) return
    
    setIsAddingAdmin(true)
    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newAdminEmail }),
      })
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error("Authentication error: You don't have permission to add admins")
          return
        }
        
        try {
          const error = await response.json()
          toast.error(error.error || `Error ${response.status}: ${response.statusText}`)
        } catch {
          toast.error(`Error ${response.status}: ${response.statusText}`)
        }
        return
      }
      
      const newAdmin = await response.json()
      setAdmins([newAdmin, ...admins])
      setNewAdminEmail('')
      toast.success(`Added ${newAdminEmail} as admin`)
    } catch (error) {
      console.error('Error adding admin:', error)
      toast.error('An error occurred while adding the admin')
    } finally {
      setIsAddingAdmin(false)
    }
  }

  // Handle remove admin
  const handleRemoveAdmin = async (id: string) => {
    if (confirm("Are you sure you want to remove this admin?")) {
      setIsRemovingAdmin(true)
      try {
        const response = await fetch(`/api/admins/${id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            toast.error("Authentication error: You don't have permission to remove admins")
            return
          }
          
          try {
            const error = await response.json()
            toast.error(error.error || `Error ${response.status}: ${response.statusText}`)
          } catch {
            toast.error(`Error ${response.status}: ${response.statusText}`)
          }
          return
        }
        
        // Update admins state
        setAdmins(admins.filter(admin => admin.id !== id))
        toast.success("Admin removed successfully")
      } catch (error) {
        console.error("Error removing admin:", error)
        toast.error("An error occurred while removing the admin")
      } finally {
        setIsRemovingAdmin(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Management</CardTitle>
        <CardDescription>Manage admin users and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-md">
          <h3 className="text-lg font-semibold text-orange-700 mb-2">Primary Admin</h3>
          <p className="text-sm text-gray-700">The primary admin ({ADMIN_EMAIL}) has full access to all features and cannot be removed.</p>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Admin Users</h3>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-gray-50 p-3 text-sm font-medium">
                <div className="col-span-5">Email</div>
                <div className="col-span-3">Role</div>
                <div className="col-span-2">Added</div>
                <div className="col-span-2">Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-12 items-center p-3">
                  <div className="col-span-5">{ADMIN_EMAIL}</div>
                  <div className="col-span-3">Super Admin</div>
                  <div className="col-span-2">2025-01-15</div>
                  <div className="col-span-2">
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Primary</span>
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center p-3">
                  <div className="col-span-5">store-manager@shopie-one.co.ke</div>
                  <div className="col-span-3">Store Admin</div>
                  <div className="col-span-2">2025-03-10</div>
                  <div className="col-span-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center p-3">
                  <div className="col-span-5">inventory@shopie-one.co.ke</div>
                  <div className="col-span-3">Inventory</div>
                  <div className="col-span-2">2025-03-22</div>
                  <div className="col-span-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border mt-6">
            <h3 className="text-lg font-medium mb-4">Add New User</h3>
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="Enter email address"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleAddAdmin}
                disabled={isAddingAdmin || !newAdminEmail}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAddingAdmin ? 'Adding...' : 'Add User'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
