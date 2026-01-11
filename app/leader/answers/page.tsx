"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAnswers } from "@/lib/api-client"
import { DashboardHeader } from "@/components/dashboard-header"
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

  return (
    <main className="flex-1">
      <DashboardHeader title="Answer Review" description="Review your submitted answers" />

      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">Loading your answers...</div>
        ) : answers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No answers found</div>
        ) : (
          <div className="space-y-4">
            {answers.map((answer) => (
              <Card key={answer.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {answer.status === "approved" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    {answer.status === "rejected" && <XCircle className="h-5 w-5 text-red-600" />}
                    {answer.status === "submitted" && <Clock className="h-5 w-5 text-yellow-600" />}
                    Question {answer.question_id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Your Answer</p>
                      <p className="mt-1">{answer.answer_text}</p>
                    </div>
                    {answer.feedback && (
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" /> Feedback
                        </p>
                        <p className="mt-1">{answer.feedback}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">{new Date(answer.created_at).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
