"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, Plus, X, AlertCircle, CheckCircle2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createDrillSession, getQuestions } from "@/lib/api-client"

interface Question {
  id: number
  text: string
  category: string
  difficulty: string
  time_limit: number
}

export default function CreateDrillPage() {
  const router = useRouter()
  const [drillName, setDrillName] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([])
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const sidebarItems = [
    {
      label: "Overview",
      href: "/super-admin",
      icon: <Clock className="h-5 w-5" />,
      active: false,
    },
    {
      label: "Create Drill",
      href: "/super-admin/create-drill",
      icon: <Plus className="h-5 w-5" />,
      active: true,
    },
  ]

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions = await getQuestions()
        setAllQuestions(questions)
      } catch (error) {
        console.error("[v0] Error fetching questions:", error)
        setAlert({ type: "error", message: "Failed to load questions" })
      }
    }
    fetchQuestions()
  }, [])

  const handleCreateDrill = async () => {
    if (!drillName.trim()) {
      setAlert({ type: "error", message: "Please enter a drill name" })
      return
    }
    if (!startTime) {
      setAlert({ type: "error", message: "Please select a start time" })
      return
    }
    if (!endTime) {
      setAlert({ type: "error", message: "Please select an end time" })
      return
    }
    if (selectedQuestions.length === 0) {
      setAlert({ type: "error", message: "Please select at least one question" })
      return
    }

    setLoading(true)
    try {
      const drillData = {
        name: drillName,
        start_time: startTime,
        end_time: endTime,
        questions: selectedQuestions,
      }
      const result = await createDrillSession(drillData)
      setAlert({ type: "success", message: "Drill created successfully!" })
      setTimeout(() => {
        router.push("/super-admin")
      }, 1500)
    } catch (error) {
      console.error("[v0] Error creating drill:", error)
      setAlert({ type: "error", message: "Failed to create drill" })
    } finally {
      setLoading(false)
    }
  }

  const toggleQuestion = (questionId: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Create New Drill" status="Preparation" userRole="Super Admin" />

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
            {/* Drill Configuration */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Drill Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Drill Name</label>
                  <input
                    type="text"
                    value={drillName}
                    onChange={(e) => setDrillName(e.target.value)}
                    placeholder="Enter drill name (e.g., Q1 2026 Cyber Security Assessment)"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Start Time</label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">End Time</label>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Select Questions */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Select Questions ({selectedQuestions.length} selected)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allQuestions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No questions available. Please create questions first.
                    </p>
                  ) : (
                    allQuestions.map((question) => (
                      <div
                        key={question.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedQuestions.includes(question.id)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => toggleQuestion(question.id)}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.includes(question.id)}
                            onChange={() => {}}
                            className="mt-1 w-5 h-5 cursor-pointer"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{question.text}</p>
                            <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
                              <span className="px-2 py-1 bg-secondary rounded-full">{question.category}</span>
                              <span className="px-2 py-1 bg-secondary rounded-full capitalize">
                                {question.difficulty}
                              </span>
                              <span className="px-2 py-1 bg-secondary rounded-full">{question.time_limit}s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => router.back()}
                className="gap-2 bg-secondary hover:bg-secondary/80 text-foreground"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleCreateDrill}
                disabled={loading}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
                {loading ? "Creating..." : "Create Drill"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
