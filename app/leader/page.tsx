"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, AlertCircle, Clock, CheckCircle2, Bell, Lightbulb, X } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { CountdownBanner } from "@/components/countdown-banner"
import { StatChip } from "@/components/stat-chip"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { submitAnswer, getDrillSessions, getNotifications } from "@/lib/api-client"

interface Question {
  id: string
  number: number
  content: string
  status: "pending" | "submitted" | "approved" | "rejected"
  timeLimit: number
  hint?: string
}

interface Session {
  id: string
  name: string
  status: string
  start_time: string
  end_time: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showHintPopup, setShowHintPopup] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "q-1",
    number: 1,
    content: "Loading question...",
    status: "pending",
    timeLimit: 300,
    hint: "",
  })

  useEffect(() => {
    const user = sessionStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
    }
    fetchActiveSession()
  }, [router])

  useEffect(() => {
    const sessionInterval = setInterval(() => {
      fetchActiveSession()
    }, 3000)
    return () => clearInterval(sessionInterval)
  }, [])

  useEffect(() => {
    const notificationInterval = setInterval(() => {
      fetchNotifications()
    }, 2000)
    return () => clearInterval(notificationInterval)
  }, [])

  const fetchActiveSession = async () => {
    try {
      const sessions = await getDrillSessions()
      const active = sessions.find((s: any) => s.status === "live")
      if (active) {
        setCurrentSession(active)
        setSessionActive(true)
        calculateTimeRemaining(active.end_time)
      } else {
        setSessionActive(false)
      }
    } catch (error) {
      console.error("[v0] Error fetching session:", error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const notifs = await getNotifications()
      setNotifications(notifs)
      const unread = notifs.filter((n: any) => !n.read).length
      setUnreadCount(unread)
    } catch (error) {
      console.error("[v0] Error fetching notifications:", error)
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
    setShowHintPopup(false)
    setCurrentQuestion({
      id: "q-2",
      number: 2,
      content: "What are the main components of a security incident response plan?",
      status: "pending",
      timeLimit: 300,
      hint: "Consider the phases: Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned.",
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

  return (
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

      {notifications.length > 0 && (
        <div className="mx-4 mt-2 p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            {unreadCount} new notification{unreadCount !== 1 ? "s" : ""}
          </span>
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
            <CardHeader className="border-b border-border flex flex-row items-center justify-between">
              <CardTitle>Question {currentQuestion.number}</CardTitle>
              {currentQuestion.hint && (
                <button
                  type="button"
                  onClick={() => setShowHintPopup(!showHintPopup)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition-colors"
                  title="View Hint"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span className="text-sm font-medium">Hint</span>
                </button>
              )}
            </CardHeader>

            {/* Hint Popup */}
            {showHintPopup && currentQuestion.hint && (
              <div className="mx-4 mt-2 p-4 rounded-lg bg-yellow-50 border border-yellow-200 relative">
                <button
                  type="button"
                  onClick={() => setShowHintPopup(false)}
                  className="absolute top-2 right-2 text-yellow-600 hover:text-yellow-800"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800 mb-1">Hint</p>
                    <p className="text-sm text-yellow-700">{currentQuestion.hint}</p>
                  </div>
                </div>
              </div>
            )}

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
  )
}
