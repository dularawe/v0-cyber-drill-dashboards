"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { StatChip } from "@/components/stat-chip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Users, TrendingUp, Award } from "lucide-react"

export default function ReportsPage() {
  const reportStats = [
    { label: "Total Drills Run", value: 24, icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: "Total Participants", value: 156, icon: <Users className="h-5 w-5" /> },
    { label: "Completion Rate", value: "94%", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Avg Score", value: "82/100", icon: <Award className="h-5 w-5" /> },
  ]

  const drillReports = [
    {
      name: "Phishing Detection 2025",
      completions: 18,
      avgScore: 85,
      avgTime: "12m 34s",
      date: "2025-01-08",
    },
    {
      name: "Password Security Basics",
      completions: 22,
      avgScore: 79,
      avgTime: "8m 12s",
      date: "2025-01-07",
    },
    {
      name: "Data Classification 101",
      completions: 15,
      avgScore: 88,
      avgTime: "14m 45s",
      date: "2025-01-06",
    },
  ]

  return (
    <main className="flex-1">
      <DashboardHeader title="Reports & Analytics" description="Reports" />

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {reportStats.map((stat, index) => (
              <StatChip key={index} label={stat.label} value={stat.value} icon={stat.icon} />
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Drill Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 px-4">Drill Name</th>
                    <th className="text-left py-2 px-4">Completions</th>
                    <th className="text-left py-2 px-4">Avg Score</th>
                    <th className="text-left py-2 px-4">Avg Time</th>
                    <th className="text-left py-2 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {drillReports.map((report, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{report.name}</td>
                      <td className="py-3 px-4">{report.completions}</td>
                      <td className="py-3 px-4">{report.avgScore}/100</td>
                      <td className="py-3 px-4">{report.avgTime}</td>
                      <td className="py-3 px-4">{report.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
