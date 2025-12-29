"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { User, Camera, Star, Award, Shield, Lock, Eye, EyeOff, Save, Upload } from "lucide-react"

export function SellerProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Green Valley Farms",
    email: "contact@greenvalleyfarms.com",
    phone: "+1 (555) 123-4567",
    address: "123 Farm Road, Green Valley, CA 90210",
    website: "www.greenvalleyfarms.com",
    description:
      "Family-owned organic farm specializing in fresh vegetables, fruits, and herbs. We've been serving the community with pesticide-free produce for over 20 years.",
    specialties: ["Organic Vegetables", "Fresh Fruits", "Herbs & Spices"],
    certifications: ["USDA Organic", "Non-GMO Project", "Fair Trade"],
    businessHours: "Monday - Saturday: 8:00 AM - 6:00 PM",
    deliveryRadius: "50 miles",
    minimumOrder: "$25.00",
  })

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    streamReminders: true,
    marketingEmails: false,
    weeklyReports: true,
    customerMessages: true,
  })

  const profileStats = {
    rating: 4.8,
    totalReviews: 247,
    totalSales: 1456,
    joinDate: "March 2022",
    completionRate: 98,
    responseTime: "< 2 hours",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Seller Profile</h2>
          <p className="text-muted-foreground">Manage your profile and account settings</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={
            isEditing
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          }
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <Card className="lg:col-span-1 border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                      GV
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1">{profileData.name}</h3>
                <p className="text-muted-foreground mb-4">Organic Farm Seller</p>

                <div className="flex items-center justify-center gap-1 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= Math.floor(profileStats.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium ml-1">{profileStats.rating}</span>
                  <span className="text-sm text-muted-foreground">({profileStats.totalReviews} reviews)</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">{profileStats.joinDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Sales</span>
                    <span className="font-medium">{profileStats.totalSales}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-medium">{profileStats.responseTime}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Profile Completion</span>
                    <span className="font-medium">{profileStats.completionRate}%</span>
                  </div>
                  <Progress value={profileStats.completionRate} className="h-2" />
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    <Award className="h-3 w-3 mr-1" />
                    Top Seller
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farm-name">Farm/Business Name</Label>
                    <Input
                      id="farm-name"
                      value={profileData.name}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Farm Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={profileData.description}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Specialties</Label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                    {isEditing && (
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Add Specialty
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Certifications</Label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.certifications.map((cert, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800">
                        <Shield className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                    {isEditing && (
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Add Certification
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
              <CardDescription>Configure your business operations and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-hours">Business Hours</Label>
                    <Input
                      id="business-hours"
                      value={profileData.businessHours}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, businessHours: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-radius">Delivery Radius</Label>
                    <Input
                      id="delivery-radius"
                      value={profileData.deliveryRadius}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, deliveryRadius: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimum-order">Minimum Order</Label>
                    <Input
                      id="minimum-order"
                      value={profileData.minimumOrder}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, minimumOrder: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment Methods</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="credit-card" defaultChecked />
                        <Label htmlFor="credit-card">Credit/Debit Cards</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="paypal" defaultChecked />
                        <Label htmlFor="paypal">PayPal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="bank-transfer" />
                        <Label htmlFor="bank-transfer">Bank Transfer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="cash-on-delivery" />
                        <Label htmlFor="cash-on-delivery">Cash on Delivery</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Shipping Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="local-delivery" defaultChecked />
                        <Label htmlFor="local-delivery">Local Delivery</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="pickup" defaultChecked />
                        <Label htmlFor="pickup">Farm Pickup</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="shipping" />
                        <Label htmlFor="shipping">National Shipping</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Return & Refund Policy</Label>
                <Textarea rows={4} placeholder="Describe your return and refund policy..." disabled={!isEditing} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="order-updates">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified when you receive new orders</p>
                  </div>
                  <Switch
                    id="order-updates"
                    checked={notifications.orderUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, orderUpdates: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="stream-reminders">Stream Reminders</Label>
                    <p className="text-sm text-muted-foreground">Reminders for scheduled live streams</p>
                  </div>
                  <Switch
                    id="stream-reminders"
                    checked={notifications.streamReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, streamReminders: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="customer-messages">Customer Messages</Label>
                    <p className="text-sm text-muted-foreground">Messages from customers and inquiries</p>
                  </div>
                  <Switch
                    id="customer-messages"
                    checked={notifications.customerMessages}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, customerMessages: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-reports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Weekly sales and performance reports</p>
                  </div>
                  <Switch
                    id="weekly-reports"
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Tips, promotions, and platform updates</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your profile visibility and data sharing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Make your profile visible to all users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Contact Information</Label>
                    <p className="text-sm text-muted-foreground">Display phone and email on your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics Sharing</Label>
                    <p className="text-sm text-muted-foreground">Share anonymous data to improve platform</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                </div>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500">Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable 2FA</Label>
                  <p className="text-sm text-muted-foreground">Secure your account with two-factor authentication</p>
                </div>
                <Switch />
              </div>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Setup Authenticator App
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account data and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline">
                  <Lock className="h-4 w-4 mr-2" />
                  Deactivate Account
                </Button>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
