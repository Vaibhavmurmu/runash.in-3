"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Users,
  LayoutTemplateIcon as Template,
  Settings,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart3,
  Shield,
  RefreshCw,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Campaign {
  id: number
  name: string
  subject: string
  template_id: number
  template_name: string
  status: "draft" | "scheduled" | "sending" | "sent" | "paused"
  scheduled_at?: Date
  sent_count: number
  delivered_count: number
  opened_count: number
  clicked_count: number
  bounced_count: number
  created_at: Date
}

interface Template {
  id: number
  name: string
  subject: string
  category: string
  usage_count: number
  avg_open_rate: number
  created_at: Date
  updated_at: Date
}

interface Subscriber {
  id: number
  email: string
  name?: string
  status: "active" | "unsubscribed" | "bounced"
  subscribed_at: Date
  last_activity?: Date
  tags: string[]
}

export function EmailManagementDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Mock data - in production, fetch from APIs
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: 1,
        name: "Welcome Series - Week 1",
        subject: "Welcome to our community!",
        template_id: 1,
        template_name: "Welcome Email",
        status: "sent",
        sent_count: 1250,
        delivered_count: 1198,
        opened_count: 456,
        clicked_count: 89,
        bounced_count: 52,
        created_at: new Date("2024-01-15"),
      },
      {
        id: 2,
        name: "Product Update Newsletter",
        subject: "New features you'll love",
        template_id: 2,
        template_name: "Newsletter Template",
        status: "scheduled",
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sent_count: 0,
        delivered_count: 0,
        opened_count: 0,
        clicked_count: 0,
        bounced_count: 0,
        created_at: new Date("2024-01-20"),
      },
      {
        id: 3,
        name: "Holiday Sale Campaign",
        subject: "50% off everything - Limited time!",
        template_id: 3,
        template_name: "Promotional Email",
        status: "sending",
        sent_count: 2850,
        delivered_count: 2720,
        opened_count: 1180,
        clicked_count: 340,
        bounced_count: 130,
        created_at: new Date("2024-01-18"),
      },
    ]

    const mockTemplates: Template[] = [
      {
        id: 1,
        name: "Welcome Email",
        subject: "Welcome to {{company_name}}!",
        category: "Onboarding",
        usage_count: 45,
        avg_open_rate: 68.5,
        created_at: new Date("2024-01-10"),
        updated_at: new Date("2024-01-15"),
      },
      {
        id: 2,
        name: "Newsletter Template",
        subject: "{{newsletter_title}}",
        category: "Newsletter",
        usage_count: 23,
        avg_open_rate: 42.3,
        created_at: new Date("2024-01-12"),
        updated_at: new Date("2024-01-20"),
      },
      {
        id: 3,
        name: "Promotional Email",
        subject: "{{promotion_title}}",
        category: "Marketing",
        usage_count: 18,
        avg_open_rate: 35.7,
        created_at: new Date("2024-01-14"),
        updated_at: new Date("2024-01-18"),
      },
    ]

    const mockSubscribers: Subscriber[] = [
      {
        id: 1,
        email: "john.doe@example.com",
        name: "John Doe",
        status: "active",
        subscribed_at: new Date("2024-01-10"),
        last_activity: new Date("2024-01-20"),
        tags: ["premium", "newsletter"],
      },
      {
        id: 2,
        email: "jane.smith@example.com",
        name: "Jane Smith",
        status: "active",
        subscribed_at: new Date("2024-01-12"),
        last_activity: new Date("2024-01-19"),
        tags: ["newsletter"],
      },
      {
        id: 3,
        email: "bounced@example.com",
        status: "bounced",
        subscribed_at: new Date("2024-01-08"),
        tags: [],
      },
    ]

    setCampaigns(mockCampaigns)
    setTemplates(mockTemplates)
    setSubscribers(mockSubscribers)
    setLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "sending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "paused":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      case "draft":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4" />
      case "sending":
        return <Zap className="h-4 w-4" />
      case "scheduled":
        return <Clock className="h-4 w-4" />
      case "paused":
        return <Pause className="h-4 w-4" />
      case "draft":
        return <Edit className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const handleCampaignAction = (campaignId: number, action: string) => {
    toast({
      title: "Action Performed",
      description: `Campaign ${action} successfully`,
    })
  }

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredSubscribers = subscribers.filter(
    (subscriber) =>
      subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (subscriber.name && subscriber.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Email Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage campaigns, templates, and subscribers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>Set up a new email campaign with templates and scheduling</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input id="campaign-name" placeholder="Enter campaign name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-template">Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-subject">Subject Line</Label>
                  <Input id="campaign-subject" placeholder="Enter email subject" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-schedule">Schedule</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Send immediately or schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Send Immediately</SelectItem>
                      <SelectItem value="schedule">Schedule for Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Create Campaign</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.filter((c) => c.status === "sending").length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.filter((s) => s.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Active subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Template className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">Available templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(templates.reduce((sum, t) => sum + t.avg_open_rate, 0) / templates.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>Latest email campaign activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.slice(0, 5).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(campaign.status)}
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.subject}</div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Templates</CardTitle>
                <CardDescription>Templates with highest open rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates
                    .sort((a, b) => b.avg_open_rate - a.avg_open_rate)
                    .slice(0, 5)
                    .map((template) => (
                      <div key={template.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-muted-foreground">{template.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{template.avg_open_rate.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">{template.usage_count} uses</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common email management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Plus className="h-6 w-6" />
                  Create Campaign
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Template className="h-6 w-6" />
                  New Template
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Upload className="h-6 w-6" />
                  Import Contacts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-80"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>Manage and monitor your email campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Delivered</TableHead>
                    <TableHead>Opened</TableHead>
                    <TableHead>Clicked</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.subject}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      </TableCell>
                      <TableCell>{campaign.sent_count.toLocaleString()}</TableCell>
                      <TableCell>
                        <div>
                          <div>{campaign.delivered_count.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {campaign.sent_count > 0
                              ? ((campaign.delivered_count / campaign.sent_count) * 100).toFixed(1)
                              : 0}
                            %
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{campaign.opened_count.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {campaign.delivered_count > 0
                              ? ((campaign.opened_count / campaign.delivered_count) * 100).toFixed(1)
                              : 0}
                            %
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{campaign.clicked_count.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {campaign.opened_count > 0
                              ? ((campaign.clicked_count / campaign.opened_count) * 100).toFixed(1)
                              : 0}
                            %
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleCampaignAction(campaign.id, "viewed")}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleCampaignAction(campaign.id, "edited")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {campaign.status === "sending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCampaignAction(campaign.id, "paused")}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                          {campaign.status === "paused" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCampaignAction(campaign.id, "resumed")}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-80"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <CardDescription>{template.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Usage</div>
                        <div className="font-medium">{template.usage_count} times</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Open Rate</div>
                        <div className="font-medium">{template.avg_open_rate.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Updated {new Date(template.updated_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subscribers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-80"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subscriber Management</CardTitle>
              <CardDescription>Manage your email subscribers and their preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscriber</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscribed</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{subscriber.name || "Unknown"}</div>
                          <div className="text-sm text-muted-foreground">{subscriber.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={subscriber.status === "active" ? "default" : "secondary"}
                          className={
                            subscriber.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : subscriber.status === "bounced"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                          }
                        >
                          {subscriber.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(subscriber.subscribed_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {subscriber.last_activity ? new Date(subscriber.last_activity).toLocaleDateString() : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {subscriber.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>SMTP settings and email delivery configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" placeholder="smtp.example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">Port</Label>
                    <Input id="smtp-port" placeholder="587" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-security">Security</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select security" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email">Default From Email</Label>
                  <Input id="from-email" placeholder="noreply@example.com" />
                </div>
                <Button>Save Configuration</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suppression Management</CardTitle>
                <CardDescription>Manage bounced emails and unsubscribes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">24</div>
                    <div className="text-sm text-muted-foreground">Hard Bounces</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-muted-foreground">Soft Bounces</div>
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">156</div>
                  <div className="text-sm text-muted-foreground">Unsubscribed</div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <Shield className="h-4 w-4 mr-2" />
                  Manage Suppressions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Settings</CardTitle>
                <CardDescription>Configure email automation and triggers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Welcome Email Series</div>
                    <div className="text-sm text-muted-foreground">Send welcome emails to new subscribers</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Abandoned Cart Recovery</div>
                    <div className="text-sm text-muted-foreground">Follow up on abandoned purchases</div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">Inactive</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Re-engagement Campaign</div>
                    <div className="text-sm text-muted-foreground">Win back inactive subscribers</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Automations
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance & Privacy</CardTitle>
                <CardDescription>GDPR, CAN-SPAM, and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-address">Company Address</Label>
                  <Textarea id="company-address" placeholder="Enter your company address for compliance" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unsubscribe-text">Unsubscribe Text</Label>
                  <Input id="unsubscribe-text" placeholder="Click here to unsubscribe" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="gdpr-compliance" className="rounded" />
                  <Label htmlFor="gdpr-compliance" className="text-sm">
                    Enable GDPR compliance features
                  </Label>
                </div>
                <Button>Update Compliance Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
