const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      window.location.href = "/login"
    }
  }

  if (!response.ok) {
    console.error(`[v0] API Error: ${response.status} ${response.statusText} at ${url}`)
  }

  return response
}

// Auth functions
export async function signInUser(email: string, password: string, role: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/auth/signin`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) throw new Error("Sign in failed")
    const data = await response.json()
    if (typeof window !== "undefined" && data.token) {
      localStorage.setItem("auth_token", data.token)
    }
    return data
  } catch (error) {
    console.error("[v0] Sign in error:", error)
    throw error
  }
}

export async function signUpUser(email: string, password: string, name: string, role: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/auth/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password, name, role }),
    })
    if (!response.ok) throw new Error("Sign up failed")
    const data = await response.json()
    if (typeof window !== "undefined" && data.token) {
      localStorage.setItem("auth_token", data.token)
    }
    return data
  } catch (error) {
    console.error("[v0] Sign up error:", error)
    throw error
  }
}

export async function signOutUser() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
    const response = await fetchWithAuth(`${API_BASE}/auth/signout`, {
      method: "POST",
    })
    if (!response.ok) throw new Error("Sign out failed")
    return response.json()
  } catch (error) {
    console.error("[v0] Sign out error:", error)
    throw error
  }
}

// Questions
export async function getQuestions() {
  try {
    const response = await fetchWithAuth(`${API_BASE}/questions`)
    if (!response.ok) throw new Error("Failed to fetch questions")
    return response.json()
  } catch (error) {
    console.error("[v0] Get questions error:", error)
    throw error
  }
}

export async function createQuestion(question: any) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(question),
    })
    if (!response.ok) throw new Error("Failed to create question")
    return response.json()
  } catch (error) {
    console.error("[v0] Create question error:", error)
    throw error
  }
}

export async function updateQuestion(id: string, updates: any) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update question")
    return response.json()
  } catch (error) {
    console.error("[v0] Update question error:", error)
    throw error
  }
}

export async function deleteQuestion(id: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/questions/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Failed to delete question")
    return response.json()
  } catch (error) {
    console.error("[v0] Delete question error:", error)
    throw error
  }
}

// Leaders
export async function getLeaders() {
  try {
    const response = await fetchWithAuth(`${API_BASE}/leaders`)
    if (!response.ok) throw new Error("Failed to fetch leaders")
    return response.json()
  } catch (error) {
    console.error("[v0] Get leaders error:", error)
    throw error
  }
}

export async function createLeader(leader: any) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/leaders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leader),
    })
    if (!response.ok) throw new Error("Failed to create leader")
    return response.json()
  } catch (error) {
    console.error("[v0] Create leader error:", error)
    throw error
  }
}

export async function updateLeader(id: string, updates: any) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/leaders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update leader")
    return response.json()
  } catch (error) {
    console.error("[v0] Update leader error:", error)
    throw error
  }
}

export async function deleteLeader(id: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/leaders/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Failed to delete leader")
    return response.json()
  } catch (error) {
    console.error("[v0] Delete leader error:", error)
    throw error
  }
}

// X-CONs
export async function getXCons() {
  try {
    const response = await fetchWithAuth(`${API_BASE}/xcons`)
    if (!response.ok) throw new Error("Failed to fetch X-CONs")
    return response.json()
  } catch (error) {
    console.error("[v0] Get X-CONs error:", error)
    throw error
  }
}

export async function createXCon(xcon: any) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/xcons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(xcon),
    })
    if (!response.ok) throw new Error("Failed to create X-CON")
    return response.json()
  } catch (error) {
    console.error("[v0] Create X-CON error:", error)
    throw error
  }
}

export async function updateXCon(id: string, updates: any) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/xcons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update X-CON")
    return response.json()
  } catch (error) {
    console.error("[v0] Update X-CON error:", error)
    throw error
  }
}

export async function deleteXCon(id: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/xcons/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Failed to delete X-CON")
    return response.json()
  } catch (error) {
    console.error("[v0] Delete X-CON error:", error)
    throw error
  }
}

// Drill Sessions
export async function getDrillSessions() {
  try {
    const response = await fetchWithAuth(`${API_BASE}/sessions`)
    if (!response.ok) throw new Error("Failed to fetch sessions")
    return response.json()
  } catch (error) {
    console.error("[v0] Get sessions error:", error)
    throw error
  }
}

export async function createDrillSession(session: any) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    })
    if (!response.ok) throw new Error("Failed to create session")
    return response.json()
  } catch (error) {
    console.error("[v0] Create session error:", error)
    throw error
  }
}

export async function updateDrillSession(id: string, updates: any) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update session")
    return response.json()
  } catch (error) {
    console.error("[v0] Update session error:", error)
    throw error
  }
}

export async function deleteDrillSession(id: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/sessions/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Failed to delete session")
    return response.json()
  } catch (error) {
    console.error("[v0] Delete session error:", error)
    throw error
  }
}

export async function getSessionQuestions(sessionId: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/sessions/${sessionId}/questions`)
    if (!response.ok) throw new Error("Failed to fetch session questions")
    return response.json()
  } catch (error) {
    console.error("[v0] Get session questions error:", error)
    throw error
  }
}

// Answers
export async function getAnswers() {
  try {
    const response = await fetchWithAuth(`${API_BASE}/answers`)
    if (!response.ok) throw new Error("Failed to fetch answers")
    return response.json()
  } catch (error) {
    console.error("[v0] Get answers error:", error)
    throw error
  }
}

export async function submitAnswer(answer: any) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answer),
    })
    if (!response.ok) throw new Error("Failed to submit answer")
    return response.json()
  } catch (error) {
    console.error("[v0] Submit answer error:", error)
    throw error
  }
}

export async function updateAnswer(id: string, updates: any) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/answers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update answer")
    return response.json()
  } catch (error) {
    console.error("[v0] Update answer error:", error)
    throw error
  }
}

export async function approveAnswer(id: string, feedback?: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/answers/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    })
    if (!response.ok) throw new Error("Failed to approve answer")
    return response.json()
  } catch (error) {
    console.error("[v0] Approve answer error:", error)
    throw error
  }
}

export async function rejectAnswer(id: string, feedback?: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/answers/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    })
    if (!response.ok) throw new Error("Failed to reject answer")
    return response.json()
  } catch (error) {
    console.error("[v0] Reject answer error:", error)
    throw error
  }
}

export async function deleteAnswer(id: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/answers/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Failed to delete answer")
    return response.json()
  } catch (error) {
    console.error("[v0] Delete answer error:", error)
    throw error
  }
}

// Leaderboard
export async function getLeaderboard(sessionId: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/leaderboard?sessionId=${sessionId}`)
    if (!response.ok) throw new Error("Failed to fetch leaderboard")
    return response.json()
  } catch (error) {
    console.error("[v0] Get leaderboard error:", error)
    throw error
  }
}

// Notifications
export async function getNotifications() {
  try {
    const response = await fetchWithAuth(`${API_BASE}/notifications`)
    if (!response.ok) throw new Error("Failed to fetch notifications")
    return response.json()
  } catch (error) {
    console.error("[v0] Get notifications error:", error)
    throw error
  }
}

export async function sendNotification(notification: any) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification),
    })
    if (!response.ok) throw new Error("Failed to send notification")
    return response.json()
  } catch (error) {
    console.error("[v0] Send notification error:", error)
    throw error
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/notifications/${id}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) throw new Error("Failed to mark notification as read")
    return response.json()
  } catch (error) {
    console.error("[v0] Mark notification error:", error)
    throw error
  }
}

export async function deleteNotification(id: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE}/notifications/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Failed to delete notification")
    return response.json()
  } catch (error) {
    console.error("[v0] Delete notification error:", error)
    throw error
  }
}
