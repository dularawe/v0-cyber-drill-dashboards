"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type UserRole = "super-admin" | "xcon" | "leader"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const role = (searchParams.get("role") || "super-admin") as UserRole

  useEffect(() => {
    if (!searchParams.has("role")) {
      router.push("/")
    }
    const user = sessionStorage.getItem("currentUser")
    if (user) {
      try {
        const userData = JSON.parse(user)
        const routes = {
          "super-admin": "/super-admin",
          xcon: "/xcon",
          leader: "/leader",
        }
        router.push(routes[userData.role as UserRole])
      } catch (e) {
        sessionStorage.removeItem("currentUser")
      }
    }
  }, [searchParams, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!email || !password) {
      setError("Please enter email and password")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Invalid credentials")
      setLoading(false)
      return
    }

    const userData = {
      email,
      role,
      loginTime: new Date().toISOString(),
    }

    sessionStorage.setItem("currentUser", JSON.stringify(userData))

    const routes = {
      "super-admin": "/super-admin",
      xcon: "/xcon",
      leader: "/leader",
    }

    router.push(routes[role])
  }

  const getRoleDisplay = (r: UserRole) => {
    const displays = {
      "super-admin": "Super Admin",
      xcon: "X-CON Coordinator",
      leader: "Participant",
    }
    return displays[r]
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-lg">CD</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Cyber Drill</h1>
          <p className="text-muted-foreground">Enterprise Security Exercise Platform</p>
        </div>

        {/* Login Card */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Sign In as {getRoleDisplay(role)}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <LogIn className="h-4 w-4" />
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 space-y-2">
              <p className="font-semibold">Demo Credentials:</p>
              <div className="space-y-1">
                <p>Email: demo@cyberdrill.com</p>
                <p>Password: Demo123</p>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <button onClick={() => router.push("/")} className="text-sm text-primary hover:underline">
                Back to Role Selection
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
