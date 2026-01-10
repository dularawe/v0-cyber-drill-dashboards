"use client"

import { useState, useEffect } from "react"
import { Plus, Settings, Play, Pause, Square, Users, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CountdownBanner } from "@/components/countdown-banner"
import { StatChip } from "@/components/stat-chip"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getDrillSessions,
  updateDrillSession,
  sendNotification,
  getLeaders,
  getQuestions,
  getAnswers,
} from "@/lib/api-client"

interface Drill {
  id: string
  name: string
  status: string
  start_time: string
  end_time: string
}

interface Stats {
  totalLeaders: number
  totalQuestions: number
  questionsCompleted: number
  questionsPending: number
  questionsClosed: number
}

export default function SuperAdminDashboard() {
  const [drills, setDrills] = useState<Drill[]>([])
  const [currentDrill, setCurrentDrill] = useState<Drill | null>(null)
  const [sessionActive, setSessionActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [stats, setStats] = useState<Stats>({
    totalLeaders: 0,
    totalQuestions: 0,
    questionsCompleted: 0,
    questionsPending: 0,
    questionsClosed: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [sessionsData, leadersData, questionsData, answersData] = await Promise.all([
        getDrillSessions(),
        getLeaders(),
        getQuestions(),
        getAnswers(),
      ])

      setDrills(sessionsData)
      const live = sessionsData.find((s: any) => s.status === "live")
      if (live) {
        setCurrentDrill(live)
        setSessionActive(true)
        calculateTimeRemaining(live.end_time)
      }

      const completed = answersData.filter((a: any) => a.status === "approved").length
      const pending = answersData.filter((a: any) => a.status === "submitted").length
      const closed = answersData.filter((a: any) => a.status === "rejected").length

      setStats({
        totalLeaders: leadersData.length,
        totalQuestions: questionsData.length,
        questionsCompleted: completed,
        questionsPending: pending,
        questionsClosed: closed,
      })
    } catch (error) {
      console.error("[v0] Error fetching dashboard data:", error)
      setAlert({ type: "error", message: "Failed to load dashboard data" })
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
      })

      await sendNotification({
        title: "Drill Started",
        message: `The drill "${currentDrill.name}" has started. Please begin answering questions.`,
        type: "info",
        is_broadcast: true,
      })

      setSessionActive(true)
      setAlert({ type: "success", message: "Drill started successfully!" })
      setTimeout(() => fetchDashboardData(), 1000)
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
      label: "Create Drill",
      href: "/super-admin/create-drill",
      icon: <Plus className="h-5 w-5" />,
      active: false,
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
    {
      label: "Notifications",
      href: "/super-admin/notifications",
      icon: <AlertCircle className="h-5 w-5" />,
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
            {alert.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{alert.message}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Dashboard Statistics */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Dashboard Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <StatChip label="Total Leaders" value={stats.totalLeaders} icon={<Users className="h-5 w-5" />} />
                <StatChip
                  label="Total Questions"
                  value={stats.totalQuestions}
                  icon={<Clock className="h-5 w-5" />}
                  variant="success"
                />
                <StatChip
                  label="Completed"
                  value={stats.questionsCompleted}
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  variant="success"
                />
                <StatChip
                  label="Pending"
                  value={stats.questionsPending}
                  icon={<Clock className="h-5 w-5" />}
                  variant="warning"
                />
                <StatChip
                  label="Closed"
                  value={stats.questionsClosed}
                  icon={<AlertCircle className="h-5 w-5" />}
                  variant="destructive"
                />
              </div>
            </div>

            {/* Questions Status Table */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Questions Status Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-2 px-4 font-semibold text-foreground">Status</th>
                        <th className="text-left py-2 px-4 font-semibold text-foreground">Count</th>
                        <th className="text-left py-2 px-4 font-semibold text-foreground">Percentage</th>
                        <th className="text-left py-2 px-4 font-semibold text-foreground">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50 hover:bg-secondary/30">
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Completed
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-green-600">{stats.questionsCompleted}</td>
                        <td className="py-3 px-4">
                          {stats.totalQuestions > 0
                            ? ((stats.questionsCompleted / stats.totalQuestions) * 100).toFixed(1)
                            : 0}
                          %
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">Questions approved by X-CONs</td>
                      </tr>
                      <tr className="border-b border-border/50 hover:bg-secondary/30">
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            Pending
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-yellow-600">{stats.questionsPending}</td>
                        <td className="py-3 px-4">
                          {stats.totalQuestions > 0
                            ? ((stats.questionsPending / stats.totalQuestions) * 100).toFixed(1)
                            : 0}
                          %
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">Awaiting X-CON review</td>
                      </tr>
                      <tr className="hover:bg-secondary/30">
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            Closed
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-red-600">{stats.questionsClosed}</td>
                        <td className="py-3 px-4">
                          {stats.totalQuestions > 0
                            ? ((stats.questionsClosed / stats.totalQuestions) * 100).toFixed(1)
                            : 0}
                          %
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">Rejected by X-CONs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

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
