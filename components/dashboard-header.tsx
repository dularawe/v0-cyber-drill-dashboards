"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  title: string
  status?: string
  userRole?: string
}

export function DashboardHeader({ title, status, userRole }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSignOut = () => {
    sessionStorage.removeItem("currentUser")
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src="https://www.cert.gov.lk/wp-content/uploads/2024/11/logo-b-1.png"
            alt="Government Logo"
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {status && (
            <span
              className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                status === "Active"
                  ? "bg-green-100 text-green-700"
                  : status === "Waiting"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-secondary text-secondary-foreground"
              }`}
            >
              {status}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {userRole && <span className="text-sm text-muted-foreground">{userRole}</span>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition">
                <Settings className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
