"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, X, Eye, EyeOff } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getXCons, createXCon, deleteXCon } from "@/lib/api-client"

interface XCon {
  id: string
  name: string
  email: string
  password: string
  assignedLeaders: number
  status: "active" | "inactive"
}

export default function XConsPage() {
  const [xcons, setXcons] = useState<XCon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    fetchXCons()
  }, [])

  const fetchXCons = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getXCons()
      const formattedData = data.map((xcon: any) => ({
        id: xcon.id,
        name: xcon.name,
        email: xcon.email,
        password: "", // Password not returned from API for security
        assignedLeaders: 0,
        status: "active",
      }))
      setXcons(formattedData)
    } catch (err) {
      setError("Failed to fetch X-CONs")
      console.error("[v0] Fetch X-CONs error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddXCon = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newXCon = await createXCon({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      const formattedXCon: XCon = {
        id: newXCon.id,
        name: newXCon.name,
        email: newXCon.email,
        password: "",
        assignedLeaders: 0,
        status: "active",
      }

      setXcons([...xcons, formattedXCon])
      setFormData({ name: "", email: "", password: "" })
      setShowAddModal(false)
    } catch (err) {
      setError("Failed to create X-CON")
      console.error("[v0] Create X-CON error:", err)
    }
  }

  const handleDeleteXCon = async (id: string) => {
    try {
      await deleteXCon(id)
      setXcons(xcons.filter((x) => x.id !== id))
    } catch (err) {
      setError("Failed to delete X-CON")
      console.error("[v0] Delete X-CON error:", err)
    }
  }

  return (
    <>
      <DashboardHeader title="X-CON Management" status="Configure" userRole="Super Admin" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">X-CON Coordinators</h2>
            <Button
              onClick={() => setShowAddModal(true)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              Add X-CON
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

          {/* X-CONs Table */}
          <Card className="border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading X-CONs...</div>
              ) : xcons.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No X-CONs found. Add one to get started.</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Leaders Assigned</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {xcons.map((xcon) => (
                      <tr key={xcon.id} className="border-b border-border hover:bg-secondary/50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-foreground">{xcon.name}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{xcon.email}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{xcon.assignedLeaders}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
                            {xcon.status}
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
                              onClick={() => handleDeleteXCon(xcon.id)}
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

      {/* Add X-CON Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="border-border bg-card w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Add X-CON Coordinator</CardTitle>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddXCon} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
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
                    placeholder="xcon@cyberdrill.com"
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
                    Add X-CON
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
