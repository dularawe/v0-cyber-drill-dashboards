"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Play, Pause, StopCircle, Trash2, Plus, X, AlertCircle, CheckCircle2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getDrillSessions,
  createDrillSession,
  updateDrillSession,
  deleteDrillSession,
  getQuestions,
} from "@/lib/api-client"

interface Drill {
  id: number
  name: string
  status: "draft" | "scheduled" | "live" | "completed"
  start_time: string
  end_time: string
  created_at: string
}

interface Question {
  id: number
  text: string
  category: string
  difficulty: string
  time_limit: number
}

export default function DrillManagementPage() {
  const router = useRouter()
  const [drills, setDrills] = useState<Drill[]>([])
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    selectedQuestions: [] as number[],
  })

  // Fetch drills and questions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drillsData, questionsData] = await Promise.all([getDrillSessions(), getQuestions()])
        setDrills(drillsData)
        setAllQuestions(questionsData)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
        setAlert({ type: "error", message: "Failed to load drills" })
      }
    }
    fetchData()

    const interval = setInterval(fetchData, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleCreateDrill = async () => {
    if (!formData.name.trim()) {
      setAlert({ type: "error", message: "Please enter a drill name" })
      return
    }
    if (!formData.startTime) {
      setAlert({ type: "error", message: "Please select a start time" })
      return
    }
    if (!formData.endTime) {
      setAlert({ type: "error", message: "Please select an end time" })
      return
    }
    if (formData.selectedQuestions.length === 0) {
      setAlert({ type: "error", message: "Please select at least one question" })
      return
    }

    setLoading(true)
    try {
      const drillData = {
        name: formData.name,
        start_time: formData.startTime,
        end_time: formData.endTime,
        questions: formData.selectedQuestions,
      }
      await createDrillSession(drillData)
      setAlert({ type: "success", message: "Drill created successfully!" })
      setFormData({ name: "", startTime: "", endTime: "", selectedQuestions: [] })
      setShowCreateForm(false)

      // Refresh drills list
      const updatedDrills = await getDrillSessions()
      setDrills(updatedDrills)
    } catch (error) {
      console.error("[v0] Error creating drill:", error)
      setAlert({ type: "error", message: "Failed to create drill" })
    } finally {
      setLoading(false)
    }
  }

  const handleStartDrill = async (drillId: number) => {
    try {
      await updateDrillSession(String(drillId), { status: "live" })
      setAlert({ type: "success", message: "Drill started successfully!" })
      setDrills(drills.map((d) => (d.id === drillId ? { ...d, status: "live" } : d)))
    } catch (error) {
      console.error("[v0] Error starting drill:", error)
      setAlert({ type: "error", message: "Failed to start drill" })
    }
  }

  const handlePauseDrill = async (drillId: number) => {
    try {
      await updateDrillSession(String(drillId), { status: "scheduled" })
      setAlert({ type: "success", message: "Drill paused successfully!" })
      setDrills(drills.map((d) => (d.id === drillId ? { ...d, status: "scheduled" } : d)))
    } catch (error) {
      console.error("[v0] Error pausing drill:", error)
      setAlert({ type: "error", message: "Failed to pause drill" })
    }
  }

  const handleEndDrill = async (drillId: number) => {
    try {
      await updateDrillSession(String(drillId), { status: "completed" })
      setAlert({ type: "success", message: "Drill ended successfully!" })
      setDrills(drills.map((d) => (d.id === drillId ? { ...d, status: "completed" } : d)))
    } catch (error) {
      console.error("[v0] Error ending drill:", error)
      setAlert({ type: "error", message: "Failed to end drill" })
    }
  }

  const handleDeleteDrill = async (drillId: number) => {
    if (!confirm("Are you sure you want to delete this drill?")) return

    try {
      await deleteDrillSession(String(drillId))
      setAlert({ type: "success", message: "Drill deleted successfully!" })
      setDrills(drills.filter((d) => d.id !== drillId))
    } catch (error) {
      console.error("[v0] Error deleting drill:", error)
      setAlert({ type: "error", message: "Failed to delete drill" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "live":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-neutral-100 text-neutral-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <DashboardHeader title="Drill Management" status="Active" userRole="Super Admin" />

      {alert && (
        <div
          className={`mx-4 mt-4 p-4 rounded-lg flex items-center gap-2 ${alert.type === "success" ? "bg-green-100 border-l-4 border-green-500 text-green-700" : "bg-red-100 border-l-4 border-red-500 text-red-700"}`}
        >
          {alert.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{alert.message}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-6">
          {/* Header with Create Button */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">All Drills</h1>
              <p className="text-muted-foreground mt-1">Manage and control cyber drill sessions</p>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              {showCreateForm ? "Cancel" : "Create New Drill"}
            </Button>
          </div>

          {/* Create Drill Form */}
          {showCreateForm && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Create New Drill</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Drill Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter drill name"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Start Time</label>
                    <input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">End Time</label>
                    <input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    Select Questions ({formData.selectedQuestions.length} selected)
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allQuestions.map((question) => (
                      <label
                        key={question.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedQuestions.includes(question.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                selectedQuestions: [...formData.selectedQuestions, question.id],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                selectedQuestions: formData.selectedQuestions.filter((id) => id !== question.id),
                              })
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{question.text}</p>
                          <p className="text-xs text-muted-foreground">
                            {question.category} • {question.difficulty}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => setShowCreateForm(false)}
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
              </CardContent>
            </Card>
          )}

          {/* Drills Table */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>All Drills ({drills.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {drills.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No drills created yet. Create one to get started.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Drill Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Start Time</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">End Time</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Created</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drills.map((drill) => (
                        <tr key={drill.id} className="border-b border-border hover:bg-secondary/30">
                          <td className="px-4 py-3 text-sm text-foreground font-medium">{drill.name}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(drill.status)}`}
                            >
                              {drill.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(drill.start_time).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(drill.end_time).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(drill.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-2 justify-end">
                              {drill.status === "draft" || drill.status === "scheduled" ? (
                                <Button
                                  onClick={() => handleStartDrill(drill.id)}
                                  size="sm"
                                  className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Play className="h-4 w-4" />
                                  Start
                                </Button>
                              ) : drill.status === "live" ? (
                                <>
                                  <Button
                                    onClick={() => handlePauseDrill(drill.id)}
                                    size="sm"
                                    className="gap-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                                  >
                                    <Pause className="h-4 w-4" />
                                    Pause
                                  </Button>
                                  <Button
                                    onClick={() => handleEndDrill(drill.id)}
                                    size="sm"
                                    className="gap-1 bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    <StopCircle className="h-4 w-4" />
                                    End
                                  </Button>
                                </>
                              ) : null}
                              <Button
                                onClick={() => handleDeleteDrill(drill.id)}
                                size="sm"
                                className="gap-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
