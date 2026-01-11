"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
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

  const leaderboardEntries = [
    { rank: 1, name: "Sarah Chen", score: 75, attempts: 2, status: "completed" as const },
    { rank: 2, name: "You (Marcus)", score: 25, attempts: 2, status: "in-progress" as const },
    { rank: 3, name: "Emma Wilson", score: 20, attempts: 1, status: "pending" as const },
    { rank: 4, name: "Alex Rivera", score: 0, attempts: 0, status: "pending" as const },
    { rank: 5, name: "James Park", score: 15, attempts: 1, status: "pending" as const },
    { rank: 6, name: "Lisa Anderson", score: 10, attempts: 1, status: "pending" as const },
  ]

  return (
    <main className="flex-1">
      <DashboardHeader title="Live Standings" description="Real-time leaderboard of all drill participants" />

      <div className="p-6 space-y-6">
        <CountdownBanner />

        <div className="grid gap-4">
          <LeaderboardCard title="Leaderboard Rankings" entries={leaderboardEntries} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> Standings Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold mt-1">6</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">1</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">1</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">4</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
