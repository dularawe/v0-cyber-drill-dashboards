"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAnswers } from "@/lib/api-client"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Clock, MessageCircle } from "lucide-react"

interface Answer {
  id: string
  question_id: string
  answer_text: string
  status: "submitted" | "approved" | "rejected"
  feedback?: string
  created_at: string
}

export default function AnswersPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = sessionStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
      return
    }
    fetchAnswers()
  }, [router])

  const fetchAnswers = async () => {
    try {
      const data = await getAnswers()
      setAnswers(data)
    } catch (error) {
      console.error("[v0] Error fetching answers:", error)
    } finally {
      setLoading(false)
    }
  }

  const sidebarItems = [
    {
      label: "Drill Interface",
      href: "/leader",
      icon: <MessageCircle className="h-5 w-5" />,
      active: false,
    },
    {
      label: "My Answers",
      href: "/leader/answers",
      icon: <CheckCircle2 className="h-5 w-5" />,
      active: true,
    },
    {
      label: "Live Standings",
      href: "/leader/standings",
      icon: <Clock className="h-5 w-5" />,
      active: false,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 border-l-4 border-green-500 text-green-700"
      case "rejected":
        return "bg-red-100 border-l-4 border-red-500 text-red-700"
      default:
        return "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5" />
      case "rejected":
        return <XCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Your Answers" status="Review" userRole="Participant" />

        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading answers...</div>
          ) : answers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">No answers submitted yet.</CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground mb-6">Answer Review</h2>
              {answers.map((answer, index) => (
                <Card key={answer.id} className="border-border bg-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(answer.status)}`}
                      >
                        {getStatusIcon(answer.status)}
                        <span className="font-semibold capitalize">{answer.status}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Your Answer:</p>
                      <p className="text-foreground p-3 bg-secondary/50 rounded-lg">{answer.answer_text}</p>
                    </div>
                    {answer.feedback && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Reviewer Feedback:</p>
                        <p className="text-foreground p-3 bg-secondary/50 rounded-lg">{answer.feedback}</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(answer.created_at).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
