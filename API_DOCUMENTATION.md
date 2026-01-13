# Cyber Drill Dashboards - Complete API Reference

## Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://yourdomain.com/api`

---

## Authentication Endpoints

### 1. Sign In
**POST** `/auth/signin`

Create user session and get auth token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "leader"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials
- `500` - Server error

---

### 2. Sign Up
**POST** `/auth/signup`

Register new user account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "Jane Doe",
  "role": "leader"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 2,
    "email": "newuser@example.com",
    "name": "Jane Doe",
    "role": "leader"
  }
}
```

**Status Codes:**
- `201` - Created
- `400` - Email already exists
- `500` - Server error

---

### 3. Sign Out
**POST** `/auth/signout`

Terminate user session.

**Response:**
```json
{
  "message": "Signed out successfully"
}
```

---

## Drill Session Management Endpoints

### 4. Get All Sessions
**GET** `/sessions`

Retrieve all drill sessions.

**Query Parameters:** None

**Response:**
```json
[
  {
    "id": 1,
    "name": "Phishing Detection 2025",
    "status": "running",
    "start_time": "2025-01-11 23:02:00",
    "end_time": "2025-01-13 23:23:00",
    "created_by": 1,
    "created_at": "2025-01-10 22:32:54"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### 5. Get Active Session
**GET** `/sessions/active`

Get currently running drill session.

**Response:**
```json
{
  "id": 1,
  "name": "Phishing Detection 2025",
  "status": "running",
  "start_time": "2025-01-11 23:02:00",
  "end_time": "2025-01-13 23:23:00"
}
```

**Status Codes:**
- `200` - Success
- `404` - No active session
- `500` - Server error

---

### 6. Create Session
**POST** `/sessions`

Create new drill session (Admin only).

**Request:**
```json
{
  "name": "Security Awareness Training",
  "questions": [1, 2, 3, 4, 5],
  "start_time": "2025-02-01 10:00:00",
  "end_time": "2025-02-01 11:30:00"
}
```

**Response:**
```json
{
  "id": 5,
  "name": "Security Awareness Training",
  "status": "draft",
  "start_time": "2025-02-01 10:00:00",
  "end_time": "2025-02-01 11:30:00"
}
```

**Status Codes:**
- `201` - Created
- `401` - Unauthorized
- `403` - Not admin
- `500` - Server error

---

### 7. Update Session
**PATCH** `/sessions/:id`

Update drill session status, times (Admin only).

**Request:**
```json
{
  "status": "running",
  "start_time": "2025-02-01 10:00:00"
}
```

**Allowed Statuses:**
- `draft` - Not started
- `scheduled` - Planned for later
- `running` - Currently active
- `paused` - Temporarily halted
- `completed` - Finished

**Response:**
```json
{
  "id": 5,
  "status": "running",
  "start_time": "2025-02-01 10:00:00"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid status or no fields to update
- `401` - Unauthorized
- `403` - Not admin
- `500` - Server error

---

### 8. Delete Session
**DELETE** `/sessions/:id`

Remove drill session (Admin only).

**Response:**
```json
{
  "message": "Session deleted"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Not admin
- `500` - Server error

---

## Question Management Endpoints

### 9. Get All Questions
**GET** `/questions`

Retrieve all questions with associated images.

**Response:**
```json
[
  {
    "id": 1,
    "text": "What is phishing?",
    "category": "Security Awareness",
    "difficulty": "easy",
    "time_limit": 30,
    "created_at": "2025-01-10 22:32:54",
    "images": [
      {
        "id": 1,
        "image_data": "base64_encoded_string",
        "image_type": "image/jpeg",
        "display_order": 0
      }
    ]
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### 10. Get Single Question
**GET** `/questions/:id`

Retrieve specific question with images.

**Response:**
```json
{
  "id": 1,
  "text": "What is phishing?",
  "category": "Security Awareness",
  "difficulty": "easy",
  "time_limit": 30,
  "images": []
}
```

**Status Codes:**
- `200` - Success
- `404` - Question not found
- `500` - Server error

---

### 11. Create Question
**POST** `/questions`

Create new question with images (Admin only).

**Request:**
```json
{
  "text": "Identify the phishing email",
  "category": "Phishing Detection",
  "difficulty": "medium",
  "timeLimit": 60,
  "images": [
    {
      "data": "base64_encoded_image",
      "type": "image/jpeg"
    }
  ]
}
```

**Note:** Maximum 5 images per question

**Response:**
```json
{
  "id": 25,
  "text": "Identify the phishing email",
  "category": "Phishing Detection",
  "difficulty": "medium",
  "timeLimit": 60,
  "images": [...]
}
```

**Status Codes:**
- `201` - Created
- `401` - Unauthorized
- `403` - Not admin
- `500` - Server error

---

### 12. Update Question
**PATCH** `/questions/:id`

Update question details and images (Admin only).

**Request:**
```json
{
  "text": "Updated question text",
  "difficulty": "hard",
  "images": [...]
}
```

**Response:**
```json
{
  "id": 1,
  "text": "Updated question text",
  "difficulty": "hard"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Not admin
- `500` - Server error

---

### 13. Delete Question
**DELETE** `/questions/:id`

Remove question (Admin only).

**Response:**
```json
{
  "message": "Question deleted"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Not admin
- `500` - Server error

---

## User Management Endpoints

### 14. Get All Leaders
**GET** `/leaders`

Retrieve all leader accounts.

**Response:**
```json
[
  {
    "id": 10,
    "email": "leader@example.com",
    "name": "John Leader",
    "xcon_id": 5
  }
]
```

---

### 15. Create Leader
**POST** `/leaders`

Create new leader account (Admin only).

**Request:**
```json
{
  "email": "newleader@example.com",
  "name": "New Leader",
  "password": "secure_password",
  "xcon_id": 5
}
```

**Response:**
```json
{
  "id": 11,
  "email": "newleader@example.com",
  "name": "New Leader",
  "xcon_id": 5
}
```

---

### 16. Update Leader
**PATCH** `/leaders/:id`

Update leader details (Admin only).

**Request:**
```json
{
  "email": "updated@example.com",
  "name": "Updated Name",
  "xcon_id": 6
}
```

---

### 17. Delete Leader
**DELETE** `/leaders/:id`

Remove leader account (Admin only).

---

### 18. Get All X-CONs
**GET** `/xcons`

Retrieve all X-CON accounts.

---

### 19. Create X-CON
**POST** `/xcons`

Create new X-CON account (Admin only).

**Request:**
```json
{
  "email": "xcon@example.com",
  "name": "X-CON Name",
  "password": "secure_password"
}
```

---

### 20. Update X-CON
**PATCH** `/xcons/:id`

Update X-CON details (Admin only).

---

### 21. Delete X-CON
**DELETE** `/xcons/:id`

Remove X-CON account (Admin only).

---

## Answer Management Endpoints

### 22. Get Answers
**GET** `/answers`

Get submitted answers (filtered by role).

**Response:**
```json
[
  {
    "id": 1,
    "session_id": 1,
    "question_id": 5,
    "leader_id": 10,
    "answer_text": "This email looks suspicious",
    "status": "submitted",
    "created_at": "2025-01-11 15:30:00"
  }
]
```

---

### 23. Submit Answer
**POST** `/answers`

Submit answer for a question.

**Request:**
```json
{
  "session_id": 1,
  "question_id": 5,
  "answer_text": "My answer to the question"
}
```

**Response:**
```json
{
  "id": 2,
  "session_id": 1,
  "question_id": 5,
  "status": "submitted",
  "created_at": "2025-01-11 15:35:00"
}
```

**Status Codes:**
- `201` - Answer submitted
- `400` - Missing required fields
- `401` - Not authenticated
- `500` - Server error

---

### 24. Mark Answer Timeout
**POST** `/answers/:id/timeout`

Mark answer as rejected due to time limit.

**Request:**
```json
{
  "question_id": 5,
  "session_id": 1
}
```

**Response:**
```json
{
  "id": 3,
  "status": "rejected",
  "reason": "timeout"
}
```

---

### 25. Approve Answer
**POST** `/answers/:id/approve`

Approve answer with feedback (X-CON only).

**Request:**
```json
{
  "feedback": "Excellent answer!"
}
```

**Response:**
```json
{
  "id": 1,
  "status": "approved"
}
```

---

### 26. Reject Answer
**POST** `/answers/:id/reject`

Reject answer with feedback (X-CON only).

**Request:**
```json
{
  "feedback": "This answer is incorrect"
}
```

**Response:**
```json
{
  "id": 1,
  "status": "rejected"
}
```

---

### 27. Delete Answer
**DELETE** `/answers/:id`

Remove answer.

---

## Leaderboard Endpoints

### 28. Get Leaderboard
**GET** `/leaderboard?sessionId=:sessionId`

Get ranked standings for a drill session.

**Query Parameters:**
- `sessionId` - Session ID (default: 1)

**Response:**
```json
[
  {
    "id": 1,
    "session_id": 1,
    "leader_id": 10,
    "rank": 1,
    "score": 95,
    "attempts": 2,
    "completed": true,
    "name": "John Leader",
    "email": "leader@example.com"
  }
]
```

---

## Notification Endpoints

### 29. Get Notifications
**GET** `/notifications`

Get all notifications for current user.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Drill Reminder",
    "message": "Your drill starts in 5 minutes",
    "type": "info",
    "is_read": false,
    "created_at": "2025-01-11 14:55:00"
  }
]
```

---

### 30. Get Unread Count
**GET** `/notifications/unread/count`

Get count of unread notifications.

**Response:**
```json
{
  "unread_count": 3
}
```

---

### 31. Send Notification
**POST** `/notifications`

Send notification to users (Admin only).

**Request:**
```json
{
  "title": "Drill Starting",
  "message": "The drill is about to start",
  "type": "warning",
  "recipient_id": 10,
  "is_broadcast": false,
  "recipient_role": "leader"
}
```

**Response:**
```json
{
  "id": 2,
  "title": "Drill Starting",
  "message": "The drill is about to start",
  "created_at": "2025-01-11 15:00:00"
}
```

---

### 32. Mark Notification as Read
**POST** `/notifications/:id/read`

Mark individual notification as read.

**Response:**
```json
{
  "id": 1,
  "is_read": true
}
```

---

### 33. Delete Notification
**DELETE** `/notifications/:id`

Remove notification.

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Error description",
  "details": "Additional error details (if available)"
}
```

**Common Error Codes:**
- `400` - Bad Request (missing/invalid fields)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Authentication

All protected endpoints require an Authorization header:

```
Authorization: Bearer <token>
```

Token is obtained from `/auth/signin` or `/auth/signup` responses.

---

## Role-Based Access

- **Admin** - Full system access, can manage all resources
- **Leader** - Can submit answers, view standings, receive notifications
- **X-CON** - Can review answers, approve/reject, send notifications

---

## Rate Limiting

Currently no rate limiting implemented. Recommended to add in production for:
- Authentication endpoints
- Answer submission
- File uploads

---

## Pagination

Currently not implemented. Recommended to add for:
- Questions list
- Answers list
- Notifications
- Leaderboard

Suggested query parameters:
- `limit=20` (default)
- `offset=0` (default)

---

## Testing the APIs

### Using cURL

```bash
# Sign in
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get sessions
curl -X GET http://localhost:5000/api/sessions \
  -H "Authorization: Bearer <token>"

# Create question
curl -X POST http://localhost:5000/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"text":"Question text","category":"Category","difficulty":"easy","timeLimit":30}'
```

### Using Postman

1. Create new collection "Cyber Drill"
2. Add environment variable: `api_url = http://localhost:5000/api`
3. Add Bearer token in Authorization tab
4. Create requests for each endpoint
5. Test different scenarios

---

## API Summary Table

| # | Endpoint | Method | Auth | Role | Description |
|---|----------|--------|------|------|-------------|
| 1 | /auth/signin | POST | No | - | Sign in user |
| 2 | /auth/signup | POST | No | - | Register user |
| 3 | /auth/signout | POST | Yes | - | Logout |
| 4 | /sessions | GET | Yes | - | Get all drills |
| 5 | /sessions/active | GET | Yes | - | Get active drill |
| 6 | /sessions | POST | Yes | Admin | Create drill |
| 7 | /sessions/:id | PATCH | Yes | Admin | Update drill |
| 8 | /sessions/:id | DELETE | Yes | Admin | Delete drill |
| 9 | /questions | GET | No | - | Get questions |
| 10 | /questions/:id | GET | No | - | Get question |
| 11 | /questions | POST | Yes | Admin | Create question |
| 12 | /questions/:id | PATCH | Yes | Admin | Update question |
| 13 | /questions/:id | DELETE | Yes | Admin | Delete question |
| 14 | /leaders | GET | Yes | - | Get leaders |
| 15 | /leaders | POST | Yes | Admin | Create leader |
| 16 | /leaders/:id | PATCH | Yes | Admin | Update leader |
| 17 | /leaders/:id | DELETE | Yes | Admin | Delete leader |
| 18 | /xcons | GET | Yes | - | Get X-CONs |
| 19 | /xcons | POST | Yes | Admin | Create X-CON |
| 20 | /xcons/:id | PATCH | Yes | Admin | Update X-CON |
| 21 | /xcons/:id | DELETE | Yes | Admin | Delete X-CON |
| 22 | /answers | GET | Yes | - | Get answers |
| 23 | /answers | POST | Yes | - | Submit answer |
| 24 | /answers/:id/timeout | POST | Yes | - | Mark timeout |
| 25 | /answers/:id/approve | POST | Yes | X-CON | Approve answer |
| 26 | /answers/:id/reject | POST | Yes | X-CON | Reject answer |
| 27 | /answers/:id | DELETE | Yes | - | Delete answer |
| 28 | /leaderboard | GET | Yes | - | Get standings |
| 29 | /notifications | GET | Yes | - | Get notifications |
| 30 | /notifications/unread/count | GET | Yes | - | Unread count |
| 31 | /notifications | POST | Yes | Admin | Send notification |
| 32 | /notifications/:id/read | POST | Yes | - | Mark read |
| 33 | /notifications/:id | DELETE | Yes | - | Delete notification |

---

## API Completeness Status

✅ **Complete & Tested:**
- Authentication (signin, signup, signout)
- Session management (CRUD operations)
- Question management with images
- Leader management (CRUD)
- X-CON management (CRUD)
- Answer submission and review
- Leaderboard queries
- Notifications (CRUD and read tracking)

⚠️ **Recommended Enhancements:**
- Rate limiting
- Pagination
- Caching for leaderboard
- Bulk operations
- Search/filter capabilities
- Export functionality
- Audit logging
