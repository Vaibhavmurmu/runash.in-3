"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  BarChart3,
  Target,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  Square,
  Users,
  Clock,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface PollQuizManagementPanelProps {
  hostId: string
}

export function PollQuizManagementPanel({ hostId }: PollQuizManagementPanelProps) {
  const [activeTab, setActiveTab] = useState("active")
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false)
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false)

  // Mock poll and quiz data
  const pollsQuizzes = {
    active: [
      {
        id: "1",
        type: "poll",
        title: "Which product should I feature next?",
        status: "live",
        participants: 89,
        timeRemaining: 45,
        options: [
          { text: "Organic Avocados", votes: 34, percentage: 38 },
          { text: "Fresh Spinach", votes: 28, percentage: 31 },
          { text: "Heirloom Tomatoes", votes: 27, percentage: 31 },
        ],
      },
    ],
    templates: [
      {
        id: "1",
        type: "poll",
        title: "Product Preference Poll",
        description: "Ask viewers which product they prefer",
        category: "Product Selection",
        usageCount: 15,
      },
      {
        id: "2",
        type: "quiz",
        title: "Nutrition Knowledge Quiz",
        description: "Test viewers' nutrition knowledge",
        category: "Educational",
        usageCount: 8,
      },
      {
        id: "3",
        type: "poll",
        title: "Cooking Method Poll",
        description: "Ask about preferred cooking methods",
        category: "Cooking",
        usageCount: 12,
      },
    ],
    past: [
      {
        id: "1",
        type: "poll",
        title: "Favorite Organic Vegetable",
        date: "Yesterday",
        participants: 156,
        engagementRate: 78,
        topAnswer: "Spinach (45%)",
      },
      {
        id: "2",
        type: "quiz",
        title: "Vitamin Knowledge Quiz",
        date: "2 days ago",
        participants: 134,
        engagementRate: 82,
        averageScore: 7.2,
      },
    ],
  }

  const pollTemplates = [
    "Which product should I feature next?",
    "What's your favorite cooking method?",
    "How do you prefer your vegetables?",
    "What time do you usually shop?",
    "Which recipe would you like to see?",
  ]

  const quizTemplates = [
    {
      question: "Which vitamin is most abundant in spinach?",
      options: ["Vitamin A", "Vitamin C", "Vitamin K", "Vitamin D"],
      correct: 2,
    },
    {
      question: "What's the best way to store avocados?",
      options: ["Refrigerator", "Counter", "Freezer", "Pantry"],
      correct: 1,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Polls & Quizzes</h2>
          <p className="text-muted-foreground">Create interactive content to engage your audience</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCreatePollOpen} onOpenChange={setIsCreatePollOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Create Poll
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Poll</DialogTitle>
                <DialogDescription>Create an interactive poll for your viewers</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="poll-question">Poll Question</Label>
                  <Input id="poll-question" placeholder="What would you like to ask?" />
                </div>
                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  <Input placeholder="Option 1" />
                  <Input placeholder="Option 2" />
                  <Input placeholder="Option 3 (optional)" />
                  <Input placeholder="Option 4 (optional)" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="poll-duration">Duration (seconds)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="120">2 minutes</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poll-template">Save as Template</Label>
                    <Switch id="poll-template" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500">
                    Create & Launch
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save Draft
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateQuizOpen} onOpenChange={setIsCreateQuizOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500">
                <Target className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Quiz</DialogTitle>
                <DialogDescription>Create an educational quiz for your viewers</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quiz-title">Quiz Title</Label>
                  <Input id="quiz-title" placeholder="Enter quiz title..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-question">Question 1</Label>
                  <Input id="quiz-question" placeholder="Enter your question..." />
                </div>
                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input placeholder="Option A" />
                      <Switch />
                      <span className="text-xs text-muted-foreground">Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Option B" />
                      <Switch />
                      <span className="text-xs text-muted-foreground">Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Option C" />
                      <Switch />
                      <span className="text-xs text-muted-foreground">Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Option D" />
                      <Switch />
                      <span className="text-xs text-muted-foreground">Correct</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-explanation">Explanation (optional)</Label>
                  <Textarea id="quiz-explanation" placeholder="Explain the correct answer..." rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiz-time">Time Limit (seconds)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="120">2 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiz-points">Points</Label>
                    <Input id="quiz-points" type="number" placeholder="100" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500">
                    Create & Launch
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Add More Questions
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Templates */}
      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Launch Templates
          </CardTitle>
          <CardDescription>Launch popular polls and quizzes instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pollsQuizzes.templates.map((template) => (
              <div key={template.id} className="p-4 rounded-lg border bg-muted/50 hover:bg-muted/70 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={template.type === "poll" ? "default" : "secondary"} className="text-xs">
                    {template.type.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Used {template.usageCount}x</span>
                </div>
                <h4 className="font-medium mb-1">{template.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Play className="h-3 w-3 mr-1" />
                    Launch
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Polls & Quizzes Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({pollsQuizzes.active.length})</TabsTrigger>
          <TabsTrigger value="templates">Templates ({pollsQuizzes.templates.length})</TabsTrigger>
          <TabsTrigger value="past">Past Results ({pollsQuizzes.past.length})</TabsTrigger>
        </TabsList>

        {/* Active Polls & Quizzes */}
        <TabsContent value="active" className="space-y-4">
          {pollsQuizzes.active.length === 0 ? (
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No active polls or quizzes</h3>
                <p className="text-muted-foreground mb-4">Create interactive content to engage your viewers</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setIsCreatePollOpen(true)}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Create Poll
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateQuizOpen(true)}>
                    <Target className="h-4 w-4 mr-2" />
                    Create Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            pollsQuizzes.active.map((item) => (
              <Card key={item.id} className="border-border/40 bg-card/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full mr-1" />
                        LIVE
                      </Badge>
                      <Badge variant={item.type === "poll" ? "default" : "secondary"}>{item.type.toUpperCase()}</Badge>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {item.participants} participants
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {item.timeRemaining}s left
                      </div>
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Square className="h-4 w-4 mr-1" />
                        End
                      </Button>
                    </div>
                  </div>

                  {item.type === "poll" && (
                    <div className="space-y-3">
                      {item.options.map((option, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{option.text}</span>
                            <span className="text-sm text-muted-foreground">
                              {option.votes} votes ({option.percentage}%)
                            </span>
                          </div>
                          <Progress value={option.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {pollsQuizzes.templates.map((template) => (
              <Card key={template.id} className="border-border/40 bg-card/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={template.type === "poll" ? "default" : "secondary"}>
                      {template.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Used {template.usageCount} times</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Launch Now
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Past Results */}
        <TabsContent value="past" className="space-y-4">
          {pollsQuizzes.past.map((item) => (
            <Card key={item.id} className="border-border/40 bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-500/20 to-gray-400/20 rounded-lg flex items-center justify-center">
                      {item.type === "poll" ? (
                        <BarChart3 className="h-6 w-6 text-gray-500" />
                      ) : (
                        <Target className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <Badge variant={item.type === "poll" ? "default" : "secondary"} className="text-xs">
                          {item.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4" />
                          {item.participants} participants
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp className="h-4 w-4" />
                          {item.engagementRate}% engagement
                        </div>
                        {item.type === "poll" && (
                          <div className="flex items-center gap-1 text-sm">
                            <Award className="h-4 w-4" />
                            Top: {item.topAnswer}
                          </div>
                        )}
                        {item.type === "quiz" && (
                          <div className="flex items-center gap-1 text-sm">
                            <Award className="h-4 w-4" />
                            Avg: {item.averageScore}/10
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-1" />
                      Reuse
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
