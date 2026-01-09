"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit2, Trash2, X } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Users, Clock, FileText } from "lucide-react"

interface Question {
  id: string
  text: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  timeLimit: number
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "What is a common phishing indicator?",
      category: "Security Awareness",
      difficulty: "easy",
      timeLimit: 180,
    },
    {
      id: "2",
      text: "How do you verify the authenticity of an email sender?",
      category: "Email Security",
      difficulty: "medium",
      timeLimit: 240,
    },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [formData, setFormData] = useState({
    text: "",
    category: "Security Awareness",
    difficulty: "easy" as const,
    timeLimit: 180,
  })

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    const newQuestion: Question = {
      id: Date.now().toString(),
      ...formData,
    }
    setQuestions([...questions, newQuestion])
    setFormData({
      text: "",
      category: "Security Awareness",
      difficulty: "easy",
      timeLimit: 180,
    })
    setShowAddModal(false)
  }

  const handleEditQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedQuestion) {
      setQuestions(questions.map((q) => (q.id === selectedQuestion.id ? { id: selectedQuestion.id, ...formData } : q)))
      setShowEditModal(false)
      setSelectedQuestion(null)
    }
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const openEditModal = (question: Question) => {
    setSelectedQuestion(question)
    setFormData({
      text: question.text,
      category: question.category,
      difficulty: question.difficulty,
      timeLimit: question.timeLimit,
    })
    setShowEditModal(true)
  }

  const sidebarItems = [
    { label: "Overview", href: "/super-admin", icon: <FileText className="h-5 w-5" />, active: false },
    { label: "Questions", href: "/super-admin/questions", icon: <CheckCircle2 className="h-5 w-5" />, active: true },
    { label: "X-CONs", href: "/super-admin/xcons", icon: <Users className="h-5 w-5" />, active: false },
    { label: "Participants", href: "/super-admin/participants", icon: <Users className="h-5 w-5" />, active: false },
    { label: "Reports", href: "/super-admin/reports", icon: <Clock className="h-5 w-5" />, active: false },
  ]

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Questions Management" status="Configure" userRole="Super Admin" />

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Questions Bank</h2>
              <Button
                onClick={() => setShowAddModal(true)}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Total Questions</div>
                  <div className="text-2xl font-bold text-foreground mt-1">{questions.length}</div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Easy</div>
                  <div className="text-2xl font-bold text-green-500 mt-1">
                    {questions.filter((q) => q.difficulty === "easy").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Medium</div>
                  <div className="text-2xl font-bold text-yellow-500 mt-1">
                    {questions.filter((q) => q.difficulty === "medium").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Hard</div>
                  <div className="text-2xl font-bold text-red-500 mt-1">
                    {questions.filter((q) => q.difficulty === "hard").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((question) => (
                <Card key={question.id} className="border-border bg-card hover:bg-secondary/50 transition">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-base font-semibold text-foreground">{question.text}</h3>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              question.difficulty === "easy"
                                ? "bg-green-500/20 text-green-500"
                                : question.difficulty === "medium"
                                  ? "bg-yellow-500/20 text-yellow-500"
                                  : "bg-red-500/20 text-red-500"
                            }`}
                          >
                            {question.difficulty}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-muted-foreground">
                            <strong>Category:</strong> {question.category}
                          </p>
                          <p className="text-muted-foreground">
                            <strong>Time Limit:</strong> {question.timeLimit} seconds
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => openEditModal(question)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-destructive hover:text-destructive bg-transparent"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="border-border bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 sticky top-0 bg-card">
              <CardTitle>Add New Question</CardTitle>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Question Text</label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    placeholder="Enter the question..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Security Awareness"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          difficulty: e.target.value as "easy" | "medium" | "hard",
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Time Limit (seconds)</label>
                    <input
                      type="number"
                      min="30"
                      max="600"
                      value={formData.timeLimit}
                      onChange={(e) => setFormData({ ...formData, timeLimit: Number.parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    Create Question
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Question Modal */}
      {showEditModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="border-border bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 sticky top-0 bg-card">
              <CardTitle>Edit Question</CardTitle>
              <button onClick={() => setShowEditModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditQuestion} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Question Text</label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    placeholder="Enter the question..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Security Awareness"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          difficulty: e.target.value as "easy" | "medium" | "hard",
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Time Limit (seconds)</label>
                    <input
                      type="number"
                      min="30"
                      max="600"
                      value={formData.timeLimit}
                      onChange={(e) => setFormData({ ...formData, timeLimit: Number.parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
