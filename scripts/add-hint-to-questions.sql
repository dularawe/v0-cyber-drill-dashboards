-- Add hint column to questions table
-- Run this migration to add hint support for questions

ALTER TABLE questions ADD COLUMN hint TEXT DEFAULT NULL;

-- Verify the column was added
DESCRIBE questions;
