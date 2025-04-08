"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutGrid, 
  PackageOpen, 
  User, 
  Settings as SettingsIcon, 
  Menu, 
  X,
  LogOut as LogOutIcon
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutGrid className="h-5 w-5" />,
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: <PackageOpen className="h-5 w-5" />,
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <SettingsIcon className="h-5 w-5" />,
    },
  ];

  if (!isMounted) {
    return null; // Prevent hydration errors
  }

  return (
    <>
      {/* Hide the main site header */}
      <style jsx global>{`
        header.main-site-header {
          display: none;
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Sidebar Toggle */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-white rounded-md shadow-md"
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Dashboard Logo */}
          <div className="p-4 border-b">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-orange-500">Shopie-One</span>
              <span className="text-xl font-semibold">Dashboard</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-colors ${
                  pathname === item.href
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <UserButton afterSignOutUrl="/" />
                <div>
                  <p className="text-sm font-medium">Admin</p>
                </div>
              </div>
              <Link 
                href="/api/auth/signout" 
                className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
              >
                <LogOutIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        <div className="p-6 md:p-10">
          {children}
        </div>
      </main>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
    </>
  );
}
