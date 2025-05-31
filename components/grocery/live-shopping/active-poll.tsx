"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, BarChart3, Users, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { Poll, UserPollResponse } from "@/types/live-shopping"

interface ActivePollProps {
  poll: Poll
  userId: string
  onVote: (response: UserPollResponse) => void
  onClose?: () => void
  className?: string
}

export default function ActivePoll({ poll, userId, onVote, onClose, className = "" }: ActivePollProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(poll.duration || null)
  const [totalVotes, setTotalVotes] = useState(poll.totalVotes)

  // Calculate percentages for display
  const calculatePercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  // Sort options by votes for results display
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes)

  useEffect(() => {
    // Timer for poll duration
    if (poll.status === "active" && timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [poll.status, timeLeft])

  // Format time left
  const formatTimeLeft = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOptionSelect = (optionId: string) => {
    if (hasVoted) return

    if (poll.allowMultipleChoices) {
      // For multiple choice polls
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter((id) => id !== optionId))
      } else {
        setSelectedOptions([...selectedOptions, optionId])
      }
    } else {
      // For single choice polls
      setSelectedOptions([optionId])
    }
  }

  const handleVote = () => {
    if (selectedOptions.length === 0) {
      toast({
        title: "No option selected",
        description: "Please select at least one option to vote.",
        variant: "destructive",
      })
      return
    }

    const response: UserPollResponse = {
      userId,
      pollId: poll.id,
      selectedOptionIds: selectedOptions,
      submittedAt: new Date(),
    }

    onVote(response)
    setHasVoted(true)

    // Update local state to show results immediately
    const updatedOptions = poll.options.map((option) => ({
      ...option,
      votes: selectedOptions.includes(option.id) ? option.votes + 1 : option.votes,
    }))

    setTotalVotes(totalVotes + 1)

    toast({
      title: "Vote submitted",
      description: "Thank you for participating in the poll!",
    })
  }

  // Generate a color for the option based on its index
  const getOptionColor = (index: number) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500", "bg-indigo-500"]
    return colors[index % colors.length]
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            <span>Poll</span>
            {poll.status === "active" && timeLeft !== null && timeLeft > 0 && (
              <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                <Clock className="h-3 w-3 mr-1" />
                {formatTimeLeft(timeLeft)}
              </Badge>
            )}
            {poll.status === "ended" && (
              <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-700 border-gray-200">
                Closed
              </Badge>
            )}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="mb-4">
          <h3 className="text-lg font-medium">{poll.question}</h3>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Users className="h-3 w-3 mr-1" />
            <span>{totalVotes} votes</span>
          </div>
        </div>

        {!hasVoted && poll.status === "active" ? (
          <div className="space-y-2">
            {poll.allowMultipleChoices ? (
              // Multiple choice poll
              <div className="space-y-2">
                {poll.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${option.id}`}
                      checked={selectedOptions.includes(option.id)}
                      onCheckedChange={() => handleOptionSelect(option.id)}
                    />
                    <label
                      htmlFor={`option-${option.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.text}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              // Single choice poll
              <RadioGroup value={selectedOptions[0]} className="space-y-2">
                {poll.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.id}
                      id={`option-${option.id}`}
                      onClick={() => handleOptionSelect(option.id)}
                    />
                    <label
                      htmlFor={`option-${option.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.text}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        ) : (
          // Results view
          <div className="space-y-3">
            {sortedOptions.map((option, index) => (
              <div key={option.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="font-medium">{option.text}</span>
                    {hasVoted && selectedOptions.includes(option.id) && (
                      <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
                    )}
                  </div>
                  <span className="font-mono">{calculatePercentage(option.votes)}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress
                    value={calculatePercentage(option.votes)}
                    className="h-2"
                    indicatorClassName={getOptionColor(index)}
                  />
                  <span className="text-xs text-muted-foreground w-8">{option.votes}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {!hasVoted && poll.status === "active" && (
        <CardFooter>
          <Button
            onClick={handleVote}
            className="w-full"
            disabled={selectedOptions.length === 0}
            variant={selectedOptions.length > 0 ? "default" : "outline"}
          >
            Submit Vote
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
