-- ============================================================
-- Placement & Internship Tracker - PostgreSQL Schema
-- Run this file in pgAdmin Query Tool or psql
-- ============================================================

-- 1. Create the database (run separately in pgAdmin if needed):
-- CREATE DATABASE placement_tracker;

-- 2. Connect to placement_tracker then run the rest:

-- Colleges Table
CREATE TABLE IF NOT EXISTS colleges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'student')),
  college_id INT REFERENCES colleges(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(200) NOT NULL,
  role VARCHAR(200) NOT NULL,
  status VARCHAR(50) DEFAULT 'Applied' CHECK (status IN ('Applied', 'Interview', 'Offer', 'Rejected')),
  application_date DATE DEFAULT CURRENT_DATE,
  interview_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Seed Data
-- ============================================================

-- Insert Colleges
INSERT INTO colleges (name) VALUES
  ('Pune University'),
  ('MIT College, Aurangabad')
ON CONFLICT DO NOTHING;

-- Insert Users (passwords are plain text for demo, hash in production)
INSERT INTO users (name, email, password, role, college_id) VALUES
  ('Super Owner', 'owner@tracker.com', '123', 'owner', NULL),
  ('College Admin', 'admin@tracker.com', '123', 'admin', 1),
  ('Student One', 'user@tracker.com', '123', 'student', 1)
ON CONFLICT (email) DO NOTHING;

-- Insert sample applications for Student One (id=3)
INSERT INTO applications (student_id, company, role, status, notes) VALUES
  (3, 'TechCorp', 'SDE Intern', 'Applied', 'Applied via campus portal'),
  (3, 'Infosys', 'Associate Engineer', 'Interview', 'Round 1 on 30th March'),
  (3, 'Wipro', 'Developer Trainee', 'Rejected', 'Did not clear aptitude')
ON CONFLICT DO NOTHING;
