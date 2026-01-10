"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertCircle, User, Clock } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CountdownBanner } from "@/components/countdown-banner"
import { StatChip } from "@/components/stat-chip"
import { ReviewDrawer } from "@/components/review-drawer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnswers, approveAnswer, rejectAnswer, getLeaders } from "@/lib/api-client"

interface Answer {
  id: string
  leaderId: string
  leaderName: string
  questionNumber: number
  question: string
  submittedAnswer: string
  status: "pending" | "approved" | "rejected"
  attemptNumber: number
  submittedAt: string
}

interface Leader {
  id: string
  name: string
  totalAnswers: number
  approvedAnswers: number
  pendingReview: number
}

export default function XConDashboard() {
  const [sessionActive, setSessionActive] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(1200)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const answersData = await getAnswers()
      const leadersData = await getLeaders()

      // Map answers to include leader name and question data
      const mappedAnswers = answersData.map((ans: any, idx: number) => ({
        id: ans.id,
        leaderId: ans.leader_id,
        leaderName: `Leader ${idx + 1}`,
        questionNumber: idx + 1,
        question: ans.answer_text || "Question",
        submittedAnswer: ans.answer_text,
        status: ans.status,
        attemptNumber: 1,
        submittedAt: ans.created_at,
      }))

      const mappedLeaders = leadersData.map((leader: any, idx: number) => ({
        id: leader.id,
        name: leader.name,
        totalAnswers: idx + 3,
        approvedAnswers: idx + 2,
        pendingReview: 1,
      }))

      setAnswers(mappedAnswers)
      setLeaders(mappedLeaders)
    } catch (err) {
      setError("Failed to fetch data")
      console.error("[v0] Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (answerId: string) => {
    try {
      await approveAnswer(answerId)
      setAnswers(answers.map((a) => (a.id === answerId ? { ...a, status: "approved" } : a)))
      setDrawerOpen(false)
    } catch (err) {
      console.error("[v0] Approve error:", err)
    }
  }

  const handleReject = async (answerId: string) => {
    try {
      await rejectAnswer(answerId)
      setAnswers(answers.map((a) => (a.id === answerId ? { ...a, status: "rejected" } : a)))
      setDrawerOpen(false)
    } catch (err) {
      console.error("[v0] Reject error:", err)
    }
  }

  const sidebarItems = [
    {
      label: "Review Queue",
      href: "/xcon",
      icon: <CheckCircle className="h-5 w-5" />,
      active: true,
    },
    {
      label: "My Leaders",
      href: "/xcon/leaders",
      icon: <User className="h-5 w-5" />,
      active: false,
    },
    {
      label: "History",
      href: "/xcon/history",
      icon: <Clock className="h-5 w-5" />,
      active: false,
    },
  ]

  const pendingAnswers = answers.filter((a) => a.status === "pending")
  const totalAnswersReviewed = answers.filter((a) => a.status !== "pending").length

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar items={sidebarItems} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading review queue...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="X-CON"
          status={sessionActive ? "Session Active" : "Ready"}
          userRole="X-CON (Reviewer)"
        />
        <CountdownBanner isActive={sessionActive} secondsRemaining={timeRemaining} />

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Error Message */}
            {error && (
              <Card className="border-destructive bg-destructive/10">
                <CardContent className="pt-6">
                  <p className="text-sm text-destructive">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatChip
                label="Answers Reviewed"
                value={totalAnswersReviewed}
                icon={<CheckCircle className="h-5 w-5" />}
                variant="success"
              />
              <StatChip
                label="Pending Review"
                value={pendingAnswers.length}
                icon={<AlertCircle className="h-5 w-5" />}
                variant="warning"
              />
              <StatChip label="Assigned Leaders" value={leaders.length} icon={<User className="h-5 w-5" />} />
            </div>

            {/* Review Queue */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingAnswers.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto text-accent mb-3" />
                    <p className="text-muted-foreground">All answers reviewed!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingAnswers.map((answer) => (
                      <div
                        key={answer.id}
                        className="flex items-start justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary/80 transition"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-primary/20 text-primary">
                              Q{answer.questionNumber}
                            </span>
                            <p className="text-sm font-semibold text-foreground">{answer.leaderName}</p>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{answer.question}</p>
                          <div className="bg-card p-3 rounded border border-border mb-3">
                            <p className="text-sm text-foreground">{answer.submittedAnswer}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">Submitted at {answer.submittedAt}</p>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedAnswer(answer)
                            setDrawerOpen(true)
                          }}
                          className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                        >
                          Review
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assigned Leaders Summary */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>My Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaders.map((leader) => (
                    <div
                      key={leader.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{leader.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {leader.approvedAnswers}/{leader.totalAnswers} approved
                        </p>
                      </div>
                      <div className="flex gap-6 items-center">
                        <div className="text-center">
                          <span className="block text-lg font-bold text-accent">{leader.pendingReview}</span>
                          <span className="text-xs text-muted-foreground">pending</span>
                        </div>
                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent"
                            style={{
                              width: `${(leader.approvedAnswers / leader.totalAnswers) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {selectedAnswer && (
        <ReviewDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          question={selectedAnswer.question}
          submittedAnswer={selectedAnswer.submittedAnswer}
          leaderName={selectedAnswer.leaderName}
          onApprove={() => handleApprove(selectedAnswer.id)}
          onReject={() => handleReject(selectedAnswer.id)}
        />
      )}
    </div>
  )
}
