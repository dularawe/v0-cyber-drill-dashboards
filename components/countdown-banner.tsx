"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Clock } from "lucide-react"

interface CountdownBannerProps {
  isActive: boolean
  secondsRemaining: number
  onComplete?: () => void
}

export function CountdownBanner({ isActive, secondsRemaining, onComplete }: CountdownBannerProps) {
  const [displayTime, setDisplayTime] = useState<string>("")

  useEffect(() => {
    if (!isActive) {
      setDisplayTime("--:--")
      return
    }

    const minutes = Math.floor(secondsRemaining / 60)
    const seconds = secondsRemaining % 60
    setDisplayTime(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`)

    if (secondsRemaining === 0 && onComplete) {
      onComplete()
    }
  }, [secondsRemaining, isActive, onComplete])

  if (!isActive) return null

  const isWarning = secondsRemaining < 60
  const isCritical = secondsRemaining < 30

  return (
    <div
      className={cn(
        "w-full py-3 px-6 flex items-center justify-center gap-3 font-mono text-lg font-semibold",
        isCritical && "bg-destructive/20 text-destructive",
        isWarning && !isCritical && "bg-primary/20 text-primary",
        !isWarning && "bg-accent/20 text-accent",
      )}
    >
      <Clock className="h-5 w-5" />
      <span>Time Remaining: {displayTime}</span>
      {isCritical && <AlertCircle className="h-5 w-5 ml-auto" />}
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
