"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  User,
  Check,
  X
} from "lucide-react";
import {
  Shield,
  UserPlus,
  UserMinus,
  MoreHorizontal
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// User interface
interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
  last_sign_in?: string;
  name?: string;
  avatar_url?: string;
}

export default function UsersPage() {
  // State for users
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');
  
  // State for user form
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  // State for role change confirmation
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'customer'>('customer');
  
  // State for user deletion
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Filter users when search term or role filter changes
  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);
  
  // Fetch all users from the database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");
      
      // In a real app, you'd fetch from your users table
      // For this demo, we'll create some mock data
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@shopie-one.com',
          role: 'admin',
          created_at: '2023-01-15T10:30:00Z',
          last_sign_in: '2023-04-05T08:45:00Z',
          name: 'Admin User',
          avatar_url: 'https://ui-avatars.com/api/?name=Admin+User&background=random'
        },
        {
          id: '2',
          email: 'john.doe@example.com',
          role: 'customer',
          created_at: '2023-02-20T14:15:00Z',
          last_sign_in: '2023-04-04T16:30:00Z',
          name: 'John Doe',
          avatar_url: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
        },
        {
          id: '3',
          email: 'jane.smith@example.com',
          role: 'customer',
          created_at: '2023-03-10T09:45:00Z',
          last_sign_in: '2023-04-03T11:20:00Z',
          name: 'Jane Smith',
          avatar_url: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
        },
        {
          id: '4',
          email: 'manager@shopie-one.com',
          role: 'admin',
          created_at: '2023-01-05T08:00:00Z',
          last_sign_in: '2023-04-06T10:15:00Z',
          name: 'Store Manager',
          avatar_url: 'https://ui-avatars.com/api/?name=Store+Manager&background=random'
        },
        {
          id: '5',
          email: 'alex.wilson@example.com',
          role: 'customer',
          created_at: '2023-03-25T16:40:00Z',
          last_sign_in: '2023-04-02T14:50:00Z',
          name: 'Alex Wilson',
          avatar_url: 'https://ui-avatars.com/api/?name=Alex+Wilson&background=random'
        }
      ];
      
      // In a real application, you would fetch from your database:
      // const { data, error } = await supabase
      //   .from('users')
      //   .select('*')
      //   .order('created_at', { ascending: false });
      
      // if (error) throw error;
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      console.log("Users fetched:", mockUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };
  
  // Filter users based on search term and role
  const filterUsers = () => {
    let filtered = [...users];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  };
  
  // Handle adding a new user
  const handleAddUser = async () => {
    if (!newUserEmail.trim() || !newUserEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    try {
      setIsAddingUser(true);
      
      // In a real app, you'd create the user in your auth system and database
      // For this demo, we'll simulate adding a user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: newUserEmail,
        role: 'customer',
        created_at: new Date().toISOString(),
        name: newUserEmail.split('@')[0],
        avatar_url: `https://ui-avatars.com/api/?name=${newUserEmail.split('@')[0]}&background=random`
      };
      
      // Add to local state
      setUsers(prevUsers => [newUser, ...prevUsers]);
      
      toast.success(`User ${newUserEmail} added successfully`);
      setIsAddUserOpen(false);
      setNewUserEmail('');
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user");
    } finally {
      setIsAddingUser(false);
    }
  };
  
  // Open role change dialog
  const handleRoleChangeClick = (user: User, role: 'admin' | 'customer') => {
    setSelectedUser(user);
    setNewRole(role);
    setIsRoleDialogOpen(true);
  };
  
  // Change user role
  const handleRoleChange = async () => {
    if (!selectedUser) return;
    
    try {
      // In a real app, you'd update the user's role in your database
      // For this demo, we'll update the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id 
            ? { ...user, role: newRole } 
            : user
        )
      );
      
      toast.success(`Changed ${selectedUser.email}'s role to ${newRole}`);
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error changing role:", error);
      toast.error("Failed to change user role");
    }
  };
  
  // Open delete user dialog
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };
  
  // Delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // In a real app, you'd delete the user from your auth system and database
      // For this demo, we'll remove from local state
      setUsers(prevUsers => 
        prevUsers.filter(user => user.id !== userToDelete.id)
      );
      
      toast.success(`User ${userToDelete.email} deleted successfully`);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Users</h1>
          <p className="text-gray-500">Manage users and permissions</p>
        </div>
        <Button 
          onClick={() => setIsAddUserOpen(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={roleFilter === 'all' ? "default" : "outline"}
            onClick={() => setRoleFilter('all')}
            className={roleFilter === 'all' ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            All
          </Button>
          <Button
            variant={roleFilter === 'admin' ? "default" : "outline"}
            onClick={() => setRoleFilter('admin')}
            className={roleFilter === 'admin' ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            Admins
          </Button>
          <Button
            variant={roleFilter === 'customer' ? "default" : "outline"}
            onClick={() => setRoleFilter('customer')}
            className={roleFilter === 'customer' ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            Customers
          </Button>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Sign In</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <Spinner size="lg" className="mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">Loading users...</p>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <p className="text-gray-500">No users found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                      <img
                        src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=random`}
                        alt={user.name || user.email}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name || user.email.split('@')[0]}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? (
                        <Shield className="h-3 w-3 mr-1" />
                      ) : (
                        <User className="h-3 w-3 mr-1" />
                      )}
                      {user.role === 'admin' ? 'Admin' : 'Customer'}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>{formatDate(user.last_sign_in)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {user.role === 'customer' ? (
                          <DropdownMenuItem 
                            onClick={() => handleRoleChangeClick(user, 'admin')}
                            className="text-purple-600"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => handleRoleChangeClick(user, 'customer')}
                            className="text-blue-600"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Remove Admin
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the email address of the user you want to add.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="user@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddUserOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isAddingUser}
            >
              {isAddingUser && <Spinner size="sm" className="mr-2" />}
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Role Change Confirmation Dialog */}
      <AlertDialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              {newRole === 'admin' 
                ? `This will grant admin privileges to ${selectedUser?.email}. They will have full access to manage products, users, and settings.`
                : `This will remove admin privileges from ${selectedUser?.email}. They will no longer have access to the admin dashboard.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRoleChange}
              className={newRole === 'admin' ? "bg-purple-500 hover:bg-purple-600" : "bg-blue-500 hover:bg-blue-600"}
            >
              {newRole === 'admin' ? 'Make Admin' : 'Remove Admin'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              account for {userToDelete?.email} and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
