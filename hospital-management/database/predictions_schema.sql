-- Admission Prediction Module - Database Schema
-- Table to store historical daily admission counts

CREATE TABLE IF NOT EXISTS daily_admissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admission_date DATE NOT NULL UNIQUE,
  total_admissions INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admission_date (admission_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
