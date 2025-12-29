"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Users, DollarSign, Eye, ShoppingCart, Download } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 4000, orders: 240 },
  { month: "Feb", revenue: 3000, orders: 198 },
  { month: "Mar", revenue: 5000, orders: 300 },
  { month: "Apr", revenue: 4500, orders: 278 },
  { month: "May", revenue: 6000, orders: 389 },
  { month: "Jun", revenue: 5500, orders: 349 },
]

const viewerData = [
  { day: "Mon", viewers: 1200, engagement: 85 },
  { day: "Tue", viewers: 1900, engagement: 78 },
  { day: "Wed", viewers: 1400, engagement: 82 },
  { day: "Thu", viewers: 2100, engagement: 88 },
  { day: "Fri", viewers: 2800, engagement: 92 },
  { day: "Sat", viewers: 3200, engagement: 95 },
  { day: "Sun", viewers: 2600, engagement: 89 },
]

const productData = [
  { name: "Organic Vegetables", value: 35, color: "#f97316" },
  { name: "Fresh Fruits", value: 28, color: "#eab308" },
  { name: "Herbs & Spices", value: 20, color: "#22c55e" },
  { name: "Dairy Products", value: 17, color: "#3b82f6" },
]

export function SellerAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your performance and optimize your sales</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$28,000</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Viewers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,200</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Watch Time</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24m 32s</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              -1.2% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="viewers">Viewers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Orders Trend</CardTitle>
              <CardDescription>Monthly revenue and order count over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#f97316" fill="#f97316" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="orders" stroke="#eab308" fill="#eab308" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viewers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Viewers & Engagement</CardTitle>
              <CardDescription>Viewer count and engagement rate by day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={viewerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="viewers" stroke="#f97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="engagement" stroke="#eab308" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Category Distribution</CardTitle>
                <CardDescription>Sales breakdown by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Best selling products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Organic Tomatoes", sales: 245, revenue: "$1,225" },
                    { name: "Fresh Spinach", sales: 189, revenue: "$945" },
                    { name: "Organic Carrots", sales: 167, revenue: "$835" },
                    { name: "Mixed Herbs", sales: 134, revenue: "$670" },
                    { name: "Bell Peppers", sales: 98, revenue: "$490" },
                  ].map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                      </div>
                      <Badge variant="secondary">{product.revenue}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stream Engagement Metrics</CardTitle>
                <CardDescription>Viewer interaction and engagement rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Chat Messages</span>
                    <span className="font-bold">156/stream</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Likes per Stream</span>
                    <span className="font-bold">1,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shares per Stream</span>
                    <span className="font-bold">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Questions Asked</span>
                    <span className="font-bold">45</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
                <CardDescription>Your viewer demographics breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Age 25-34</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Age 35-44</span>
                      <span>28%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Age 45-54</span>
                      <span>22%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "22%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Other</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
