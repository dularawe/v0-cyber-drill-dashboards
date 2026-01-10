-- Insert admin user with bcrypt hash of "Admin@2024"
-- Hash generated with bcryptjs round 10
INSERT INTO users (email, password, name, role, created_at) VALUES 
('admin@cyberdrill.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36E3ZsKa', 'Admin User', 'super_admin', NOW())
ON DUPLICATE KEY UPDATE password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36E3ZsKa';
