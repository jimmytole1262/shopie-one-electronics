"use client";

import { useState } from "react";
import { Globe, Mail } from "lucide-react";
import { 
  Save, 
  Bell, 
  Lock,
  CreditCard,
  Truck,
  CheckCircle
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SettingsPage() {
  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Shopie-One Electronics",
    storeDescription: "Your one-stop shop for quality electronics and accessories at affordable prices.",
    contactEmail: "info@shopie-one.com",
    contactPhone: "+254 712 345 678",
    address: "123 Tech Street, Nairobi, Kenya",
    currency: "KSh",
    logo: "/images/logo.png",
    favicon: "/favicon.ico"
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    stockAlerts: true,
    customerMessages: true,
    marketingEmails: false
  });
  
  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    mpesa: true,
    creditCard: true,
    paypal: false,
    bankTransfer: false,
    cashOnDelivery: true
  });
  
  // Shipping settings
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 5000,
    defaultShippingFee: 300,
    internationalShipping: false,
    estimatedDeliveryDays: 3
  });
  
  // Loading states
  const [savingStore, setSavingStore] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingShipping, setSavingShipping] = useState(false);
  
  // Handle store settings change
  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle notification settings change
  const handleNotificationChange = (setting: string, checked: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: checked
    }));
  };
  
  // Handle payment settings change
  const handlePaymentChange = (method: string, checked: boolean) => {
    setPaymentSettings(prev => ({
      ...prev,
      [method]: checked
    }));
  };
  
  // Handle shipping settings change
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingSettings(prev => ({
      ...prev,
      [name]: name === 'internationalShipping' 
        ? (e.target as HTMLInputElement).checked 
        : value === '' ? 0 : parseInt(value)
    }));
  };
  
  // Handle shipping toggle change
  const handleShippingToggle = (setting: string, checked: boolean) => {
    setShippingSettings(prev => ({
      ...prev,
      [setting]: checked
    }));
  };
  
  // Save store settings
  const saveStoreSettings = async () => {
    setSavingStore(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Store settings saved successfully");
    } catch (error) {
      toast.error("Failed to save store settings");
    } finally {
      setSavingStore(false);
    }
  };
  
  // Save notification settings
  const saveNotificationSettings = async () => {
    setSavingNotifications(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Notification settings saved successfully");
    } catch (error) {
      toast.error("Failed to save notification settings");
    } finally {
      setSavingNotifications(false);
    }
  };
  
  // Save payment settings
  const savePaymentSettings = async () => {
    setSavingPayment(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Payment settings saved successfully");
    } catch (error) {
      toast.error("Failed to save payment settings");
    } finally {
      setSavingPayment(false);
    }
  };
  
  // Save shipping settings
  const saveShippingSettings = async () => {
    setSavingShipping(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Shipping settings saved successfully");
    } catch (error) {
      toast.error("Failed to save shipping settings");
    } finally {
      setSavingShipping(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500">Manage your store settings and preferences</p>
      </div>
      
      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Store</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Shipping</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Store Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Manage your store details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    value={storeSettings.storeName}
                    onChange={handleStoreChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={storeSettings.contactEmail}
                    onChange={handleStoreChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  name="storeDescription"
                  rows={3}
                  value={storeSettings.storeDescription}
                  onChange={handleStoreChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={storeSettings.contactPhone}
                    onChange={handleStoreChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    name="currency"
                    value={storeSettings.currency}
                    onChange={handleStoreChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  rows={2}
                  value={storeSettings.address}
                  onChange={handleStoreChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={saveStoreSettings}
                className="bg-orange-500 hover:bg-orange-600"
                disabled={savingStore}
              >
                {savingStore && <Spinner size="sm" className="mr-2" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when new orders are placed
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.orderNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('orderNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when products are low in stock
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.stockAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('stockAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Customer Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for new customer inquiries
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.customerMessages}
                  onCheckedChange={(checked) => handleNotificationChange('customerMessages', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and promotions
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={saveNotificationSettings}
                className="bg-orange-500 hover:bg-orange-600"
                disabled={savingNotifications}
              >
                {savingNotifications && <Spinner size="sm" className="mr-2" />}
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure which payment methods are available in your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">M-Pesa</Label>
                  <p className="text-sm text-muted-foreground">
                    Accept mobile money payments via M-Pesa
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.mpesa}
                  onCheckedChange={(checked) => handlePaymentChange('mpesa', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Credit Card</Label>
                  <p className="text-sm text-muted-foreground">
                    Accept payments via Visa, Mastercard, and other credit cards
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.creditCard}
                  onCheckedChange={(checked) => handlePaymentChange('creditCard', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">PayPal</Label>
                  <p className="text-sm text-muted-foreground">
                    Accept payments via PayPal
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.paypal}
                  onCheckedChange={(checked) => handlePaymentChange('paypal', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Bank Transfer</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to pay via direct bank transfer
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.bankTransfer}
                  onCheckedChange={(checked) => handlePaymentChange('bankTransfer', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Cash on Delivery</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to pay when their order is delivered
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.cashOnDelivery}
                  onCheckedChange={(checked) => handlePaymentChange('cashOnDelivery', checked)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={savePaymentSettings}
                className="bg-orange-500 hover:bg-orange-600"
                disabled={savingPayment}
              >
                {savingPayment && <Spinner size="sm" className="mr-2" />}
                <Save className="mr-2 h-4 w-4" />
                Save Payment Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Options</CardTitle>
              <CardDescription>
                Configure shipping rates and delivery options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultShippingFee">Default Shipping Fee (KSh)</Label>
                  <Input
                    id="defaultShippingFee"
                    name="defaultShippingFee"
                    type="number"
                    value={shippingSettings.defaultShippingFee}
                    onChange={handleShippingChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (KSh)</Label>
                  <Input
                    id="freeShippingThreshold"
                    name="freeShippingThreshold"
                    type="number"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={handleShippingChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedDeliveryDays">Estimated Delivery Days</Label>
                  <Input
                    id="estimatedDeliveryDays"
                    name="estimatedDeliveryDays"
                    type="number"
                    value={shippingSettings.estimatedDeliveryDays}
                    onChange={handleShippingChange}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="internationalShipping"
                    checked={shippingSettings.internationalShipping}
                    onCheckedChange={(checked) => handleShippingToggle('internationalShipping', checked)}
                  />
                  <Label htmlFor="internationalShipping">Enable International Shipping</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={saveShippingSettings}
                className="bg-orange-500 hover:bg-orange-600"
                disabled={savingShipping}
              >
                {savingShipping && <Spinner size="sm" className="mr-2" />}
                <Save className="mr-2 h-4 w-4" />
                Save Shipping Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
