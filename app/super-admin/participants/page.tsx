"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, X, Eye, EyeOff } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Users, Clock, FileText } from "lucide-react"
import { getLeaders, createLeader, deleteLeader, getXCons } from "@/lib/api-client"

interface Participant {
  id: string
  name: string
  email: string
  password: string
  team: string
  xconAssigned: string
  status: "active" | "inactive"
}

interface XConOption {
  id: string
  name: string
  email: string
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [xconOptions, setXconOptions] = useState<XConOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    team: "",
    xconAssigned: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch leaders/participants
      const leadersData = await getLeaders()
      const formattedLeaders = leadersData.map((leader: any) => ({
        id: leader.id,
        name: leader.name,
        email: leader.email,
        password: "",
        team: "Team Default",
        xconAssigned: leader.xcon_id || "Unassigned",
        status: "active",
      }))
      setParticipants(formattedLeaders)

      const xconsData = await getXCons()
      setXconOptions(xconsData)
    } catch (err) {
      setError("Failed to fetch data")
      console.error("[v0] Fetch data error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newLeader = await createLeader({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        xcon_id: formData.xconAssigned,
      })

      const formattedParticipant: Participant = {
        id: newLeader.id,
        name: newLeader.name,
        email: newLeader.email,
        password: "",
        team: formData.team,
        xconAssigned: formData.xconAssigned || "Unassigned",
        status: "active",
      }

      setParticipants([...participants, formattedParticipant])
      setFormData({ name: "", email: "", password: "", team: "", xconAssigned: "" })
      setShowAddModal(false)
    } catch (err) {
      setError("Failed to create participant")
      console.error("[v0] Create participant error:", err)
    }
  }

  const handleDeleteParticipant = async (id: string) => {
    try {
      await deleteLeader(id)
      setParticipants(participants.filter((p) => p.id !== id))
    } catch (err) {
      setError("Failed to delete participant")
      console.error("[v0] Delete participant error:", err)
    }
  }

  const sidebarItems = [
    { label: "Overview", href: "/super-admin", icon: <FileText className="h-5 w-5" />, active: false },
    { label: "Questions", href: "/super-admin/questions", icon: <CheckCircle2 className="h-5 w-5" />, active: false },
    { label: "X-CONs", href: "/super-admin/xcons", icon: <Users className="h-5 w-5" />, active: false },
    { label: "Participants", href: "/super-admin/participants", icon: <Users className="h-5 w-5" />, active: true },
    { label: "Reports", href: "/super-admin/reports", icon: <Clock className="h-5 w-5" />, active: false },
  ]

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar items={sidebarItems} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Participant Management" status="Configure" userRole="Super Admin" />

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Participants (Leaders)</h2>
              <Button
                onClick={() => setShowAddModal(true)}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
                Add Participant
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <Card className="border-destructive bg-destructive/10">
                <CardContent className="pt-6">
                  <p className="text-sm text-destructive">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Participants Table */}
            <Card className="border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading participants...</div>
                ) : participants.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No participants found. Add one to get started.
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Team</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">X-CON</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((participant) => (
                        <tr key={participant.id} className="border-b border-border hover:bg-secondary/50 transition">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">{participant.name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{participant.email}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{participant.team}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{participant.xconAssigned}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
                              {participant.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 text-destructive hover:text-destructive bg-transparent"
                                onClick={() => handleDeleteParticipant(participant.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Add Participant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="border-border bg-card w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Add Participant</CardTitle>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddParticipant} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jane Smith"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="leader@company.com"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter secure password"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Team</label>
                  <input
                    type="text"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    placeholder="e.g. Team Alpha"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Assign X-CON</label>
                  <select
                    value={formData.xconAssigned}
                    onChange={(e) => setFormData({ ...formData, xconAssigned: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select X-CON Coordinator</option>
                    {xconOptions.map((xcon) => (
                      <option key={xcon.id} value={xcon.id}>
                        {xcon.name} ({xcon.email})
                      </option>
                    ))}
                  </select>
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
                    Add Participant
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
