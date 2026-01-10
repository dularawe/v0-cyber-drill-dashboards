"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getDrillSessions } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

  useEffect(() => {
    fetchUpcomingDrill()
  }, [])

  const fetchUpcomingDrill = async () => {
    try {
      const sessions = await getDrillSessions()
      const upcoming = sessions.find((s: any) => s.status === "scheduled" || s.status === "live")
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

    if (remaining <= 0) {
      router.push("/leader")
    }
  }

  useEffect(() => {
    if (!currentSession) return

    const timer = setInterval(() => {
      calculateCountdown(currentSession.start_time)
    }, 1000)

    return () => clearInterval(timer)
  }, [currentSession])

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No upcoming drills scheduled.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">{currentSession.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-8">
          <div>
            <p className="text-muted-foreground mb-4">Drill starts in</p>
            <div className="text-6xl font-bold text-primary">{formatTime(timeUntilStart)}</div>
          </div>

          <div className="bg-secondary/50 p-6 rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">Start Time</p>
            <p className="font-semibold">{new Date(currentSession.start_time).toLocaleString()}</p>
          </div>

          <div className="bg-secondary/50 p-6 rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">End Time</p>
            <p className="font-semibold">{new Date(currentSession.end_time).toLocaleString()}</p>
          </div>

          {timeUntilStart === 0 && (
            <Button onClick={() => router.push("/leader")} className="w-full" size="lg">
              Start Drill Now
            </Button>
          )}

          <p className="text-xs text-muted-foreground">This page will automatically redirect when the drill starts.</p>
        </CardContent>
      </Card>
    </div>
  )
}
