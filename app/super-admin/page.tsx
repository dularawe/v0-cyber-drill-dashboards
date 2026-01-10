"use client"

import { useState, useEffect } from "react"
import { Settings, Play, Pause, Square, Users, Clock, CheckCircle2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CountdownBanner } from "@/components/countdown-banner"
import { StatChip } from "@/components/stat-chip"
import { LeaderboardCard } from "@/components/leaderboard-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDrillSessions, updateDrillSession, sendNotification } from "@/lib/api-client"

interface Drill {
  id: string
  name: string
  status: string
  start_time: string
  end_time: string
}

interface XCon {
  id: string
  name: string
  assignedLeaders: number
  reviewsPending: number
}

export default function SuperAdminDashboard() {
  const [drills, setDrills] = useState<Drill[]>([])
  const [currentDrill, setCurrentDrill] = useState<Drill | null>(null)
  const [sessionActive, setSessionActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const [xCons] = useState<XCon[]>([
    { id: "xcon-1", name: "Team Alpha", assignedLeaders: 8, reviewsPending: 3 },
    { id: "xcon-2", name: "Team Beta", assignedLeaders: 6, reviewsPending: 1 },
    { id: "xcon-3", name: "Team Gamma", assignedLeaders: 5, reviewsPending: 2 },
  ])

  const leaderboardEntries = [
    { rank: 1, name: "Sarah Chen", score: 95, attempts: 1, status: "completed" as const },
    { rank: 2, name: "Marcus Johnson", score: 88, attempts: 1, status: "completed" as const },
    { rank: 3, name: "Emma Wilson", score: 82, attempts: 1, status: "in-progress" as const },
    { rank: 4, name: "Alex Rivera", score: 75, attempts: 1, status: "pending" as const },
    { rank: 5, name: "Jordan Lee", score: 70, attempts: 1, status: "pending" as const },
  ]

  useEffect(() => {
    fetchDrills()
  }, [])

  const fetchDrills = async () => {
    try {
      const sessions = await getDrillSessions()
      setDrills(sessions)
      const live = sessions.find((s: any) => s.status === "live")
      if (live) {
        setCurrentDrill(live)
        setSessionActive(true)
        calculateTimeRemaining(live.end_time)
      }
    } catch (error) {
      console.error("[v0] Error fetching drills:", error)
      setAlert({ type: "error", message: "Failed to load drills" })
    } finally {
      setLoading(false)
    }
  }

  const calculateTimeRemaining = (endTime: string) => {
    const end = new Date(endTime).getTime()
    const now = new Date().getTime()
    const remaining = Math.max(0, Math.floor((end - now) / 1000))
    setTimeRemaining(remaining)
  }

  useEffect(() => {
    if (!currentDrill || !sessionActive) return
    const timer = setInterval(() => {
      calculateTimeRemaining(currentDrill.end_time)
    }, 1000)
    return () => clearInterval(timer)
  }, [currentDrill, sessionActive])

  const handleStartDrill = async () => {
    if (!currentDrill) return
    try {
      await updateDrillSession(currentDrill.id, {
        status: "live",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 30 * 60000).toISOString(),
      })

      await sendNotification({
        title: "Drill Started",
        message: `The drill "${currentDrill.name}" has started. Please begin answering questions.`,
        type: "info",
        is_broadcast: true,
      })

      setSessionActive(true)
      setAlert({ type: "success", message: "Drill started successfully!" })
      setTimeout(() => fetchDrills(), 1000)
    } catch (error) {
      console.error("[v0] Error starting drill:", error)
      setAlert({ type: "error", message: "Failed to start drill" })
    }
  }

  const handlePauseDrill = async () => {
    if (!currentDrill) return
    try {
      await updateDrillSession(currentDrill.id, { status: "scheduled" })
      setSessionActive(false)
      setAlert({ type: "success", message: "Drill paused successfully!" })
    } catch (error) {
      console.error("[v0] Error pausing drill:", error)
      setAlert({ type: "error", message: "Failed to pause drill" })
    }
  }

  const handleEndDrill = async () => {
    if (!currentDrill) return
    try {
      await updateDrillSession(currentDrill.id, { status: "completed" })
      setSessionActive(false)
      setAlert({ type: "success", message: "Drill ended successfully!" })
    } catch (error) {
      console.error("[v0] Error ending drill:", error)
      setAlert({ type: "error", message: "Failed to end drill" })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

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

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar items={sidebarItems} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </main>
      </div>
    )
  }

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

        {alert && (
          <div
            className={`mx-4 mt-4 p-4 rounded-lg flex items-center gap-2 ${alert.type === "success" ? "bg-green-100 border-l-4 border-green-500 text-green-700" : "bg-red-100 border-l-4 border-red-500 text-red-700"}`}
          >
            <span>{alert.message}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {currentDrill ? (
              <>
                {/* Current Drill Configuration */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Current Drill: {currentDrill.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatChip label="Status" value={currentDrill.status} />
                      <StatChip
                        label="Time Remaining"
                        value={sessionActive ? formatTime(timeRemaining) : "Paused"}
                        variant={sessionActive ? "warning" : "default"}
                      />
                      <StatChip label="Start Time" value={new Date(currentDrill.start_time).toLocaleTimeString()} />
                      <StatChip label="End Time" value={new Date(currentDrill.end_time).toLocaleTimeString()} />
                    </div>

                    {/* Session Controls */}
                    <div className="flex gap-3">
                      {!sessionActive ? (
                        <Button
                          onClick={handleStartDrill}
                          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Play className="h-4 w-4" />
                          Start Drill
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={handlePauseDrill}
                            className="gap-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            <Pause className="h-4 w-4" />
                            Pause Drill
                          </Button>
                          <Button
                            onClick={handleEndDrill}
                            className="gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                          >
                            <Square className="h-4 w-4" />
                            End Drill
                          </Button>
                        </>
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
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No drills available. Please create a drill first.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
