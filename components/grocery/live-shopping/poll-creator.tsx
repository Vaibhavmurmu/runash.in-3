"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { Poll, Quiz, QuizQuestion, PollOption, QuizOption } from "@/types/live-shopping"

interface PollCreatorProps {
  streamId: string
  onCreatePoll: (poll: Omit<Poll, "id" | "createdAt" | "totalVotes">) => void
  onCreateQuiz: (quiz: Omit<Quiz, "id" | "createdAt" | "totalParticipants">) => void
  className?: string
}

export default function PollCreator({ streamId, onCreatePoll, onCreateQuiz, className = "" }: PollCreatorProps) {
  const [activeTab, setActiveTab] = useState<"poll" | "quiz">("poll")

  // Poll state
  const [pollQuestion, setPollQuestion] = useState("")
  const [pollOptions, setPollOptions] = useState<Omit<PollOption, "votes">[]>([
    { id: "1", text: "" },
    { id: "2", text: "" },
  ])
  const [pollSettings, setPollSettings] = useState({
    allowMultipleChoices: false,
    isAnonymous: false,
    duration: 60, // 60 seconds default
    highlightInStream: true,
  })

  // Quiz state
  const [quizTitle, setQuizTitle] = useState("")
  const [quizQuestions, setQuizQuestions] = useState<
    Omit<QuizQuestion, "options" | "correctOptionId"> & {
      options: Omit<QuizOption, "votes">[]
      correctOptionId?: string
    }
  >([
    {
      id: "1",
      text: "",
      options: [
        { id: "1-1", text: "" },
        { id: "1-2", text: "" },
        { id: "1-3", text: "" },
        { id: "1-4", text: "" },
      ],
      correctOptionId: undefined,
    },
  ])
  const [quizSettings, setQuizSettings] = useState({
    timePerQuestion: 20, // 20 seconds default
    isAnonymous: false,
    showCorrectAnswers: true,
    showLeaderboard: true,
    highlightInStream: true,
  })

  // Poll functions
  const addPollOption = () => {
    setPollOptions([...pollOptions, { id: `${pollOptions.length + 1}`, text: "" }])
  }

  const removePollOption = (id: string) => {
    if (pollOptions.length <= 2) {
      toast({
        title: "Cannot remove option",
        description: "A poll must have at least 2 options.",
        variant: "destructive",
      })
      return
    }
    setPollOptions(pollOptions.filter((option) => option.id !== id))
  }

  const updatePollOption = (id: string, text: string) => {
    setPollOptions(pollOptions.map((option) => (option.id === id ? { ...option, text } : option)))
  }

  const handleCreatePoll = () => {
    // Validate poll
    if (!pollQuestion.trim()) {
      toast({
        title: "Missing question",
        description: "Please enter a question for your poll.",
        variant: "destructive",
      })
      return
    }

    const emptyOptions = pollOptions.filter((option) => !option.text.trim())
    if (emptyOptions.length > 0) {
      toast({
        title: "Empty options",
        description: "Please fill in all poll options or remove empty ones.",
        variant: "destructive",
      })
      return
    }

    const newPoll: Omit<Poll, "id" | "createdAt" | "totalVotes"> = {
      streamId,
      question: pollQuestion,
      options: pollOptions.map((option) => ({ ...option, votes: 0 })),
      status: "draft",
      allowMultipleChoices: pollSettings.allowMultipleChoices,
      isAnonymous: pollSettings.isAnonymous,
      duration: pollSettings.duration,
      highlightedInStream: pollSettings.highlightInStream,
    }

    onCreatePoll(newPoll)

    // Reset form
    setPollQuestion("")
    setPollOptions([
      { id: "1", text: "" },
      { id: "2", text: "" },
    ])

    toast({
      title: "Poll created",
      description: "Your poll is ready to launch during the stream.",
    })
  }

  // Quiz functions
  const addQuizQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        id: `${quizQuestions.length + 1}`,
        text: "",
        options: [
          { id: `${quizQuestions.length + 1}-1`, text: "" },
          { id: `${quizQuestions.length + 1}-2`, text: "" },
          { id: `${quizQuestions.length + 1}-3`, text: "" },
          { id: `${quizQuestions.length + 1}-4`, text: "" },
        ],
        correctOptionId: undefined,
      },
    ])
  }

  const removeQuizQuestion = (id: string) => {
    if (quizQuestions.length <= 1) {
      toast({
        title: "Cannot remove question",
        description: "A quiz must have at least 1 question.",
        variant: "destructive",
      })
      return
    }
    setQuizQuestions(quizQuestions.filter((question) => question.id !== id))
  }

  const updateQuizQuestion = (id: string, text: string) => {
    setQuizQuestions(quizQuestions.map((question) => (question.id === id ? { ...question, text } : question)))
  }

  const updateQuizOption = (questionId: string, optionId: string, text: string) => {
    setQuizQuestions(
      quizQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) => (option.id === optionId ? { ...option, text } : option)),
            }
          : question,
      ),
    )
  }

  const setCorrectOption = (questionId: string, optionId: string) => {
    setQuizQuestions(
      quizQuestions.map((question) =>
        question.id === questionId ? { ...question, correctOptionId: optionId } : question,
      ),
    )
  }

  const handleCreateQuiz = () => {
    // Validate quiz
    if (!quizTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your quiz.",
        variant: "destructive",
      })
      return
    }

    // Check if all questions have text
    const emptyQuestions = quizQuestions.filter((question) => !question.text.trim())
    if (emptyQuestions.length > 0) {
      toast({
        title: "Empty questions",
        description: "Please fill in all quiz questions or remove empty ones.",
        variant: "destructive",
      })
      return
    }

    // Check if all questions have at least 2 options with text
    const invalidQuestions = quizQuestions.filter(
      (question) => question.options.filter((option) => option.text.trim()).length < 2,
    )
    if (invalidQuestions.length > 0) {
      toast({
        title: "Invalid questions",
        description: "Each question must have at least 2 non-empty options.",
        variant: "destructive",
      })
      return
    }

    // Check if all questions have a correct answer
    const noCorrectAnswerQuestions = quizQuestions.filter((question) => !question.correctOptionId)
    if (noCorrectAnswerQuestions.length > 0) {
      toast({
        title: "Missing correct answers",
        description: "Please select a correct answer for each question.",
        variant: "destructive",
      })
      return
    }

    const newQuiz: Omit<Quiz, "id" | "createdAt" | "totalParticipants"> = {
      streamId,
      title: quizTitle,
      questions: quizQuestions.map((question) => ({
        id: question.id,
        text: question.text,
        options: question.options.map((option) => ({ ...option, votes: 0 })),
        correctOptionId: question.correctOptionId,
      })),
      status: "draft",
      timePerQuestion: quizSettings.timePerQuestion,
      isAnonymous: quizSettings.isAnonymous,
      showCorrectAnswers: quizSettings.showCorrectAnswers,
      showLeaderboard: quizSettings.showLeaderboard,
      highlightedInStream: quizSettings.highlightInStream,
    }

    onCreateQuiz(newQuiz)

    // Reset form
    setQuizTitle("")
    setQuizQuestions([
      {
        id: "1",
        text: "",
        options: [
          { id: "1-1", text: "" },
          { id: "1-2", text: "" },
          { id: "1-3", text: "" },
          { id: "1-4", text: "" },
        ],
        correctOptionId: undefined,
      },
    ])

    toast({
      title: "Quiz created",
      description: "Your quiz is ready to launch during the stream.",
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Create Interactive Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "poll" | "quiz")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="poll">Poll</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="poll" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="poll-question">Question</Label>
              <Input
                id="poll-question"
                placeholder="Enter your poll question"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Options</Label>
              {pollOptions.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updatePollOption(option.id, e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePollOption(option.id)}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addPollOption} className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="poll-duration">Poll Duration</Label>
                  <div className="text-xs text-muted-foreground">How long the poll will stay open</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="poll-duration"
                    type="number"
                    min="10"
                    max="300"
                    className="w-20"
                    value={pollSettings.duration}
                    onChange={(e) =>
                      setPollSettings({
                        ...pollSettings,
                        duration: Math.max(10, Number.parseInt(e.target.value) || 60),
                      })
                    }
                  />
                  <span className="text-sm text-muted-foreground">sec</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Multiple Choices</Label>
                  <div className="text-xs text-muted-foreground">Let viewers select multiple options</div>
                </div>
                <Switch
                  checked={pollSettings.allowMultipleChoices}
                  onCheckedChange={(checked) => setPollSettings({ ...pollSettings, allowMultipleChoices: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Anonymous Voting</Label>
                  <div className="text-xs text-muted-foreground">Hide voter identities</div>
                </div>
                <Switch
                  checked={pollSettings.isAnonymous}
                  onCheckedChange={(checked) => setPollSettings({ ...pollSettings, isAnonymous: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Highlight in Stream</Label>
                  <div className="text-xs text-muted-foreground">Show poll prominently to all viewers</div>
                </div>
                <Switch
                  checked={pollSettings.highlightInStream}
                  onCheckedChange={(checked) => setPollSettings({ ...pollSettings, highlightInStream: checked })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Quiz Title</Label>
              <Input
                id="quiz-title"
                placeholder="Enter your quiz title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </div>

            <div className="space-y-6">
              {quizQuestions.map((question, qIndex) => (
                <div key={question.id} className="space-y-3 border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`question-${question.id}`}>Question {qIndex + 1}</Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuizQuestion(question.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Input
                    id={`question-${question.id}`}
                    placeholder="Enter your question"
                    value={question.text}
                    onChange={(e) => updateQuizQuestion(question.id, e.target.value)}
                  />

                  <div className="space-y-2">
                    <Label className="text-sm">Options (select the correct answer)</Label>
                    {question.options.map((option, oIndex) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border ${
                            question.correctOptionId === option.id
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300"
                          }`}
                          onClick={() => setCorrectOption(question.id, option.id)}
                        >
                          {question.correctOptionId === option.id && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <Input
                          placeholder={`Option ${oIndex + 1}`}
                          value={option.text}
                          onChange={(e) => updateQuizOption(question.id, option.id, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={addQuizQuestion} className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="time-per-question">Time per Question</Label>
                  <div className="text-xs text-muted-foreground">Seconds to answer each question</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time-per-question"
                    type="number"
                    min="5"
                    max="120"
                    className="w-20"
                    value={quizSettings.timePerQuestion}
                    onChange={(e) =>
                      setQuizSettings({
                        ...quizSettings,
                        timePerQuestion: Math.max(5, Number.parseInt(e.target.value) || 20),
                      })
                    }
                  />
                  <span className="text-sm text-muted-foreground">sec</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Anonymous Participation</Label>
                  <div className="text-xs text-muted-foreground">Hide participant identities</div>
                </div>
                <Switch
                  checked={quizSettings.isAnonymous}
                  onCheckedChange={(checked) => setQuizSettings({ ...quizSettings, isAnonymous: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Correct Answers</Label>
                  <div className="text-xs text-muted-foreground">Reveal correct answers after each question</div>
                </div>
                <Switch
                  checked={quizSettings.showCorrectAnswers}
                  onCheckedChange={(checked) => setQuizSettings({ ...quizSettings, showCorrectAnswers: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Leaderboard</Label>
                  <div className="text-xs text-muted-foreground">Display rankings after the quiz</div>
                </div>
                <Switch
                  checked={quizSettings.showLeaderboard}
                  onCheckedChange={(checked) => setQuizSettings({ ...quizSettings, showLeaderboard: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Highlight in Stream</Label>
                  <div className="text-xs text-muted-foreground">Show quiz prominently to all viewers</div>
                </div>
                <Switch
                  checked={quizSettings.highlightInStream}
                  onCheckedChange={(checked) => setQuizSettings({ ...quizSettings, highlightInStream: checked })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={activeTab === "poll" ? handleCreatePoll : handleCreateQuiz}
          disabled={
            activeTab === "poll"
              ? !pollQuestion.trim() || pollOptions.some((o) => !o.text.trim())
              : !quizTitle.trim() ||
                quizQuestions.some((q) => !q.text.trim() || !q.correctOptionId || q.options.some((o) => !o.text.trim()))
          }
        >
          {activeTab === "poll" ? "Create Poll" : "Create Quiz"}
        </Button>
      </CardFooter>
    </Card>
  )
}
