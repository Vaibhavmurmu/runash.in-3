"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, Clock, Users } from "lucide-react"
import PollCreator from "./poll-creator"
import type { Poll, Quiz } from "@/types/live-shopping"

interface PollQuizManagerProps {
  streamId: string
  onLaunchPoll: (pollId: string) => void
  onEndPoll: (pollId: string) => void
  onLaunchQuiz: (quizId: string) => void
  onEndQuiz: (quizId: string) => void
  onDeletePoll: (pollId: string) => void
  onDeleteQuiz: (quizId: string) => void
  onEditPoll: (pollId: string) => void
  onEditQuiz: (quizId: string) => void
  className?: string
}

export default function PollQuizManager({
  streamId,
  onLaunchPoll,
  onEndPoll,
  onLaunchQuiz,
  onEndQuiz,
  onDeletePoll,
  onDeleteQuiz,
  onEditPoll,
  onEditQuiz,
  className = "",
}: PollQuizManagerProps) {
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: "poll-1",
      streamId,
      question: "Which organic product would you like to see featured next?",
      options: [
        { id: "1", text: "Avocados", votes: 24, color: "#4ade80" },
        { id: "2", text: "Berries", votes: 18, color: "#f87171" },
        { id: "3", text: "Quinoa", votes: 12, color: "#60a5fa" },
        { id: "4", text: "Honey", votes: 8, color: "#fbbf24" },
      ],
      status: "draft",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      duration: 60,
      allowMultipleChoices: false,
      isAnonymous: true,
      totalVotes: 62,
      highlightedInStream: true,
    },
    {
      id: "poll-2",
      streamId,
      question: "What's your favorite way to prepare organic vegetables?",
      options: [
        { id: "1", text: "Roasting", votes: 35, color: "#4ade80" },
        { id: "2", text: "Steaming", votes: 22, color: "#f87171" },
        { id: "3", text: "Stir-frying", votes: 28, color: "#60a5fa" },
        { id: "4", text: "Raw in salads", votes: 15, color: "#fbbf24" },
      ],
      status: "ended",
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
      activatedAt: new Date(Date.now() - 55 * 60 * 1000),
      endedAt: new Date(Date.now() - 45 * 60 * 1000),
      duration: 60,
      allowMultipleChoices: true,
      isAnonymous: false,
      totalVotes: 100,
      highlightedInStream: true,
    },
  ])

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "quiz-1",
      streamId,
      title: "Organic Food Knowledge Quiz",
      questions: [
        {
          id: "q1",
          text: "What does 'organic' certification require?",
          options: [
            { id: "q1-1", text: "No pesticides ever", votes: 12 },
            { id: "q1-2", text: "Only natural fertilizers", votes: 8 },
            { id: "q1-3", text: "No synthetic pesticides or fertilizers", votes: 25 },
            { id: "q1-4", text: "Grown in greenhouses only", votes: 5 },
          ],
          correctOptionId: "q1-3",
        },
        {
          id: "q2",
          text: "Which of these fruits typically has the highest pesticide residue when grown conventionally?",
          options: [
            { id: "q2-1", text: "Bananas", votes: 10 },
            { id: "q2-2", text: "Strawberries", votes: 22 },
            { id: "q2-3", text: "Oranges", votes: 8 },
            { id: "q2-4", text: "Watermelon", votes: 10 },
          ],
          correctOptionId: "q2-2",
        },
      ],
      status: "draft",
      createdAt: new Date(Date.now() - 120 * 60 * 1000),
      timePerQuestion: 30,
      isAnonymous: false,
      showCorrectAnswers: true,
      showLeaderboard: true,
      totalParticipants: 0,
      highlightedInStream: true,
    },
  ])

  const handleCreatePoll = (newPoll: Omit<Poll, "id" | "createdAt" | "totalVotes">) => {
    const poll: Poll = {
      ...newPoll,
      id: `poll-${polls.length + 1}`,
      createdAt: new Date(),
      totalVotes: 0,
    }
    setPolls([...polls, poll])
  }

  const handleCreateQuiz = (newQuiz: Omit<Quiz, "id" | "createdAt" | "totalParticipants">) => {
    const quiz: Quiz = {
      ...newQuiz,
      id: `quiz-${quizzes.length + 1}`,
      createdAt: new Date(),
      totalParticipants: 0,
    }
    setQuizzes([...quizzes, quiz])
  }

  const handleLaunchPoll = (pollId: string) => {
    setPolls(
      polls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              status: "active",
              activatedAt: new Date(),
            }
          : poll,
      ),
    )
    onLaunchPoll(pollId)
  }

  const handleEndPoll = (pollId: string) => {
    setPolls(
      polls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              status: "ended",
              endedAt: new Date(),
            }
          : poll,
      ),
    )
    onEndPoll(pollId)
  }

  const handleLaunchQuiz = (quizId: string) => {
    setQuizzes(
      quizzes.map((quiz) =>
        quiz.id === quizId
          ? {
              ...quiz,
              status: "active",
              activatedAt: new Date(),
              currentQuestionIndex: 0,
            }
          : quiz,
      ),
    )
    onLaunchQuiz(quizId)
  }

  const handleEndQuiz = (quizId: string) => {
    setQuizzes(
      quizzes.map((quiz) =>
        quiz.id === quizId
          ? {
              ...quiz,
              status: "ended",
              endedAt: new Date(),
            }
          : quiz,
      ),
    )
    onEndQuiz(quizId)
  }

  const handleDeletePoll = (pollId: string) => {
    setPolls(polls.filter((poll) => poll.id !== pollId))
    onDeletePoll(pollId)
  }

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId))
    onDeleteQuiz(quizId)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>Interactive Content</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="create">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="polls">Polls</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="p-4">
            <PollCreator streamId={streamId} onCreatePoll={handleCreatePoll} onCreateQuiz={handleCreateQuiz} />
          </TabsContent>

          <TabsContent value="polls" className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-4">
                {polls.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No polls created yet</p>
                    <p className="text-sm">Create a poll to engage with your audience</p>
                  </div>
                ) : (
                  polls.map((poll) => (
                    <Card key={poll.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                            <span className="font-medium">Poll</span>
                            {poll.status === "active" && (
                              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                                Live
                              </Badge>
                            )}
                            {poll.status === "ended" && (
                              <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-700 border-gray-200">
                                Ended
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{poll.duration}s</span>
                          </div>
                        </div>

                        <h3 className="text-sm font-medium mb-1 line-clamp-2">{poll.question}</h3>

                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{poll.totalVotes} votes</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {poll.options.slice(0, 3).map((option) => (
                            <Badge key={option.id} variant="secondary" className="text-xs">
                              {option.text}
                            </Badge>
                          ))}
                          {poll.options.length > 3 && (\
