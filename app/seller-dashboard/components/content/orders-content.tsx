"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function OrdersContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>View and manage customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Order Processing</h3>
          <p className="text-sm text-gray-700 mb-2">This section allows you to track and manage all customer orders.</p>
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>View order details including customer information and purchased items</li>
            <li>Update order status (Processing, Shipped, Delivered, etc.)</li>
            <li>Track order history and manage customer communications</li>
            <li>Generate shipping labels and invoices</li>
          </ul>
        </div>
        <div className="rounded-md border">
          <div className="grid grid-cols-12 border-b bg-gray-50 p-3 text-sm font-medium">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>
          <div className="divide-y">
            <div className="grid grid-cols-12 items-center p-3">
              <div className="col-span-1">#1001</div>
              <div className="col-span-3">James Kamau</div>
              <div className="col-span-2">2025-04-02</div>
              <div className="col-span-2">Ksh 16,899</div>
              <div className="col-span-2">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Completed
                </span>
              </div>
              <div className="col-span-2">
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
            <div className="grid grid-cols-12 items-center p-3">
              <div className="col-span-1">#1002</div>
              <div className="col-span-3">Sarah Wanjiku</div>
              <div className="col-span-2">2025-04-03</div>
              <div className="col-span-2">Ksh 25,999</div>
              <div className="col-span-2">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  Processing
                </span>
              </div>
              <div className="col-span-2">
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
            <div className="grid grid-cols-12 items-center p-3">
              <div className="col-span-1">#1003</div>
              <div className="col-span-3">Michael Ochieng</div>
              <div className="col-span-2">2025-04-04</div>
              <div className="col-span-2">Ksh 9,359</div>
              <div className="col-span-2">
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  Shipped
                </span>
              </div>
              <div className="col-span-2">
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
