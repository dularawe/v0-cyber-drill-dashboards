"use client"

import { useState } from "react"
import { Settings, Play, Pause, Square, Users, Clock, CheckCircle2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CountdownBanner } from "@/components/countdown-banner"
import { StatChip } from "@/components/stat-chip"
import { LeaderboardCard } from "@/components/leaderboard-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Drill {
  id: string
  name: string
  totalQuestions: number
  timePerQuestion: number
  attemptLimit: number
}

interface XCon {
  id: string
  name: string
  assignedLeaders: number
  reviewsPending: number
}

export default function SuperAdminDashboard() {
  const [sessionActive, setSessionActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(1800)
  const [currentDrill, setCurrentDrill] = useState<Drill>({
    id: "1",
    name: "Phishing Detection 2025",
    totalQuestions: 10,
    timePerQuestion: 180,
    attemptLimit: 3,
  })

  const [drills] = useState<Drill[]>([currentDrill])

  const [xCons] = useState<XCon[]>([
    { id: "xcon-1", name: "Team Alpha", assignedLeaders: 8, reviewsPending: 3 },
    { id: "xcon-2", name: "Team Beta", assignedLeaders: 6, reviewsPending: 1 },
    { id: "xcon-3", name: "Team Gamma", assignedLeaders: 5, reviewsPending: 2 },
  ])

  const leaderboardEntries = [
    { rank: 1, name: "Sarah Chen", score: 95, attempts: 2, status: "completed" as const },
    { rank: 2, name: "Marcus Johnson", score: 88, attempts: 2, status: "completed" as const },
    { rank: 3, name: "Emma Wilson", score: 82, attempts: 3, status: "in-progress" as const },
    { rank: 4, name: "Alex Rivera", score: 75, attempts: 1, status: "pending" as const },
    { rank: 5, name: "Jordan Lee", score: 70, attempts: 2, status: "pending" as const },
  ]

  const sidebarItems = [
    {
      label: "Overview",
      href: "/super-admin",
      icon: <Settings className="h-5 w-5" />,
      active: true,
    },
    {
      label: "Questions",
      href: "/super-admin/questions",
      icon: <CheckCircle2 className="h-5 w-5" />,
      active: false,
    },
    {
      label: "X-CONs",
      href: "/super-admin/xcons",
      icon: <Users className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Participants",
      href: "/super-admin/participants",
      icon: <Users className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Reports",
      href: "/super-admin/reports",
      icon: <Clock className="h-5 w-5" />,
      active: false,
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Cyber Drill Master Control"
          status={sessionActive ? "Session Active" : "Ready"}
          userRole="Super Admin"
        />
        <CountdownBanner isActive={sessionActive} secondsRemaining={timeRemaining} />

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Current Drill Configuration */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Current Drill: {currentDrill.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <StatChip label="Total Questions" value={currentDrill.totalQuestions} />
                  <StatChip label="Time/Question" value={`${currentDrill.timePerQuestion}s`} />
                  <StatChip label="Attempt Limit" value={currentDrill.attemptLimit} />
                  <StatChip label="Status" value={sessionActive ? "Live" : "Idle"} variant="default" />
                </div>

                {/* Session Controls */}
                <div className="flex gap-3 mb-6">
                  <Button
                    onClick={() => setSessionActive(!sessionActive)}
                    className={`gap-2 ${
                      sessionActive
                        ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                  >
                    {sessionActive ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause Session
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start Session
                      </>
                    )}
                  </Button>

                  {sessionActive && (
                    <Button onClick={() => setSessionActive(false)} variant="outline" className="gap-2">
                      <Square className="h-4 w-4" />
                      End Session
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Session Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatChip label="Total Leaders" value={19} icon={<Users className="h-5 w-5" />} />
                <StatChip
                  label="X-CONs Active"
                  value={xCons.length}
                  icon={<Users className="h-5 w-5" />}
                  variant="success"
                />
                <StatChip
                  label="Pending Reviews"
                  value={xCons.reduce((sum, xcon) => sum + xcon.reviewsPending, 0)}
                  icon={<Clock className="h-5 w-5" />}
                  variant="warning"
                />
              </div>
            </div>

            {/* X-CON Assignments */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>X-CON Team Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {xCons.map((xcon) => (
                    <div
                      key={xcon.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary/80 transition"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{xcon.name}</p>
                        <p className="text-sm text-muted-foreground">{xcon.assignedLeaders} leaders assigned</p>
                      </div>
                      <div className="flex gap-4 items-center">
                        <span className="text-2xl font-bold text-primary">{xcon.reviewsPending}</span>
                        <span className="text-sm text-muted-foreground">reviews pending</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Leaderboard */}
            <LeaderboardCard entries={leaderboardEntries} title="Live Leaderboard" />
          </div>
        </div>
      </main>
    </div>
  )
}
