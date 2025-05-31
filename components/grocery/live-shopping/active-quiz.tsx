"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Award, Brain, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Quiz, UserQuizResponse, QuizLeaderboardEntry } from "@/types/live-shopping"

interface ActiveQuizProps {
  quiz: Quiz
  userId: string
  username: string
  userAvatar?: string
  onAnswer: (response: Partial<UserQuizResponse>) => void
  onComplete: (response: UserQuizResponse) => void
  onClose?: () => void
  className?: string
}

export default function ActiveQuiz({
  quiz,
  userId,
  username,
  userAvatar,
  onAnswer,
  onComplete,
  onClose,
  className = "",
}: ActiveQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(quiz.currentQuestionIndex || 0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(
    quiz.questions[currentQuestionIndex]?.timeLimit || quiz.timePerQuestion,
  )
  const [userAnswers, setUserAnswers] = useState<
    {
      questionId: string
      selectedOptionId: string
      isCorrect: boolean
      timeToAnswer: number
    }[]
  >([])
  const [quizComplete, setQuizComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<QuizLeaderboardEntry[]>([])

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  const currentQuestion = quiz.questions[currentQuestionIndex]

  useEffect(() => {
    // Reset state when moving to a new question
    if (currentQuestion) {
      setSelectedOption(null)
      setHasAnswered(false)
      setTimeLeft(currentQuestion.timeLimit || quiz.timePerQuestion)
      startTimeRef.current = Date.now()

      // Start timer for current question
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            if (!hasAnswered) {
              // Auto-submit timeout answer
              handleTimeOut()
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentQuestion, quiz.timePerQuestion])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Format time left
  const formatTimeLeft = (seconds: number) => {
    return seconds.toString().padStart(2, "0")
  }

  const handleOptionSelect = (optionId: string) => {
    if (hasAnswered) return
    setSelectedOption(optionId)
  }

  const handleTimeOut = () => {
    if (hasAnswered) return

    const timeToAnswer = quiz.timePerQuestion
    const isCorrect = false

    // Record the timeout as an answer
    const answer = {
      questionId: currentQuestion.id,
      selectedOptionId: "",
      isCorrect,
      timeToAnswer,
    }

    setUserAnswers([...userAnswers, answer])
    setHasAnswered(true)

    onAnswer({
      userId,
      quizId: quiz.id,
      answers: [answer],
    })

    // Show timeout message
    toast({
      title: "Time's up!",
      description: "You didn't answer in time.",
      variant: "destructive",
    })

    // Move to next question after delay
    setTimeout(() => {
      moveToNextQuestion()
    }, 3000)
  }

  const handleSubmitAnswer = () => {
    if (!selectedOption) {
      toast({
        title: "No option selected",
        description: "Please select an answer.",
        variant: "destructive",
      })
      return
    }

    const timeToAnswer = Math.round((Date.now() - startTimeRef.current) / 1000)
    const correctOptionId = currentQuestion.correctOptionId
    const isCorrect = selectedOption === correctOptionId

    // Record the answer
    const answer = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption,
      isCorrect,
      timeToAnswer,
    }

    setUserAnswers([...userAnswers, answer])
    setHasAnswered(true)

    // Update score
    if (isCorrect) {
      // Calculate score based on time taken (faster = more points)
      const maxTimePoints = 100
      const timeBonus = Math.round(
        maxTimePoints * (1 - timeToAnswer / (currentQuestion.timeLimit || quiz.timePerQuestion)),
      )
      const questionScore = 100 + Math.max(0, timeBonus)
      setScore((prev) => prev + questionScore)
    }

    onAnswer({
      userId,
      quizId: quiz.id,
      answers: [answer],
    })

    // Show feedback
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect ? "Great job!" : `The correct answer was: ${getOptionText(correctOptionId!)}`,
      variant: isCorrect ? "default" : "destructive",
    })

    // Move to next question after delay
    setTimeout(() => {
      moveToNextQuestion()
    }, 3000)
  }

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Quiz complete
      completeQuiz()
    }
  }

  const completeQuiz = () => {
    setQuizComplete(true)

    // Calculate final score
    const finalScore = userAnswers.filter((a) => a.isCorrect).length * 100

    // Create final response
    const response: UserQuizResponse = {
      userId,
      quizId: quiz.id,
      answers: userAnswers,
      score: finalScore,
      completedAt: new Date(),
    }

    onComplete(response)

    // Generate mock leaderboard
    const mockLeaderboard: QuizLeaderboardEntry[] = [
      {
        userId: "user1",
        username: "QuizMaster",
        userAvatar: "/placeholder.svg?height=32&width=32",
        score: Math.round(finalScore * 1.2),
        timeToComplete: 45,
        rank: 1,
      },
      {
        userId,
        username,
        userAvatar,
        score: finalScore,
        timeToComplete: userAnswers.reduce((total, answer) => total + answer.timeToAnswer, 0),
        rank: 2,
      },
      {
        userId: "user2",
        username: "BrainiacFan",
        userAvatar: "/placeholder.svg?height=32&width=32",
        score: Math.round(finalScore * 0.8),
        timeToComplete: 65,
        rank: 3,
      },
    ].sort((a, b) => b.score - a.score)

    // Update ranks based on sorted scores
    mockLeaderboard.forEach((entry, index) => {
      entry.rank = index + 1
    })

    setLeaderboard(mockLeaderboard)
  }

  const getOptionText = (optionId: string) => {
    const option = currentQuestion?.options.find((o) => o.id === optionId)
    return option?.text || ""
  }

  // Render quiz completion screen
  if (quizComplete) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Award className="h-5 w-5 mr-2" />
              <span>Quiz Complete</span>
            </CardTitle>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-3 mb-4">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-1">You completed "{quiz.title}"</h3>
            <p className="text-muted-foreground mb-4">
              You scored {score} points ({userAnswers.filter((a) => a.isCorrect).length} of {quiz.questions.length}{" "}
              correct)
            </p>

            {quiz.showLeaderboard && (
              <div className="mt-6">
                <h4 className="font-medium mb-3 flex items-center justify-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Leaderboard
                </h4>
                <div className="space-y-2">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-2 rounded-md ${
                        entry.userId === userId ? "bg-purple-50 dark:bg-purple-900/20" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 flex items-center justify-center rounded-full ${
                            entry.rank === 1
                              ? "bg-yellow-100 text-yellow-700"
                              : entry.rank === 2
                                ? "bg-gray-100 text-gray-700"
                                : entry.rank === 3
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {entry.rank}
                        </div>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={entry.userAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{entry.username[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{entry.username}</span>
                      </div>
                      <div className="text-sm font-mono">{entry.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            <span>{quiz.title}</span>
            <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700 border-purple-200">
              Question {currentQuestionIndex + 1}/{quiz.questions.length}
            </Badge>
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Timer */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Time Remaining</span>
            <span className="text-sm font-mono">{formatTimeLeft(timeLeft)}s</span>
          </div>
          <Progress
            value={(timeLeft / (currentQuestion.timeLimit || quiz.timePerQuestion)) * 100}
            className="h-2"
            indicatorClassName={timeLeft < 5 ? "bg-red-500" : timeLeft < 10 ? "bg-yellow-500" : "bg-green-500"}
          />
        </div>

        {/* Question */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">{currentQuestion.text}</h3>
          {currentQuestion.image && (
            <div className="mb-4">
              <img
                src={currentQuestion.image || "/placeholder.svg"}
                alt="Question"
                className="rounded-md w-full object-cover max-h-48"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <RadioGroup value={selectedOption || ""} className="space-y-2">
          {currentQuestion.options.map((option) => (
            <div
              key={option.id}
              className={`flex items-center space-x-2 p-2 rounded-md border ${
                hasAnswered && option.id === currentQuestion.correctOptionId
                  ? "bg-green-50 border-green-200"
                  : hasAnswered && option.id === selectedOption && option.id !== currentQuestion.correctOptionId
                    ? "bg-red-50 border-red-200"
                    : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <RadioGroupItem value={option.id} id={`option-${option.id}`} disabled={hasAnswered} />
              <label
                htmlFor={`option-${option.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
              >
                {option.text}
              </label>
              {hasAnswered && option.id === currentQuestion.correctOptionId && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              {hasAnswered && option.id === selectedOption && option.id !== currentQuestion.correctOptionId && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>

        {/* Explanation (shown after answering) */}
        {hasAnswered && currentQuestion.explanation && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
            <p className="font-medium mb-1">Explanation:</p>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSubmitAnswer}
          className="w-full"
          disabled={!selectedOption || hasAnswered}
          variant={!selectedOption || hasAnswered ? "outline" : "default"}
        >
          {hasAnswered ? "Waiting for next question..." : "Submit Answer"}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Trophy icon component
function Trophy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
