# Cyber Drill Backend API

Complete Node.js/Express backend with MySQL database for the Cyber Drill platform.

## Installation & Setup

### 1. Prerequisites
- Node.js (v14+)
- MySQL Server

### 2. Create Database
```bash
mysql -u root -p < database/schema.sql
```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cyber_drill
JWT_SECRET=your-secret-key
PORT=5000
```

### 5. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- POST `/api/auth/signin` - Login user
- POST `/api/auth/signup` - Register user
- POST `/api/auth/signout` - Logout user

### Questions
- GET `/api/questions` - Get all questions
- POST `/api/questions` - Create question (admin only)
- GET `/api/questions/:id` - Get single question
- PATCH `/api/questions/:id` - Update question (admin only)
- DELETE `/api/questions/:id` - Delete question (admin only)

### Leaders
- GET `/api/leaders` - Get all leaders
- POST `/api/leaders` - Create leader (admin only)
- PATCH `/api/leaders/:id` - Update leader (admin only)
- DELETE `/api/leaders/:id` - Delete leader (admin only)

### X-CONs
- GET `/api/xcons` - Get all X-CONs
- POST `/api/xcons` - Create X-CON (admin only)
- PATCH `/api/xcons/:id` - Update X-CON (admin only)
- DELETE `/api/xcons/:id` - Delete X-CON (admin only)

### Sessions
- GET `/api/sessions` - Get all sessions
- POST `/api/sessions` - Create session (admin only)
- PATCH `/api/sessions/:id` - Update session (admin only)
- DELETE `/api/sessions/:id` - Delete session (admin only)

### Answers
- GET `/api/answers` - Get pending answers
- POST `/api/answers` - Submit answer
- POST `/api/answers/:id/approve` - Approve answer (X-CON only)
- POST `/api/answers/:id/reject` - Reject answer (X-CON only)

### Leaderboard
- GET `/api/leaderboard?sessionId=ID` - Get leaderboard for session

## Testing

Use Postman or curl to test endpoints:

```bash
# Sign In
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cyberdrill.com","password":"Admin@2024"}'

# Get Questions
curl http://localhost:5000/api/questions

# Create Question (requires auth token)
curl -X POST http://localhost:5000/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text":"Question?","category":"Security","difficulty":"hard","time_limit":300}'
