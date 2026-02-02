-- Staff & Resources Module - Database Schema
-- Created: 2026-02-02

-- Table: staff
-- Stores staff member information including role, department, shift, and status
CREATE TABLE IF NOT EXISTS staff (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL,
  shift ENUM('Day', 'Night') NOT NULL,
  status ENUM('Present', 'Leave') NOT NULL,
  role ENUM('Doctor', 'Nurse', 'Technician', 'Support') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_department (department),
  INDEX idx_status (status),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: beds
-- Stores bed availability by ward type
CREATE TABLE IF NOT EXISTS beds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ward_type ENUM('General Ward', 'ICU', 'Pediatric') NOT NULL UNIQUE,
  total_beds INT NOT NULL,
  occupied_beds INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (occupied_beds >= 0),
  CHECK (occupied_beds <= total_beds)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: equipment
-- Stores medical equipment information and status
CREATE TABLE IF NOT EXISTS equipment (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL,
  status ENUM('In Use', 'Under Repair', 'To Purchase') NOT NULL,
  last_service DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_department (department),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
