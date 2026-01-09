"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, MessageCircle, AlertCircle, RotateCcw } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CountdownBanner } from "@/components/countdown-banner"
import { StatChip } from "@/components/stat-chip"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  id: string
  type: "question" | "instruction" | "result"
  content: string
  timestamp: string
}

interface QuestionAttempt {
  attemptNumber: number
  answer: string
  status: "submitted" | "approved" | "rejected"
  feedback?: string
  timestamp: string
}

interface Question {
  id: string
  number: number
  content: string
  attempts: QuestionAttempt[]
  maxAttempts: number
  status: "pending" | "submitted" | "approved" | "rejected"
}

export default function LeaderDashboard() {
  const router = useRouter()
  const [sessionActive, setSessionActive] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(900)
  const [currentAnswer, setCurrentAnswer] = useState("")

  useEffect(() => {
    const user = sessionStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
    }
  }, [router])

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

  const [currentQuestion] = useState<Question>({
    id: "q-2",
    number: 2,
    content: "What are the main components of a security incident response plan?",
    attempts: [
      {
        attemptNumber: 1,
        answer: "Preparation, detection, analysis, containment, eradication, recovery.",
        status: "rejected",
        feedback: "Missing post-incident activity phase",
        timestamp: "2:07 PM",
      },
    ],
    maxAttempts: 3,
    status: "rejected",
  })

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

  const handleSubmitAnswer = () => {
    if (currentAnswer.trim()) {
      setCurrentAnswer("")
    }
  }

  const canRetry =
    currentQuestion.attempts.length < currentQuestion.maxAttempts && currentQuestion.status !== "approved"
  const remainingAttempts = currentQuestion.maxAttempts - currentQuestion.attempts.length

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
            {/* Stats Bar - Removed attempts card */}
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
            {(currentQuestion.status === "pending" || canRetry) && (
              <Card className="border-border bg-card mt-6">
                <CardHeader className="border-b border-border pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Question {currentQuestion.number}</CardTitle>
                    {currentQuestion.attempts.length > 0 && (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        Attempt {currentQuestion.attempts.length + 1} of {currentQuestion.maxAttempts}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3 mb-4">
                    <p className="text-sm text-foreground flex-1">{currentQuestion.content}</p>
                    <RotateCcw className="h-4 w-4 text-primary flex-shrink-0 mt-1" title="Reattempt available" />
                  </div>

                  {currentQuestion.attempts.length > 0 && (
                    <div className="mb-4 p-3 rounded-lg bg-secondary border border-border space-y-2">
                      <p className="text-xs font-semibold text-foreground">
                        Previous Attempt{currentQuestion.attempts.length > 1 ? "s" : ""}:
                      </p>
                      {currentQuestion.attempts.map((attempt) => (
                        <div key={attempt.attemptNumber} className="text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">Attempt {attempt.attemptNumber}</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                attempt.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : attempt.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-muted-foreground italic">{attempt.answer}</p>
                          {attempt.feedback && <p className="text-red-600 font-medium">Feedback: {attempt.feedback}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3">
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full h-24 p-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {remainingAttempts} attempt{remainingAttempts !== 1 ? "s" : ""} remaining
                      </span>
                      {canRetry ? (
                        <Button
                          onClick={handleSubmitAnswer}
                          disabled={!currentAnswer.trim()}
                          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Retry Answer
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmitAnswer}
                          disabled={!currentAnswer.trim()}
                          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Send className="h-4 w-4" />
                          Submit Answer
                        </Button>
                      )}
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
