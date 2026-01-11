-- Create question_images table for storing up to 5 images per question
CREATE TABLE IF NOT EXISTS question_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL,
  image_data LONGTEXT NOT NULL,
  image_type VARCHAR(50) NOT NULL DEFAULT 'image/jpeg',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  INDEX idx_question_images (question_id)
);
