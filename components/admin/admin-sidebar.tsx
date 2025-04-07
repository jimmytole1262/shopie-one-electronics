import Link from "next/link"
import { BarChart, Box, Home, Package, Settings, ShoppingCart, Tag, Users, User } from "lucide-react"

export default function AdminSidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r h-screen">
      <div className="p-6 border-b">
        <Link href="/admin/dashboard" className="flex items-center">
          <span className="text-2xl font-bold text-orange-500">Q</span>
          <span className="text-xl font-semibold">uickCart</span>
          <span className="ml-2 text-xs font-medium bg-slate-100 px-2 py-0.5 rounded">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-orange-50 text-orange-600"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <Package className="h-5 w-5" />
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <ShoppingCart className="h-5 w-5" />
            Orders
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <Tag className="h-5 w-5" />
            Categories
          </Link>
          <Link
            href="/admin/customers"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <Users className="h-5 w-5" />
            Customers
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <BarChart className="h-5 w-5" />
            Analytics
          </Link>
          <Link
            href="/admin/inventory"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <Box className="h-5 w-5" />
            Inventory
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@shopie-one.co.ke</p>
          </div>
        </div>
      </div>
    </div>
  )
}

