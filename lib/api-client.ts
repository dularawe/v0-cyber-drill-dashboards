const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Auth functions
export async function signInUser(email: string, password: string, role: string) {
  const response = await fetch(`${API_BASE}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  })
  if (!response.ok) throw new Error("Sign in failed")
  return response.json()
}

export async function signUpUser(email: string, password: string, name: string, role: string) {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, role }),
  })
  if (!response.ok) throw new Error("Sign up failed")
  return response.json()
}

export async function signOutUser(session: string) {
  const response = await fetch(`${API_BASE}/auth/signout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session}` },
  })
  if (!response.ok) throw new Error("Sign out failed")
  return response.json()
}

// Questions
export async function getQuestions() {
  const response = await fetch(`${API_BASE}/questions`)
  if (!response.ok) throw new Error("Failed to fetch questions")
  return response.json()
}

export async function createQuestion(question: any) {
  const response = await fetch(`${API_BASE}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  })
  if (!response.ok) throw new Error("Failed to create question")
  return response.json()
}

export async function updateQuestion(id: string, updates: any) {
  const response = await fetch(`${API_BASE}/questions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
  if (!response.ok) throw new Error("Failed to update question")
  return response.json()
}

export async function deleteQuestion(id: string) {
  const response = await fetch(`${API_BASE}/questions/${id}`, { method: "DELETE" })
  if (!response.ok) throw new Error("Failed to delete question")
  return response.json()
}

// Leaders
export async function getLeaders() {
  const response = await fetch(`${API_BASE}/leaders`)
  if (!response.ok) throw new Error("Failed to fetch leaders")
  return response.json()
}

export async function createLeader(leader: any) {
  const response = await fetch(`${API_BASE}/leaders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leader),
  })
  if (!response.ok) throw new Error("Failed to create leader")
  return response.json()
}

export async function updateLeader(id: string, updates: any) {
  const response = await fetch(`${API_BASE}/leaders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
  if (!response.ok) throw new Error("Failed to update leader")
  return response.json()
}

export async function deleteLeader(id: string) {
  const response = await fetch(`${API_BASE}/leaders/${id}`, { method: "DELETE" })
  if (!response.ok) throw new Error("Failed to delete leader")
  return response.json()
}

// X-CONs
export async function getXCons() {
  const response = await fetch(`${API_BASE}/xcons`)
  if (!response.ok) throw new Error("Failed to fetch X-CONs")
  return response.json()
}

export async function createXCon(xcon: any) {
  const response = await fetch(`${API_BASE}/xcons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(xcon),
  })
  if (!response.ok) throw new Error("Failed to create X-CON")
  return response.json()
}

export async function updateXCon(id: string, updates: any) {
  const response = await fetch(`${API_BASE}/xcons/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
  if (!response.ok) throw new Error("Failed to update X-CON")
  return response.json()
}

export async function deleteXCon(id: string) {
  const response = await fetch(`${API_BASE}/xcons/${id}`, { method: "DELETE" })
  if (!response.ok) throw new Error("Failed to delete X-CON")
  return response.json()
}

// Drill Sessions
export async function getDrillSessions() {
  const response = await fetch(`${API_BASE}/sessions`)
  if (!response.ok) throw new Error("Failed to fetch sessions")
  return response.json()
}

export async function createDrillSession(session: any) {
  const response = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  })
  if (!response.ok) throw new Error("Failed to create session")
  return response.json()
}

export async function updateDrillSession(id: string, updates: any) {
  const response = await fetch(`${API_BASE}/sessions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
  if (!response.ok) throw new Error("Failed to update session")
  return response.json()
}

export async function deleteDrillSession(id: string) {
  const response = await fetch(`${API_BASE}/sessions/${id}`, { method: "DELETE" })
  if (!response.ok) throw new Error("Failed to delete session")
  return response.json()
}

// Answers
export async function getAnswers() {
  const response = await fetch(`${API_BASE}/answers`)
  if (!response.ok) throw new Error("Failed to fetch answers")
  return response.json()
}

export async function submitAnswer(answer: any) {
  const response = await fetch(`${API_BASE}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answer),
  })
  if (!response.ok) throw new Error("Failed to submit answer")
  return response.json()
}

export async function updateAnswer(id: string, updates: any) {
  const response = await fetch(`${API_BASE}/answers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
  if (!response.ok) throw new Error("Failed to update answer")
  return response.json()
}

export async function approveAnswer(id: string, feedback?: string) {
  const response = await fetch(`${API_BASE}/answers/${id}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feedback }),
  })
  if (!response.ok) throw new Error("Failed to approve answer")
  return response.json()
}

export async function rejectAnswer(id: string, feedback?: string) {
  const response = await fetch(`${API_BASE}/answers/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feedback }),
  })
  if (!response.ok) throw new Error("Failed to reject answer")
  return response.json()
}

export async function deleteAnswer(id: string) {
  const response = await fetch(`${API_BASE}/answers/${id}`, { method: "DELETE" })
  if (!response.ok) throw new Error("Failed to delete answer")
  return response.json()
}

// Leaderboard
export async function getLeaderboard(sessionId: string) {
  const response = await fetch(`${API_BASE}/leaderboard?sessionId=${sessionId}`)
  if (!response.ok) throw new Error("Failed to fetch leaderboard")
  return response.json()
}
