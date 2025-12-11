export interface StudyGroup {
  id: string
  name: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced" | "mixed"
  privacy: "public" | "private" | "invite-only"
  maxMembers: number
  currentMembers: number
  createdBy: string
  createdAt: Date
  tags: string[]
  meetingSchedule?: {
    frequency: "weekly" | "bi-weekly" | "monthly" | "custom"
    dayOfWeek: number // 0-6 (Sunday-Saturday)
    time: string // HH:MM format
    timezone: string
    duration: number // minutes
  }
  goals: string[]
  rules: string[]
  resources: StudyResource[]
  achievements: GroupAchievement[]
  isActive: boolean
  language: string
  region?: string
}

export interface StudyGroupMember {
  id: string
  groupId: string
  userId: string
  username: string
  avatar: string
  role: "admin" | "moderator" | "member"
  joinedAt: Date
  lastActive: Date
  contributionScore: number
  badges: string[]
  expertise: string[]
  studyStreak: number
  helpfulAnswers: number
  questionsAsked: number
}

export interface StudySession {
  id: string
  groupId: string
  title: string
  description: string
  type: "quiz-session" | "discussion" | "video-watch" | "practice" | "presentation"
  scheduledAt: Date
  duration: number
  hostId: string
  participants: string[]
  materials: StudyResource[]
  status: "scheduled" | "live" | "completed" | "cancelled"
  recordingUrl?: string
  notes?: string
  quizId?: string
  videoId?: string
}

export interface StudyResource {
  id: string
  title: string
  type: "document" | "video" | "quiz" | "link" | "image" | "presentation"
  url: string
  description: string
  uploadedBy: string
  uploadedAt: Date
  tags: string[]
  downloadCount: number
  rating: number
  reviews: ResourceReview[]
}

export interface ResourceReview {
  id: string
  userId: string
  username: string
  rating: number
  comment: string
  createdAt: Date
  helpful: number
}

export interface GroupDiscussion {
  id: string
  groupId: string
  title: string
  content: string
  authorId: string
  authorName: string
  createdAt: Date
  updatedAt: Date
  category: "question" | "discussion" | "announcement" | "resource-share"
  tags: string[]
  replies: DiscussionReply[]
  likes: number
  views: number
  isPinned: boolean
  isSolved: boolean
}

export interface DiscussionReply {
  id: string
  discussionId: string
  content: string
  authorId: string
  authorName: string
  createdAt: Date
  likes: number
  isAnswer: boolean
  parentReplyId?: string
  attachments: string[]
}

export interface GroupAchievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  criteria: string
  progress: number
  maxProgress: number
}

export interface StudyPlan {
  id: string
  groupId: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  milestones: StudyMilestone[]
  createdBy: string
  participants: string[]
  status: "draft" | "active" | "completed" | "paused"
}

export interface StudyMilestone {
  id: string
  title: string
  description: string
  dueDate: Date
  type: "quiz" | "reading" | "practice" | "discussion" | "project"
  resourceId?: string
  completed: boolean
  completedBy: string[]
  points: number
}

export interface GroupStats {
  totalMembers: number
  activeMembers: number
  totalSessions: number
  completedQuizzes: number
  averageScore: number
  studyStreak: number
  resourcesShared: number
  discussionsStarted: number
  helpfulAnswers: number
}
