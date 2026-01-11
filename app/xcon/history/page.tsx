"use client"

import { useState } from "react"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatChip } from "@/components/stat-chip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReviewHistory {
  id: string
  leaderName: string
  questionNumber: number
  question: string
  submittedAnswer: string
  status: "approved" | "rejected"
  reviewedAt: string
  reviewTime: string
}

export default function XConHistoryPage() {
  const [history] = useState<ReviewHistory[]>([
    {
      id: "hist-1",
      leaderName: "Sarah Chen",
      questionNumber: 5,
      question: "What is a Man-in-the-Middle (MITM) attack?",
      submittedAnswer: "An attack where the attacker intercepts communication between two parties",
      status: "approved",
      reviewedAt: "Today, 3:45 PM",
      reviewTime: "2 mins",
    },
    {
      id: "hist-2",
      leaderName: "Marcus Johnson",
      questionNumber: 3,
      question: "Explain two-factor authentication",
      submittedAnswer: "A security method using two different verification methods to confirm identity",
      status: "approved",
      reviewedAt: "Today, 3:30 PM",
      reviewTime: "3 mins",
    },
    {
      id: "hist-3",
      leaderName: "Emma Wilson",
      questionNumber: 7,
      question: "What is ransomware?",
      submittedAnswer: "Malware that locks files and demands payment",
      status: "rejected",
      reviewedAt: "Today, 3:15 PM",
      reviewTime: "5 mins",
    },
    {
      id: "hist-4",
      leaderName: "Alex Rodriguez",
      questionNumber: 4,
      question: "Define encryption",
      submittedAnswer: "The process of converting information into a code to prevent unauthorized access",
      status: "approved",
      reviewedAt: "Today, 2:50 PM",
      reviewTime: "1 min",
    },
    {
      id: "hist-5",
      leaderName: "Sarah Chen",
      questionNumber: 2,
      question: "What is a vulnerability?",
      submittedAnswer: "A weakness in a system that can be exploited by attackers",
      status: "approved",
      reviewedAt: "Today, 2:30 PM",
      reviewTime: "2 mins",
    },
    {
      id: "hist-6",
      leaderName: "Marcus Johnson",
      questionNumber: 1,
      question: "Define cybersecurity",
      submittedAnswer: "The practice of protecting systems and networks from digital attacks",
      status: "approved",
      reviewedAt: "Today, 2:15 PM",
      reviewTime: "1 min",
    },
  ])

  const approvedCount = history.filter((h) => h.status === "approved").length
  const rejectedCount = history.filter((h) => h.status === "rejected").length
  const approvalRate = Math.round((approvedCount / history.length) * 100)

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <DashboardHeader title="Review History" status="Archive" userRole="X-CON (Reviewer)" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatChip label="Total Reviews" value={history.length} icon={<Clock className="h-5 w-5" />} />
            <StatChip
              label="Approved"
              value={approvedCount}
              icon={<CheckCircle className="h-5 w-5" />}
              variant="success"
            />
            <StatChip label="Rejected" value={rejectedCount} icon={<XCircle className="h-5 w-5" />} variant="error" />
          </div>

          {/* Approval Rate Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent transition-all" style={{ width: `${approvalRate}%` }} />
                  </div>
                </div>
                <span className="text-2xl font-bold text-accent">{approvalRate}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Review History Timeline */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Review Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {item.status === "approved" ? (
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground">{item.leaderName}</p>
                          <p className="text-sm text-muted-foreground">
                            Q{item.questionNumber}: {item.question}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">{item.reviewedAt}</p>
                          <p className="text-xs text-muted-foreground">Reviewed in {item.reviewTime}</p>
                        </div>
                      </div>
                      <div className="bg-secondary/50 p-3 rounded border border-border mt-2">
                        <p className="text-sm text-foreground">{item.submittedAnswer}</p>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.status === "approved" ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
                          }`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
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
  )
}
