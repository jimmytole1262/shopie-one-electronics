"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller Settings</CardTitle>
        <CardDescription>Manage your seller account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">About Settings</h3>
          <p className="text-sm text-gray-700 mb-2">These settings control how your store appears to customers and how they can contact you.</p>
          <p className="text-sm text-gray-700">Changes made here will be reflected throughout your storefront.</p>
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="store-name" className="text-sm font-medium">
              Store Name
            </label>
            <Input id="store-name" defaultValue="Shopie-One Electronics" />
          </div>
          <div className="space-y-2">
            <label htmlFor="store-description" className="text-sm font-medium">
              Store Description
            </label>
            <Textarea
              id="store-description"
              defaultValue="Your premier destination for high-quality electronics, gadgets, and accessories. We offer the latest technology at competitive prices with exceptional customer service."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Contact Email
              </label>
              <Input id="email" type="email" defaultValue="jimmytole1262@gmail.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Contact Phone
              </label>
              <Input id="phone" defaultValue="+254 712 345 678" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-medium">
                Currency
              </label>
              <Input id="currency" defaultValue="KES" />
            </div>
            <div className="space-y-2">
              <label htmlFor="tax-rate" className="text-sm font-medium">
                Tax Rate (%)
              </label>
              <Input id="tax-rate" type="number" defaultValue="16" />
            </div>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  )
}
