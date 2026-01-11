export type UserRole = "super_admin" | "xcon" | "leader"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  question_text: string
  category?: string
  difficulty: "easy" | "medium" | "hard"
  time_limit_seconds: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface XCon {
  id: string
  user_id: string
  team_name?: string
  created_at: string
  updated_at: string
}

export interface Leader {
  id: string
  user_id: string
  xcon_id: string
  team_name?: string
  created_at: string
  updated_at: string
}

export interface DrillSession {
  id: string
  name: string
  description?: string
  status: "draft" | "running" | "paused" | "completed"
  created_by: string
  started_at?: string
  ended_at?: string
  created_at: string
  updated_at: string
}

export interface Answer {
  id: string
  question_id: string
  leader_id: string
  session_id: string
  answer_text: string
  attempt_number: number
  status: "submitted" | "reviewed" | "approved" | "rejected"
  reviewed_by?: string
  feedback?: string
  submitted_at: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

export interface LeaderboardEntry {
  id: string
  session_id: string
  leader_id: string
  total_questions: number
  answered_questions: number
  approved_answers: number
  score: number
  rank?: number
  created_at: string
  updated_at: string
}

export interface AuthSession {
  user: User | null
  isLoading: boolean
  isSignedIn: boolean
}
