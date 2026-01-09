# Cyber Drill Dashboards - API Routes Documentation

## Overview
Complete Node.js REST API for the Cyber Drill Dashboards application. All endpoints return JSON and require proper authentication where applicable.

---

## Authentication Endpoints

### POST `/api/auth/signin`
**Sign in an existing user**
- Body: `{ email: string, password: string, role: "admin" | "xcon" | "leader" }`
- Response: `{ success: boolean, user: { id, email, name, role }, session: string }`
- Status: 200 (Success) | 401 (Invalid credentials) | 500 (Error)

### POST `/api/auth/signup`
**Create a new user account**
- Body: `{ email: string, password: string, name: string, role: "admin" | "xcon" | "leader" }`
- Response: `{ success: boolean, user: { id, email, name, role } }`
- Status: 201 (Created) | 400 (Invalid data) | 500 (Error)

### POST `/api/auth/signout`
**Sign out current user**
- Headers: `Authorization: Bearer {sessionToken}`
- Response: `{ success: boolean }`
- Status: 200 (Success) | 401 (Unauthorized) | 500 (Error)

---

## Questions Management

### GET `/api/questions`
**Get all questions**
- Query: `?limit=50&offset=0&difficulty=easy|medium|hard` (optional)
- Response: `Question[]`
- Status: 200 (Success) | 500 (Error)

### POST `/api/questions`
**Create a new question**
- Headers: `Authorization: Bearer {adminToken}`
- Body: `{ text: string, category: string, difficulty: "easy" | "medium" | "hard", timeLimit: number }`
- Response: `{ id, text, category, difficulty, timeLimit, created_at }`
- Status: 201 (Created) | 401 (Unauthorized) | 400 (Invalid data) | 500 (Error)

### GET `/api/questions/[id]`
**Get a specific question**
- Response: `Question`
- Status: 200 (Success) | 404 (Not found) | 500 (Error)

### PATCH `/api/questions/[id]`
**Update a question**
- Headers: `Authorization: Bearer {adminToken}`
- Body: `{ text?, category?, difficulty?, timeLimit? }`
- Response: `Question`
- Status: 200 (Success) | 401 (Unauthorized) | 404 (Not found) | 500 (Error)

### DELETE `/api/questions/[id]`
**Delete a question**
- Headers: `Authorization: Bearer {adminToken}`
- Response: `{ success: boolean }`
- Status: 200 (Success) | 401 (Unauthorized) | 404 (Not found) | 500 (Error)

---

## Leaders Management

### GET `/api/leaders`
**Get all leaders**
- Query: `?limit=50&offset=0&xconId=xxx` (optional - filter by X-CON)
- Response: `Leader[]`
- Status: 200 (Success) | 500 (Error)

### POST `/api/leaders`
**Create a new leader (participant)**
- Headers: `Authorization: Bearer {adminToken}`
- Body: `{ email: string, name: string, password: string, assignedXconId: string, team?: string }`
- Response: `{ id, email, name, assignedXconId, team, created_at }`
- Status: 201 (Created) | 401 (Unauthorized) | 400 (Invalid data) | 500 (Error)

### GET `/api/leaders/[id]`
**Get a specific leader**
- Response: `Leader`
- Status: 200 (Success) | 404 (Not found) | 500 (Error)

### PATCH `/api/leaders/[id]`
**Update a leader**
- Headers: `Authorization: Bearer {adminToken}`
- Body: `{ email?, name?, assignedXconId?, team? }`
- Response: `Leader`
- Status: 200 (Success) | 401 (Unauthorized) | 404 (Not found) | 500 (Error)

### DELETE `/api/leaders/[id]`
**Delete a leader**
- Headers: `Authorization: Bearer {adminToken}`
- Response: `{ success: boolean }`
- Status: 200 (Success) | 401 (Unauthorized) | 404 (Not found) | 500 (Error)

---

## X-CON Coordinators Management

### GET `/api/xcons`
**Get all X-CON coordinators**
- Query: `?limit=50&offset=0`
- Response: `XCon[]`
- Status: 200 (Success) | 500 (Error)

### POST `/api/xcons`
**Create a new X-CON coordinator**
- Headers: `Authorization: Bearer {adminToken}`
- Body: `{ email: string, name: string, password: string, team?: string }`
- Response: `{ id, email, name, team, created_at }`
- Status: 201 (Created) | 401 (Unauthorized) | 400 (Invalid data) | 500 (Error)

### GET `/api/xcons/[id]`
**Get a specific X-CON coordinator**
- Response: `XCon`
- Status: 200 (Success) | 404 (Not found) | 500 (Error)

### PATCH `/api/xcons/[id]`
**Update X-CON coordinator**
- Headers: `Authorization: Bearer {adminToken}`
- Body: `{ email?, name?, team? }`
- Response: `XCon`
- Status: 200 (Success) | 401 (Unauthorized) | 404 (Not found) | 500 (Error)

### DELETE `/api/xcons/[id]`
**Delete X-CON coordinator**
- Headers: `Authorization: Bearer {adminToken}`
- Response: `{ success: boolean }`
- Status: 200 (Success) | 401 (Unauthorized) | 404 (Not found) | 500 (Error)

---

## Drill Sessions

### GET `/api/sessions`
**Get all drill sessions**
- Query: `?limit=50&offset=0&status=pending|active|completed`
- Response: `DrillSession[]`
- Status: 200 (Success) | 500 (Error)

### POST `/api/sessions`
**Create a new drill session**
- Headers: `Authorization: Bearer {adminToken}`
- Body: `{ name: string, description?: string }`
- Response: `{ id, name, description, status: "pending", created_at }`
- Status: 201 (Created) | 401 (Unauthorized) | 400 (Invalid data) | 500 (Error)

### GET `/api/sessions/[id]`
**Get a specific drill session**
- Response: `DrillSession`
- Status: 200 (Success) | 404 (Not found) | 500 (Error)

### PATCH `/api/sessions/[id]`
**Update drill session (start, pause, end)**
- Headers: `Authorization: Bearer {adminToken}`
- Body: `{ status: "active" | "paused" | "completed", broadcastMessage?: string }`
- Response: `DrillSession`
- Status: 200 (Success) | 401 (Unauthorized) | 404 (Not found) | 500 (Error)

### DELETE `/api/sessions/[id]`
**Delete drill session**
- Headers: `Authorization: Bearer {adminToken}`
- Response: `{ success: boolean }`
- Status: 200 (Success) | 401 (Unauthorized) | 404 (Not found) | 500 (Error)

---

## Answers Submission & Review

### GET `/api/answers`
**Get all answers**
- Query: `?limit=50&offset=0&leaderId=xxx&sessionId=xxx&status=pending|approved|rejected`
- Response: `Answer[]`
- Status: 200 (Success) | 500 (Error)

### POST `/api/answers`
**Submit an answer**
- Headers: `Authorization: Bearer {leaderToken}`
- Body: `{ leaderId: string, sessionId: string, questionId: string, answer: string, attempt: number }`
- Response: `{ id, leaderId, questionId, answer, attempt, status: "pending", submitted_at }`
- Status: 201 (Created) | 401 (Unauthorized) | 400 (Invalid data) | 500 (Error)

### GET `/api/answers/[id]`
**Get a specific answer**
- Response: `Answer`
- Status: 200 (Success) | 404 (Not found) | 500 (Error)

### PATCH `/api/answers/[id]`
**Update answer (retry)**
- Headers: `Authorization: Bearer {leaderToken}`
- Body: `{ answer: string }`
- Response: `Answer`
- Status: 200 (Success) | 401 (Unauthorized) | 404 (Not found) | 500 (Error)

### POST `/api/answers/[id]/approve`
**Approve an answer**
- Headers: `Authorization: Bearer {xconToken}`
- Body: `{ feedback?: string }`
- Response: `{ success: boolean, answer: Answer }`
- Status: 200 (Success) | 401 (Unauthorized) | 404 (Not found) | 500 (Error)

### POST `/api/answers/[id]/reject`
**Reject an answer**
- Headers: `Authorization: Bearer {xconToken}`
- Body: `{ feedback?: string }`
- Response: `{ success: boolean, answer: Answer }`
- Status: 200 (Success) | 401 (Unauthorized) | 404 (Not found) | 500 (Error)

### DELETE `/api/answers/[id]`
**Delete an answer**
- Headers: `Authorization: Bearer {xconToken}`
- Response: `{ success: boolean }`
- Status: 200 (Success) | 401 (Unauthorized) | 404 (Not found) | 500 (Error)

---

## Leaderboard

### GET `/api/leaderboard`
**Get leaderboard for a session**
- Query: `?sessionId=xxx&limit=100`
- Response: `{ ranking: Array<{ rank, leaderId, name, score, correct, total }> }`
- Status: 200 (Success) | 404 (Not found) | 500 (Error)

---

## Client Library

Use `lib/api-client.ts` for all API calls from components:

```typescript
import {
  signInUser,
  signUpUser,
  signOutUser,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getLeaders,
  createLeader,
  updateLeader,
  deleteLeader,
  getXCons,
  createXCon,
  updateXCon,
  deleteXCon,
  getAnswers,
  submitAnswer,
  updateAnswer,
  approveAnswer,
  rejectAnswer,
  deleteAnswer,
  getLeaderboard,
  getDrillSessions,
  createDrillSession,
  updateDrillSession,
  deleteDrillSession,
} from "@/lib/api-client"
```

---

## Error Handling

All endpoints return standard error responses:
```json
{
  "error": "Description of error",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `UNAUTHORIZED` - Missing or invalid auth token
- `FORBIDDEN` - User lacks permission
- `NOT_FOUND` - Resource doesn't exist
- `INVALID_DATA` - Validation failed
- `INTERNAL_ERROR` - Server error

---

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <session_token>
```

All endpoints requiring authentication will return 401 if token is missing or invalid.
```
</parameter>
