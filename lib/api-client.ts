import { createClient } from "@/lib/supabase/client"
import type { Question, Answer, DrillSession, Leader, XCon } from "@/lib/types"

const supabase = createClient()

// Questions API
export async function getQuestions() {
  const { data, error } = await supabase.from("questions").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data as Question[]
}

export async function createQuestion(question: Omit<Question, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("questions").insert([question]).select().single()
  if (error) throw error
  return data as Question
}

export async function updateQuestion(id: string, updates: Partial<Question>) {
  const { data, error } = await supabase.from("questions").update(updates).eq("id", id).select().single()
  if (error) throw error
  return data as Question
}

export async function deleteQuestion(id: string) {
  const { error } = await supabase.from("questions").delete().eq("id", id)
  if (error) throw error
}

// Leaders API
export async function getLeaders() {
  const { data, error } = await supabase.from("leaders").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data as Leader[]
}

export async function createLeader(leader: Omit<Leader, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("leaders").insert([leader]).select().single()
  if (error) throw error
  return data as Leader
}

export async function updateLeader(id: string, updates: Partial<Leader>) {
  const { data, error } = await supabase.from("leaders").update(updates).eq("id", id).select().single()
  if (error) throw error
  return data as Leader
}

// X-CONs API
export async function getXCons() {
  const { data, error } = await supabase.from("xcons").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data as XCon[]
}

export async function createXCon(xcon: Omit<XCon, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("xcons").insert([xcon]).select().single()
  if (error) throw error
  return data as XCon
}

// Drill Sessions API
export async function getDrillSessions() {
  const { data, error } = await supabase.from("drill_sessions").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data as DrillSession[]
}

export async function createDrillSession(session: Omit<DrillSession, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("drill_sessions").insert([session]).select().single()
  if (error) throw error
  return data as DrillSession
}

export async function updateDrillSession(id: string, updates: Partial<DrillSession>) {
  const { data, error } = await supabase.from("drill_sessions").update(updates).eq("id", id).select().single()
  if (error) throw error
  return data as DrillSession
}

// Answers API
export async function submitAnswer(
  answer: Omit<Answer, "id" | "created_at" | "updated_at" | "reviewed_at" | "reviewed_by" | "feedback">,
) {
  const { data, error } = await supabase.from("answers").insert([answer]).select().single()
  if (error) throw error
  return data as Answer
}

export async function getAnswersByLeader(leaderId: string, sessionId?: string) {
  let query = supabase.from("answers").select("*").eq("leader_id", leaderId)

  if (sessionId) {
    query = query.eq("session_id", sessionId)
  }

  const { data, error } = await query.order("created_at", { ascending: false })
  if (error) throw error
  return data as Answer[]
}

export async function approveAnswer(id: string, feedback?: string) {
  const { data, error } = await supabase
    .from("answers")
    .update({
      status: "approved",
      feedback,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as Answer
}

export async function rejectAnswer(id: string, feedback?: string) {
  const { data, error } = await supabase
    .from("answers")
    .update({
      status: "rejected",
      feedback,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as Answer
}

// Leaderboard API
export async function getLeaderboard(sessionId: string) {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .eq("session_id", sessionId)
    .order("rank", { ascending: true })
  if (error) throw error
  return data
}
