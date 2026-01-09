"use client"

import { X, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ReviewDrawerProps {
  isOpen: boolean
  onClose: () => void
  question: string
  submittedAnswer: string
  leaderName: string
  onApprove?: () => void
  onReject?: () => void
}

export function ReviewDrawer({
  isOpen,
  onClose,
  question,
  submittedAnswer,
  leaderName,
  onApprove,
  onReject,
}: ReviewDrawerProps) {
  const [isReviewed, setIsReviewed] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-card border-l border-border flex flex-col">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Review Answer</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Leader</p>
            <p className="text-foreground font-semibold">{leaderName}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Question</p>
            <p className="text-foreground">{question}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Submitted Answer</p>
            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
              <p className="text-foreground">{submittedAnswer}</p>
            </div>
          </div>
        </div>

        {!isReviewed && (
          <div className="border-t border-border px-6 py-4 flex gap-3">
            <Button
              onClick={() => {
                setIsReviewed(true)
                onReject?.()
              }}
              variant="outline"
              className="flex-1 gap-2"
            >
              <XCircle className="h-4 w-4" />
              Incorrect
            </Button>
            <Button
              onClick={() => {
                setIsReviewed(true)
                onApprove?.()
              }}
              className="flex-1 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <CheckCircle className="h-4 w-4" />
              Correct
            </Button>
          </div>
        )}

        {isReviewed && (
          <div className="border-t border-border px-6 py-4">
            <p className="text-center text-sm text-muted-foreground">Answer reviewed</p>
          </div>
        )}
      </div>
    </div>
  )
}
