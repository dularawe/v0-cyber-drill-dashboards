"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, MessageCircle, AlertCircle, Clock } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CountdownBanner } from "@/components/countdown-banner"
import { StatChip } from "@/components/stat-chip"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { submitAnswer } from "@/lib/api-client"

interface Message {
  id: string
  type: "question" | "instruction" | "result"
  content: string
  timestamp: string
}

interface Question {
  id: string
  number: number
  content: string
  status: "pending" | "submitted" | "approved" | "rejected"
  timeLimit: number
}

export default function LeaderDashboard() {
  const router = useRouter()
  const [sessionActive, setSessionActive] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(900)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(300)
  const [isQuestionExpired, setIsQuestionExpired] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "q-2",
    number: 2,
    content: "What are the main components of a security incident response plan?",
    status: "pending",
    timeLimit: 300,
  })

  useEffect(() => {
    const user = sessionStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    if (!sessionActive || currentQuestion.status !== "pending" || isQuestionExpired) return

    const timer = setInterval(() => {
      setQuestionTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsQuestionExpired(true)
          handleTimeExpired()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [sessionActive, currentQuestion.status, isQuestionExpired])

  const handleTimeExpired = async () => {
    if (currentQuestion.status === "pending") {
      setCurrentAnswer("")
      // Auto-load next question
      moveToNextQuestion()
    }
  }

  const moveToNextQuestion = () => {
    // Reset timer and move to next
    setQuestionTimeRemaining(300)
    setIsQuestionExpired(false)
    setCurrentQuestion({
      id: "q-3",
      number: 3,
      content: "What are some common methods for detecting zero-day vulnerabilities?",
      status: "pending",
      timeLimit: 300,
    })
  }

  const [messages] = useState<Message[]>([
    {
      id: "msg-1",
      type: "instruction",
      content: "Welcome to Cyber Drill 2025. The drill will begin in 60 seconds. Review the objectives and be ready.",
      timestamp: "2:00 PM",
    },
    {
      id: "msg-2",
      type: "question",
      content: "Question 1: Define a zero-day vulnerability and explain why it's critical to patch.",
      timestamp: "2:01 PM",
    },
    {
      id: "msg-3",
      type: "result",
      content: "Your answer to Question 1 was approved. +25 points",
      timestamp: "2:05 PM",
    },
    {
      id: "msg-4",
      type: "question",
      content: "Question 2: What are the main components of a security incident response plan?",
      timestamp: "2:06 PM",
    },
  ])

  const [stats] = useState({
    questionsAnswered: 1,
    questionsCorrect: 1,
    score: 25,
    rank: 2,
  })

  const sidebarItems = [
    {
      label: "Drill Interface",
      href: "/leader",
      icon: <MessageCircle className="h-5 w-5" />,
      active: true,
    },
    {
      label: "Live Standings",
      href: "/leader/standings",
      icon: <AlertCircle className="h-5 w-5" />,
      active: false,
    },
  ]

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return

    setIsSubmitting(true)
    try {
      await submitAnswer({
        session_id: "1",
        question_id: currentQuestion.id,
        answer_text: currentAnswer,
      })
      setCurrentAnswer("")
      moveToNextQuestion()
    } catch (error) {
      console.error("Error submitting answer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Cyber Drill Exercise"
          status={sessionActive ? "In Progress" : "Waiting"}
          userRole="Participant"
        />
        <CountdownBanner isActive={sessionActive} secondsRemaining={timeRemaining} />

        <div className="flex-1 overflow-hidden flex gap-6 p-8">
          {/* Left: Chat/Questions */}
          <div className="flex-1 flex flex-col">
            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <StatChip label="Answered" value={stats.questionsAnswered} />
              <StatChip label="Correct" value={stats.questionsCorrect} variant="success" />
              <StatChip label="Score" value={stats.score} variant="success" />
              <StatChip label="Rank" value={`#${stats.rank}`} />
            </div>

            {/* Chat Panel */}
            <Card className="flex-1 border-border bg-card flex flex-col overflow-hidden">
              <CardHeader className="border-b border-border">
                <CardTitle>Question Feed</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg ${
                      msg.type === "question"
                        ? "bg-primary/10 border-l-4 border-primary"
                        : msg.type === "result"
                          ? "bg-accent/10 border-l-4 border-accent"
                          : "bg-secondary/50 border-l-4 border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">
                        {msg.type === "question" ? "Question" : msg.type === "result" ? "Result" : "Announcement"}
                      </span>
                      <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-foreground">{msg.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Answer Input */}
            {currentQuestion.status === "pending" && !isQuestionExpired && (
              <Card className="border-border bg-card mt-6">
                <CardHeader className="border-b border-border pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Question {currentQuestion.number}</CardTitle>
                  <div
                    className={`flex items-center gap-2 text-sm font-semibold ${questionTimeRemaining < 60 ? "text-destructive" : "text-foreground"}`}
                  >
                    <Clock className="h-4 w-4" />
                    {formatTime(questionTimeRemaining)}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="mb-4">
                    <p className="text-sm text-foreground">{currentQuestion.content}</p>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      disabled={isSubmitting}
                      className="w-full h-24 p-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    />
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!currentAnswer.trim() || isSubmitting}
                      className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "Submitting..." : "Submit Answer"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isQuestionExpired && (
              <Card className="border-border bg-destructive/10 mt-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <div>
                      <p className="font-semibold">Time Limit Exceeded</p>
                      <p className="text-sm">This question has been marked as unanswered. Loading next question...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
