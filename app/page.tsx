"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Shield, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const user = sessionStorage.getItem("currentUser")
    if (user) {
      try {
        const userData = JSON.parse(user)
        const routes = {
          "super-admin": "/super-admin",
          xcon: "/xcon",
          leader: "/leader",
        }
        router.push(routes[userData.role])
      } catch (e) {
        sessionStorage.removeItem("currentUser")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Cyber Drill</h1>
          </div>
          <p className="text-sm text-muted-foreground">Enterprise Security Exercise Platform</p>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Security Drill Management System</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Coordinated cybersecurity exercises with real-time monitoring, answer review workflows, and comprehensive
            leaderboards for enterprise teams
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* SuperAdmin Dashboard */}
          <Card className="border-border bg-card hover:bg-secondary/50 transition group cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-6 w-6 text-primary" />
                <CardTitle>Master Control</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For Super Administrators: Configure drills, start/pause sessions, broadcast instructions, and monitor
                all participants and coordinators
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Drill configuration & setup</li>
                <li>✓ Session controls (start/pause/end)</li>
                <li>✓ Real-time countdown broadcasts</li>
                <li>✓ X-CON team management</li>
                <li>✓ Global leaderboard monitoring</li>
              </ul>
              <Link href="/login" className="inline-block w-full mt-4">
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground group-hover:translate-x-1 transition">
                  Enter as Super Admin
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* X-CON Dashboard */}
          <Card className="border-border bg-card hover:bg-secondary/50 transition group cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>Review Center</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For X-CON Coordinators: Review answers from assigned leaders, approve/reject submissions, and track
                completion status
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Pending review queue</li>
                <li>✓ Answer approval workflow</li>
                <li>✓ Leader assignment view</li>
                <li>✓ Progress tracking</li>
                <li>✓ Review history</li>
              </ul>
              <Link href="/login" className="inline-block w-full mt-4">
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground group-hover:translate-x-1 transition">
                  Enter as X-CON
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Leader Dashboard */}
          <Card className="border-border bg-card hover:bg-secondary/50 transition group cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle>Drill Interface</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For Participants: Receive questions in real-time, submit answers, track attempts, and compete on the
                leaderboard
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Real-time question delivery</li>
                <li>✓ Live countdown timer</li>
                <li>✓ Answer submission & tracking</li>
                <li>✓ Attempt management</li>
                <li>✓ Live leaderboard</li>
              </ul>
              <Link href="/login" className="inline-block w-full mt-4">
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground group-hover:translate-x-1 transition">
                  Enter as Participant
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Real-time Collaboration</h4>
                <p className="text-sm text-muted-foreground">
                  Synchronized countdown timers, live scoring, and instant updates across all participants and
                  administrators
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Comprehensive Monitoring</h4>
                <p className="text-sm text-muted-foreground">
                  Track all drill activities with real-time metrics, leaderboards, and detailed performance analytics
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Efficient Review Workflow</h4>
                <p className="text-sm text-muted-foreground">
                  Streamlined answer review process with approve/reject functionality and automatic question progression
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Enterprise-Grade Design</h4>
                <p className="text-sm text-muted-foreground">
                  Minimal, professional interface with light theme optimized for long drill sessions and intensive
                  monitoring
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>Cyber Drill Platform © 2025. Enterprise Security Exercise Management System.</p>
        </div>
      </footer>
    </main>
  )
}
