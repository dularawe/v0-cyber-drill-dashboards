-- Cyber Drill Database Schema

CREATE DATABASE IF NOT EXISTS cyber_drill;
USE cyber_drill;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'xcon', 'leader') NOT NULL,
  xcon_id INT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  text TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  time_limit INT NOT NULL DEFAULT 300,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Drill Sessions table
CREATE TABLE sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  status ENUM('draft', 'running', 'paused', 'completed') DEFAULT 'draft',
  start_time TIMESTAMP NULL,
  end_time TIMESTAMP NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Session Questions (many-to-many)
CREATE TABLE session_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL,
  question_id INT NOT NULL,
  order_num INT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY (session_id, question_id)
);

-- Answers table
CREATE TABLE answers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL,
  question_id INT NOT NULL,
  leader_id INT NOT NULL,
  answer_text TEXT NOT NULL,
  attempt_number INT DEFAULT 1,
  status ENUM('submitted', 'approved', 'rejected') DEFAULT 'submitted',
  feedback TEXT,
  reviewed_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Leaderboard table
CREATE TABLE leaderboard (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL,
  leader_id INT NOT NULL,
  correct_answers INT DEFAULT 0,
  total_answers INT DEFAULT 0,
  score INT DEFAULT 0,
  rank INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY (session_id, leader_id)
);

-- Indexes for performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_session_status ON sessions(status);
CREATE INDEX idx_answer_session ON answers(session_id);
CREATE INDEX idx_answer_leader ON answers(leader_id);
CREATE INDEX idx_answer_status ON answers(status);
CREATE INDEX idx_leaderboard_session ON leaderboard(session_id);

-- Insert admin user
INSERT INTO users (email, password, name, role) VALUES (
  'admin@cyberdrill.com',
  '$2b$10$HKFh2C2e0Sx7jzJ/hKvS9e7kL5rM8nP0qR1sT2uV3wX4yZ5aB6cDi',
  'System Admin',
  'super_admin'
);
