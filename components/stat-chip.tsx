import type { ReactNode } from "react"

interface StatChipProps {
  label: string
  value: string | number
  icon?: ReactNode
  variant?: "default" | "success" | "warning" | "destructive"
}

export function StatChip({ label, value, icon, variant = "default" }: StatChipProps) {
  const variantClasses = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-accent/20 text-accent",
    warning: "bg-primary/20 text-primary",
    destructive: "bg-destructive/20 text-destructive",
  }

  return (
    <div className={`rounded-lg p-4 ${variantClasses[variant]}`}>
      <div className="flex items-center gap-2">
        {icon && <span className="h-5 w-5">{icon}</span>}
        <span className="text-sm font-medium opacity-75">{label}</span>
      </div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  )
}
