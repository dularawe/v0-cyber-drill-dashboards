"use client"

import { useState } from "react"
import { User, TrendingUp, CheckCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatChip } from "@/components/stat-chip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Leader {
  id: string
  name: string
  email: string
  team: string
  totalAnswers: number
  approvedAnswers: number
  rejectedAnswers: number
  pendingAnswers: number
  accuracy: number
  lastActive: string
}

export default function XConLeadersPage() {
  const [leaders] = useState<Leader[]>([
    {
      id: "leader-1",
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      team: "Red Team",
      totalAnswers: 12,
      approvedAnswers: 10,
      rejectedAnswers: 2,
      pendingAnswers: 0,
      accuracy: 83,
      lastActive: "5 mins ago",
    },
    {
      id: "leader-2",
      name: "Marcus Johnson",
      email: "marcus.johnson@example.com",
      team: "Blue Team",
      totalAnswers: 10,
      approvedAnswers: 8,
      rejectedAnswers: 1,
      pendingAnswers: 1,
      accuracy: 80,
      lastActive: "2 mins ago",
    },
    {
      id: "leader-3",
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      team: "Green Team",
      totalAnswers: 9,
      approvedAnswers: 7,
      rejectedAnswers: 2,
      pendingAnswers: 0,
      accuracy: 78,
      lastActive: "10 mins ago",
    },
    {
      id: "leader-4",
      name: "Alex Rodriguez",
      email: "alex.rodriguez@example.com",
      team: "Red Team",
      totalAnswers: 15,
      approvedAnswers: 13,
      rejectedAnswers: 2,
      pendingAnswers: 0,
      accuracy: 87,
      lastActive: "1 min ago",
    },
  ])

  const totalLeaders = leaders.length
  const averageAccuracy = Math.round(leaders.reduce((sum, l) => sum + l.accuracy, 0) / leaders.length)
  const totalAnswersReviewed = leaders.reduce((sum, l) => sum + l.totalAnswers, 0)

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <DashboardHeader title="My Leaders" status="All Active" userRole="X-CON (Reviewer)" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatChip label="Assigned Leaders" value={totalLeaders} icon={<User className="h-5 w-5" />} />
            <StatChip
              label="Total Answers Reviewed"
              value={totalAnswersReviewed}
              icon={<CheckCircle className="h-5 w-5" />}
              variant="success"
            />
            <StatChip
              label="Average Accuracy"
              value={`${averageAccuracy}%`}
              icon={<TrendingUp className="h-5 w-5" />}
              variant="info"
            />
          </div>

          {/* Leaders Table */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Leaders Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Team</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Total Answers
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Approved</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Rejected</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Accuracy</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaders.map((leader) => (
                      <tr key={leader.id} className="border-b border-border hover:bg-secondary/50 transition">
                        <td className="py-4 px-4 text-sm font-medium text-foreground">{leader.name}</td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{leader.email}</td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{leader.team}</td>
                        <td className="py-4 px-4 text-sm text-center font-semibold text-foreground">
                          {leader.totalAnswers}
                        </td>
                        <td className="py-4 px-4 text-sm text-center">
                          <span className="px-2 py-1 rounded bg-green-500/20 text-green-600 text-xs font-semibold">
                            {leader.approvedAnswers}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-center">
                          <span className="px-2 py-1 rounded bg-red-500/20 text-red-600 text-xs font-semibold">
                            {leader.rejectedAnswers}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-center font-semibold text-foreground">
                          {leader.accuracy}%
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{leader.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
