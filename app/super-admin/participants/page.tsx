"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, X, Eye, EyeOff, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, FileText } from "lucide-react"
import { getLeaders, createLeader, deleteLeader, getXCons } from "@/lib/api-client"

interface Participant {
  id: string
  name: string
  email: string
  password: string
  team: string
  xconAssigned: string
  xconName?: string
  status: "active" | "inactive"
}

interface XConOption {
  id: string
  name: string
  email: string
}

interface Alert {
  type: "success" | "error" | "warning"
  message: string
  id: string
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [xconOptions, setXconOptions] = useState<XConOption[]>([])
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState<Alert[]>([])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    team: "",
    xconAssigned: "",
  })

  const addAlert = (type: "success" | "error" | "warning", message: string) => {
    const alertId = Date.now().toString()
    setAlerts((prev) => [...prev, { type, message, id: alertId }])
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId))
    }, 5000)
  }

  const getXConName = (xconId: string): string => {
    const xcon = xconOptions.find((x) => x.id === xconId)
    return xcon?.name || "Unassigned"
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch X-CONs first
      const xconsData = await getXCons()
      setXconOptions(xconsData)

      // Fetch leaders/participants
      const leadersData = await getLeaders()
      const formattedLeaders = leadersData.map((leader: any) => ({
        id: leader.id,
        name: leader.name,
        email: leader.email,
        password: "",
        team: "Team Default",
        xconAssigned: leader.xcon_id || "",
        xconName: xconsData.find((x: any) => x.id === leader.xcon_id)?.name || "Unassigned",
        status: "active",
      }))
      setParticipants(formattedLeaders)
      addAlert("success", "Participants loaded successfully")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch participants"
      addAlert("error", errorMessage)
      console.error("[v0] Fetch data error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      addAlert("warning", "Please fill in all required fields")
      return
    }

    if (!formData.xconAssigned) {
      addAlert("warning", "Please assign an X-CON coordinator")
      return
    }

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
        xconAssigned: formData.xconAssigned,
        xconName: getXConName(formData.xconAssigned),
        status: "active",
      }

      setParticipants([...participants, formattedParticipant])
      setFormData({ name: "", email: "", password: "", team: "", xconAssigned: "" })
      setShowAddModal(false)
      addAlert("success", `Participant "${formData.name}" created successfully`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create participant"
      addAlert("error", errorMessage)
      console.error("[v0] Create participant error:", err)
    }
  }

  const handleDeleteParticipant = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      await deleteLeader(id)
      setParticipants(participants.filter((p) => p.id !== id))
      addAlert("success", `Participant "${name}" deleted successfully`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete participant"
      addAlert("error", errorMessage)
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
      {/* Removed DashboardSidebar component wrapper - layout.tsx handles it */}
      <>
        <DashboardHeader title="Participant Management" status="Configure" userRole="Super Admin" />

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {alerts.length > 0 && (
              <div className="space-y-3 fixed top-4 right-4 z-50 max-w-md">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm transition-all ${
                      alert.type === "success"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : alert.type === "error"
                          ? "bg-red-50 border-red-200 text-red-800"
                          : "bg-yellow-50 border-yellow-200 text-yellow-800"
                    }`}
                  >
                    {alert.type === "success" ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                    ) : alert.type === "error" ? (
                      <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                    )}
                    <p className="text-sm font-medium">{alert.message}</p>
                  </div>
                ))}
              </div>
            )}

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
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">X-CON Coordinator</th>
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
                          <td className="px-6 py-4 text-sm text-foreground font-medium">{participant.xconName}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
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
                                className="gap-2 text-destructive hover:text-destructive bg-transparent hover:bg-red-50"
                                onClick={() => handleDeleteParticipant(participant.id, participant.name)}
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
                    <label className="text-sm font-medium text-foreground">Full Name *</label>
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
                    <label className="text-sm font-medium text-foreground">Email *</label>
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
                    <label className="text-sm font-medium text-foreground">Password *</label>
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
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Assign X-CON Coordinator *</label>
                    <select
                      value={formData.xconAssigned}
                      onChange={(e) => setFormData({ ...formData, xconAssigned: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">-- Select X-CON --</option>
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
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      Create Participant
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </>
    </div>
  )
}
