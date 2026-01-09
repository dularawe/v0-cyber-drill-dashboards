// In-memory database with all collections
interface User {
  id: string
  email: string
  password: string
  role: "super-admin" | "xcon" | "leader"
  name: string
  createdAt: string
}

interface Question {
  id: string
  text: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  timeLimit: number
  createdAt: string
}

interface Leader {
  id: string
  name: string
  email: string
  password: string
  assignedXconId: string
  team: string
  createdAt: string
}

interface XCon {
  id: string
  name: string
  email: string
  password: string
  team: string
  createdAt: string
}

interface DrillSession {
  id: string
  name: string
  status: "draft" | "active" | "paused" | "completed"
  createdAt: string
  startedAt?: string
  endedAt?: string
}

interface Answer {
  id: string
  leaderId: string
  sessionId: string
  questionId: string
  text: string
  status: "pending" | "approved" | "rejected"
  attemptNumber: number
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

interface Leaderboard {
  leaderId: string
  name: string
  answered: number
  correct: number
  score: number
  rank: number
}

class Database {
  private users: User[] = []
  private questions: Question[] = []
  private leaders: Leader[] = []
  private xcons: XCon[] = []
  private sessions: DrillSession[] = []
  private answers: Answer[] = []

  constructor() {
    // Initialize with admin user
    this.users.push({
      id: "1",
      email: "admin@cyberdrill.com",
      password: "Admin@2024",
      role: "super-admin",
      name: "Admin",
      createdAt: new Date().toISOString(),
    })
  }

  // User methods
  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email)
  }

  createUser(user: Omit<User, "id" | "createdAt">): User {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    this.users.push(newUser)
    return newUser
  }

  // Question methods
  getQuestions(): Question[] {
    return this.questions
  }

  createQuestion(data: Omit<Question, "id" | "createdAt">): Question {
    const newQuestion: Question = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    this.questions.push(newQuestion)
    return newQuestion
  }

  getQuestionById(id: string): Question | undefined {
    return this.questions.find((q) => q.id === id)
  }

  updateQuestion(id: string, data: Partial<Question>): Question | undefined {
    const question = this.questions.find((q) => q.id === id)
    if (question) {
      Object.assign(question, data)
    }
    return question
  }

  deleteQuestion(id: string): boolean {
    const index = this.questions.findIndex((q) => q.id === id)
    if (index > -1) {
      this.questions.splice(index, 1)
      return true
    }
    return false
  }

  // Leader methods
  getLeaders(): Leader[] {
    return this.leaders
  }

  createLeader(data: Omit<Leader, "id" | "createdAt">): Leader {
    const newLeader: Leader = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    this.leaders.push(newLeader)
    this.users.push({
      id: newLeader.id,
      email: newLeader.email,
      password: newLeader.password,
      role: "leader",
      name: newLeader.name,
      createdAt: new Date().toISOString(),
    })
    return newLeader
  }

  getLeaderById(id: string): Leader | undefined {
    return this.leaders.find((l) => l.id === id)
  }

  updateLeader(id: string, data: Partial<Leader>): Leader | undefined {
    const leader = this.leaders.find((l) => l.id === id)
    if (leader) {
      Object.assign(leader, data)
    }
    return leader
  }

  deleteLeader(id: string): boolean {
    const index = this.leaders.findIndex((l) => l.id === id)
    if (index > -1) {
      this.leaders.splice(index, 1)
      return true
    }
    return false
  }

  // X-CON methods
  getXCons(): XCon[] {
    return this.xcons
  }

  createXCon(data: Omit<XCon, "id" | "createdAt">): XCon {
    const newXCon: XCon = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    this.xcons.push(newXCon)
    this.users.push({
      id: newXCon.id,
      email: newXCon.email,
      password: newXCon.password,
      role: "xcon",
      name: newXCon.name,
      createdAt: new Date().toISOString(),
    })
    return newXCon
  }

  getXConById(id: string): XCon | undefined {
    return this.xcons.find((x) => x.id === id)
  }

  updateXCon(id: string, data: Partial<XCon>): XCon | undefined {
    const xcon = this.xcons.find((x) => x.id === id)
    if (xcon) {
      Object.assign(xcon, data)
    }
    return xcon
  }

  deleteXCon(id: string): boolean {
    const index = this.xcons.findIndex((x) => x.id === id)
    if (index > -1) {
      this.xcons.splice(index, 1)
      return true
    }
    return false
  }

  // Session methods
  getSessions(): DrillSession[] {
    return this.sessions
  }

  createSession(data: Omit<DrillSession, "id" | "createdAt">): DrillSession {
    const newSession: DrillSession = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    this.sessions.push(newSession)
    return newSession
  }

  getSessionById(id: string): DrillSession | undefined {
    return this.sessions.find((s) => s.id === id)
  }

  updateSession(id: string, data: Partial<DrillSession>): DrillSession | undefined {
    const session = this.sessions.find((s) => s.id === id)
    if (session) {
      Object.assign(session, data)
    }
    return session
  }

  deleteSession(id: string): boolean {
    const index = this.sessions.findIndex((s) => s.id === id)
    if (index > -1) {
      this.sessions.splice(index, 1)
      return true
    }
    return false
  }

  // Answer methods
  getAnswers(filters?: { leaderId?: string; sessionId?: string; status?: string }): Answer[] {
    return this.answers.filter((a) => {
      if (filters?.leaderId && a.leaderId !== filters.leaderId) return false
      if (filters?.sessionId && a.sessionId !== filters.sessionId) return false
      if (filters?.status && a.status !== filters.status) return false
      return true
    })
  }

  createAnswer(data: Omit<Answer, "id" | "submittedAt">): Answer {
    const newAnswer: Answer = {
      ...data,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    }
    this.answers.push(newAnswer)
    return newAnswer
  }

  getAnswerById(id: string): Answer | undefined {
    return this.answers.find((a) => a.id === id)
  }

  updateAnswer(id: string, data: Partial<Answer>): Answer | undefined {
    const answer = this.answers.find((a) => a.id === id)
    if (answer) {
      Object.assign(answer, data)
    }
    return answer
  }

  deleteAnswer(id: string): boolean {
    const index = this.answers.findIndex((a) => a.id === id)
    if (index > -1) {
      this.answers.splice(index, 1)
      return true
    }
    return false
  }

  // Leaderboard
  getLeaderboard(sessionId?: string): Leaderboard[] {
    const leaders = this.leaders.map((leader) => {
      const leaderAnswers = this.answers.filter((a) => a.leaderId === leader.id)
      const correctAnswers = leaderAnswers.filter((a) => a.status === "approved").length
      return {
        leaderId: leader.id,
        name: leader.name,
        answered: leaderAnswers.length,
        correct: correctAnswers,
        score: correctAnswers * 10,
        rank: 0,
      }
    })

    leaders.sort((a, b) => b.score - a.score)
    leaders.forEach((leader, index) => {
      leader.rank = index + 1
    })

    return leaders
  }
}

export const db = new Database()
