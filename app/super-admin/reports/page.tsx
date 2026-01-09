"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatChip } from "@/components/stat-chip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Users, Clock, FileText, TrendingUp, Award } from "lucide-react"

export default function ReportsPage() {
  const sidebarItems = [
    { label: "Overview", href: "/super-admin", icon: <FileText className="h-5 w-5" />, active: false },
    { label: "Questions", href: "/super-admin/questions", icon: <CheckCircle2 className="h-5 w-5" />, active: false },
    { label: "X-CONs", href: "/super-admin/xcons", icon: <Users className="h-5 w-5" />, active: false },
    { label: "Participants", href: "/super-admin/participants", icon: <Users className="h-5 w-5" />, active: false },
    { label: "Reports", href: "/super-admin/reports", icon: <Clock className="h-5 w-5" />, active: true },
  ]

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
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Reports & Analytics" status="Reports" userRole="Super Admin" />

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Overview Stats */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {reportStats.map((stat) => (
                  <StatChip key={stat.label} {...stat} />
                ))}
              </div>
            </div>

            {/* Drill Reports */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Recent Drill Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Drill Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Completions</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Avg Score</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Avg Time</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drillReports.map((report, idx) => (
                        <tr key={idx} className="border-b border-border hover:bg-secondary/50 transition">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">{report.name}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{report.completions}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{report.avgScore}/100</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{report.avgTime}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{report.date}</td>
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
    </div>
  )
}
