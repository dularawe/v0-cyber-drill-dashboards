"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, User, Clock } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CountdownBanner } from "@/components/countdown-banner"
import { StatChip } from "@/components/stat-chip"
import { ReviewDrawer } from "@/components/review-drawer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

  const [leaders] = useState<Leader[]>([
    { id: "leader-1", name: "Sarah Chen", totalAnswers: 5, approvedAnswers: 4, pendingReview: 1 },
    { id: "leader-2", name: "Marcus Johnson", totalAnswers: 4, approvedAnswers: 3, pendingReview: 1 },
    { id: "leader-3", name: "Emma Wilson", totalAnswers: 3, approvedAnswers: 2, pendingReview: 1 },
  ])

  const [answers, setAnswers] = useState<Answer[]>([
    {
      id: "ans-1",
      leaderId: "leader-1",
      leaderName: "Sarah Chen",
      questionNumber: 3,
      question: "What are the three types of phishing attacks?",
      submittedAnswer: "Spear phishing, whaling, and clone phishing",
      status: "pending",
      attemptNumber: 1,
      submittedAt: "2:45 PM",
    },
    {
      id: "ans-2",
      leaderId: "leader-2",
      leaderName: "Marcus Johnson",
      questionNumber: 5,
      question: "Describe a zero-day vulnerability",
      submittedAnswer: "A zero-day is an unknown security vulnerability that has not been disclosed or patched",
      status: "pending",
      attemptNumber: 1,
      submittedAt: "2:50 PM",
    },
    {
      id: "ans-3",
      leaderId: "leader-3",
      leaderName: "Emma Wilson",
      questionNumber: 2,
      question: "What is social engineering?",
      submittedAnswer: "Social engineering is manipulating people to divulge confidential information",
      status: "pending",
      attemptNumber: 2,
      submittedAt: "2:55 PM",
    },
    {
      id: "ans-4",
      leaderId: "leader-1",
      leaderName: "Sarah Chen",
      questionNumber: 1,
      question: "Define a malware attack",
      submittedAnswer: "Malware is malicious software designed to harm or exploit computer systems",
      status: "approved",
      attemptNumber: 1,
      submittedAt: "2:10 PM",
    },
  ])

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

  const handleApprove = (answerId: string) => {
    setAnswers(answers.map((a) => (a.id === answerId ? { ...a, status: "approved" } : a)))
    setDrawerOpen(false)
  }

  const handleReject = (answerId: string) => {
    setAnswers(answers.map((a) => (a.id === answerId ? { ...a, status: "rejected" } : a)))
    setDrawerOpen(false)
  }

  const pendingAnswers = answers.filter((a) => a.status === "pending")
  const totalAnswersReviewed = answers.filter((a) => a.status !== "pending").length

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
                            <span className="text-xs text-muted-foreground ml-auto">
                              Attempt {answer.attemptNumber}
                            </span>
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
