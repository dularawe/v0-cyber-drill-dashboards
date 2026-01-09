"use client"

import { Suspense } from "react"
import LoginForm from "./login-form"

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}

function LoginPageSkeleton() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 animate-pulse">
        <div className="h-12 w-12 bg-secondary rounded-lg mx-auto" />
        <div className="h-8 bg-secondary rounded mx-auto w-48" />
        <div className="h-64 bg-secondary rounded-lg" />
      </div>
    </main>
  )
}
