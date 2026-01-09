import { Trophy } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  attempts: number
  status: "completed" | "in-progress" | "pending"
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[]
  title?: string
}

export function LeaderboardCard({ entries, title = "Leaderboard" }: LeaderboardCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-6 py-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Rank</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Name</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-muted-foreground">Score</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-muted-foreground">Attempts</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.rank} className="border-b border-border hover:bg-secondary/50 transition">
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {entry.rank}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">{entry.name}</td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-foreground">{entry.score}</td>
                <td className="px-6 py-4 text-right text-sm text-muted-foreground">{entry.attempts}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      entry.status === "completed"
                        ? "bg-accent/20 text-accent"
                        : entry.status === "in-progress"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
