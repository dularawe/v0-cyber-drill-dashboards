"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, MessageCircle, AlertCircle, Clock, CheckCircle2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CountdownBanner } from "@/components/countdown-banner"
import { StatChip } from "@/components/stat-chip"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { submitAnswer, getDrillSessions } from "@/lib/api-client"

interface Question {
  id: string
  number: number
  content: string
  status: "pending" | "submitted" | "approved" | "rejected"
  timeLimit: number
}

interface Session {
  id: string
  name: string
  status: string
  start_time: string
  end_time: string
}

export default function LeaderDashboard() {
  const router = useRouter()
  const [sessionActive, setSessionActive] = useState(false)
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(300)
  const [isQuestionExpired, setIsQuestionExpired] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "q-1",
    number: 1,
    content: "Loading question...",
    status: "pending",
    timeLimit: 300,
  })

  useEffect(() => {
    const user = sessionStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
    }
    fetchActiveSession()
  }, [router])

  const fetchActiveSession = async () => {
    try {
      const sessions = await getDrillSessions()
      const active = sessions.find((s: any) => s.status === "live")
      if (active) {
        setCurrentSession(active)
        setSessionActive(true)
        calculateTimeRemaining(active.end_time)
      }
    } catch (error) {
      console.error("[v0] Error fetching session:", error)
    }
  }

  const calculateTimeRemaining = (endTime: string) => {
    const end = new Date(endTime).getTime()
    const now = new Date().getTime()
    const remaining = Math.max(0, Math.floor((end - now) / 1000))
    setTimeRemaining(remaining)
  }

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
      setAlert({ type: "error", message: "Time limit exceeded. Question marked as unanswered." })
      setCurrentAnswer("")
      moveToNextQuestion()
    }
  }

  const moveToNextQuestion = () => {
    setQuestionTimeRemaining(300)
    setIsQuestionExpired(false)
    setCurrentQuestion({
      id: "q-2",
      number: 2,
      content: "What are the main components of a security incident response plan?",
      status: "pending",
      timeLimit: 300,
    })
  }

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      setAlert({ type: "error", message: "Please enter an answer before submitting." })
      return
    }

    setIsSubmitting(true)
    try {
      const questionIdNumeric = currentQuestion.id.replace("q-", "")
      await submitAnswer({
        session_id: currentSession?.id || "1",
        question_id: questionIdNumeric,
        answer_text: currentAnswer,
      })
      setAlert({ type: "success", message: "Answer submitted successfully!" })
      setCurrentAnswer("")
      moveToNextQuestion()
    } catch (error) {
      console.error("[v0] API Error:", error)
      setAlert({ type: "error", message: "Failed to submit answer. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

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

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title={currentSession?.name || "Cyber Drill Exercise"}
          status={sessionActive ? "In Progress" : "Waiting"}
          userRole="Participant"
        />
        <CountdownBanner isActive={sessionActive} secondsRemaining={timeRemaining} />

        {alert && (
          <div
            className={`mx-4 mt-4 p-4 rounded-lg flex items-center gap-2 ${alert.type === "success" ? "bg-green-100 border-l-4 border-green-500 text-green-700" : "bg-red-100 border-l-4 border-red-500 text-red-700"}`}
          >
            {alert.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{alert.message}</span>
          </div>
        )}

        <div className="flex-1 overflow-hidden flex gap-6 p-8">
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-3 gap-3 mb-6">
              <StatChip label="Session Time" value={formatTime(timeRemaining)} />
              <StatChip label="Question Time" value={formatTime(questionTimeRemaining)} variant="warning" />
              <StatChip label="Status" value={currentQuestion.status} variant="default" />
            </div>

            <Card className="flex-1 border-border bg-card flex flex-col overflow-hidden">
              <CardHeader className="border-b border-border">
                <CardTitle>Question {currentQuestion.number}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4">
                <p className="text-base text-foreground">{currentQuestion.content}</p>
              </CardContent>
            </Card>

            {currentQuestion.status === "pending" && !isQuestionExpired && (
              <Card className="border-border bg-card mt-6">
                <CardHeader className="border-b border-border pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Your Answer</CardTitle>
                  <div
                    className={`flex items-center gap-2 text-sm font-semibold ${questionTimeRemaining < 60 ? "text-destructive" : "text-foreground"}`}
                  >
                    <Clock className="h-4 w-4" />
                    {formatTime(questionTimeRemaining)}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
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
