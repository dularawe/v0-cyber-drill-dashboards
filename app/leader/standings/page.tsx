"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CountdownBanner } from "@/components/countdown-banner"
import { LeaderboardCard } from "@/components/leaderboard-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StandingsPage() {
  const router = useRouter()

  useEffect(() => {
    const user = sessionStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
    }
  }, [router])

  const [sessionActive] = [true]
  const [timeRemaining] = [900]

  const leaderboardEntries = [
    { rank: 1, name: "Sarah Chen", score: 75, attempts: 2, status: "completed" as const },
    { rank: 2, name: "You (Marcus)", score: 25, attempts: 2, status: "in-progress" as const },
    { rank: 3, name: "Emma Wilson", score: 20, attempts: 1, status: "pending" as const },
    { rank: 4, name: "Alex Rivera", score: 0, attempts: 0, status: "pending" as const },
    { rank: 5, name: "James Park", score: 15, attempts: 1, status: "pending" as const },
    { rank: 6, name: "Lisa Anderson", score: 10, attempts: 1, status: "pending" as const },
  ]

  const sidebarItems = [
    {
      label: "Drill Interface",
      href: "/leader",
      icon: <MessageCircle className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Live Standings",
      href: "/leader/standings",
      icon: <BarChart3 className="h-5 w-5" />,
      active: true,
    },
  ]

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

        <div className="flex-1 overflow-hidden p-8">
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Live Standings</h2>
              <p className="text-muted-foreground">Real-time leaderboard of all drill participants</p>
            </div>

            <div className="flex-1 overflow-auto">
              <LeaderboardCard entries={leaderboardEntries} title="Leaderboard Rankings" />
            </div>

            {/* Stats Summary */}
            <Card className="border-border bg-card mt-6">
              <CardHeader>
                <CardTitle className="text-base">Standings Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground mb-1">Total Participants</p>
                    <p className="text-2xl font-bold text-foreground">6</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground mb-1">Completed</p>
                    <p className="text-2xl font-bold text-foreground">1</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-foreground">1</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground mb-1">Pending</p>
                    <p className="text-2xl font-bold text-foreground">4</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

import { MessageCircle } from "lucide-react"
