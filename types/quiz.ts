export interface VideoExplanation {
  id: string
  title: string
  duration: number // in seconds
  thumbnail: string
  videoUrl: string
  instructor: {
    name: string
    avatar: string
    title: string
    expertise: string[]
  }
  topics: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  transcript?: string
  relatedConcepts: string[]
  practicalTips: string[]
}

export interface QuizQuestion {
  id: string
  question: string
  type: "multiple-choice" | "true-false" | "fill-blank" | "matching"
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  points: number
  imageUrl?: string
  videoExplanation?: VideoExplanation
  hasComplexConcept?: boolean
  conceptKeywords: string[]
}

export interface Quiz {
  id: string
  title: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number
  totalPoints: number
  passingScore: number
  questions: QuizQuestion[]
  prerequisites?: string[]
  learningObjectives: string[]
  introVideo?: VideoExplanation
  summaryVideo?: VideoExplanation
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  startTime: Date
  endTime?: Date
  answers: Record<string, string | string[]>
  score: number
  passed: boolean
  timeSpent: number
  completedAt?: Date
  videosWatched: string[]
  helpSought: string[]
}

export interface QuizResult {
  attempt: QuizAttempt
  quiz: Quiz
  correctAnswers: number
  totalQuestions: number
  percentage: number
  feedback: string
  recommendations: string[]
  videoRecommendations: VideoExplanation[]
}
