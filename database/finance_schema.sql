-- ============================================
-- FINANCE MODULE DATABASE SCHEMA (FINAL)
-- ============================================

-- Note: transactions table already exists, no need to recreate

-- 1. Payroll Records Table
-- Stores payroll information for all employees
CREATE TABLE IF NOT EXISTS payroll_records (
  id VARCHAR(20) COLLATE utf8mb4_unicode_ci PRIMARY KEY,
  employee_id VARCHAR(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  employee_name VARCHAR(100) NOT NULL,
  category ENUM('doctors', 'nurses', 'management', 'technicians', 'others') NOT NULL,
  role VARCHAR(100) NOT NULL,
  base_salary DECIMAL(10, 2) NOT NULL,
  bonus DECIMAL(10, 2) DEFAULT 0.00,
  deductions DECIMAL(10, 2) DEFAULT 0.00,
  net_salary DECIMAL(10, 2) GENERATED ALWAYS AS (base_salary + bonus - deductions) STORED,
  period_month INT NOT NULL,
  period_year INT NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES staff(id) ON DELETE CASCADE,
  INDEX idx_employee (employee_id),
  INDEX idx_period (period_year, period_month),
  INDEX idx_category (category),
  INDEX idx_processed (processed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Payroll History Table
-- Tracks payroll processing history
CREATE TABLE IF NOT EXISTS payroll_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  period_month INT NOT NULL,
  period_year INT NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  transaction_id VARCHAR(20) COLLATE utf8mb4_unicode_ci,
  processed_by VARCHAR(20),
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
  INDEX idx_period (period_year, period_month),
  INDEX idx_transaction (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
