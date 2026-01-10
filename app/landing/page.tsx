"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getDrillSessions } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Session {
  id: string
  name: string
  status: string
  start_time: string
  end_time: string
}

export default function LandingPage() {
  const router = useRouter()
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [timeUntilStart, setTimeUntilStart] = useState(0)
  const [loading, setLoading] = useState(true)
  const [drillStarted, setDrillStarted] = useState(false)

  useEffect(() => {
    fetchUpcomingDrill()
    const pollInterval = setInterval(fetchUpcomingDrill, 2000)
    return () => clearInterval(pollInterval)
  }, [])

  const fetchUpcomingDrill = async () => {
    try {
      const sessions = await getDrillSessions()

      const liveDrill = sessions.find((s: any) => s.status === "live")
      if (liveDrill) {
        setCurrentSession(liveDrill)
        setDrillStarted(true)
        const userRole = sessionStorage.getItem("userRole") || "leader"
        const dashboardRoute = userRole === "xcon" ? "/xcon" : userRole === "super-admin" ? "/super-admin" : "/leader"
        setTimeout(() => router.push(dashboardRoute), 500)
        return
      }

      const upcoming = sessions.find((s: any) => s.status === "scheduled" || s.status === "draft")
      if (upcoming) {
        setCurrentSession(upcoming)
        calculateCountdown(upcoming.start_time)
      }
    } catch (error) {
      console.error("[v0] Error fetching drill:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateCountdown = (startTime: string) => {
    const start = new Date(startTime).getTime()
    const now = new Date().getTime()
    const remaining = Math.max(0, Math.floor((start - now) / 1000))
    setTimeUntilStart(remaining)
  }

  useEffect(() => {
    if (!currentSession || drillStarted) return

    const timer = setInterval(() => {
      calculateCountdown(currentSession.start_time)
    }, 1000)

    return () => clearInterval(timer)
  }, [currentSession, drillStarted])

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (days > 0) return `${days}d ${hours}h ${mins}m`
    if (hours > 0) return `${hours}h ${mins}m ${secs}s`
    if (mins > 0) return `${mins}m ${secs}s`
    return `${secs}s`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#db281f] to-[#a01d17]">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Loading drill information...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#db281f] to-[#a01d17]">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No upcoming drills scheduled.</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#db281f] to-[#a01d17] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <Image
              src="https://www.cert.gov.lk/wp-content/uploads/2024/11/logo-b-1.png"
              alt="CERT Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-foreground">{currentSession.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Cyber Security Drill Exercise</p>
          </div>
        </CardHeader>

        <CardContent className="text-center space-y-8">
          <div className="space-y-4">
            <p className="text-lg font-semibold text-muted-foreground">
              {drillStarted ? "Drill Started - Redirecting..." : "Drill Starts In"}
            </p>
            <div className="text-7xl font-bold text-[#db281f] tracking-tight font-mono">
              {formatTime(timeUntilStart)}
            </div>
            <p className="text-sm text-muted-foreground">Prepare your team for the upcoming cyber security exercise</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#db281f]/10 p-6 rounded-lg border border-[#db281f]/30">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Start Time</p>
              <p className="font-mono text-sm font-semibold mt-2">
                {new Date(currentSession.start_time).toLocaleString()}
              </p>
            </div>
            <div className="bg-[#a01d17]/10 p-6 rounded-lg border border-[#a01d17]/30">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">End Time</p>
              <p className="font-mono text-sm font-semibold mt-2">
                {new Date(currentSession.end_time).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#db281f]/10 to-[#a01d17]/10 p-6 rounded-lg border-l-4 border-[#db281f]">
            <p className="text-sm font-medium text-foreground mb-2">
              Status: <span className="text-[#db281f] font-bold">{currentSession.status.toUpperCase()}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              ✓ This page will automatically redirect when the drill starts.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ✓ You will be directed to your appropriate dashboard based on your role.
            </p>
          </div>

          {timeUntilStart === 0 && !drillStarted && (
            <Button
              onClick={() => router.push("/leader")}
              className="w-full py-6 text-lg bg-[#db281f] hover:bg-[#a01d17]"
              size="lg"
            >
              Enter Drill Now
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
