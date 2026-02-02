-- ============================================
-- Hospital Management System - Database Schema
-- MySQL Database Schema
-- CRITICAL: Column names EXACTLY match frontend JavaScript object keys
-- Based on DATA_CONTRACT_ANALYSIS.md
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- ============================================
-- 1. USERS TABLE
-- User authentication and access control
-- JS Object: users[userId] = { password, role, name, access }
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    userId VARCHAR(20) PRIMARY KEY COMMENT 'Matches JS key: userId',
    password VARCHAR(255) NOT NULL COMMENT 'Matches JS key: password',
    role VARCHAR(50) NOT NULL COMMENT 'Matches JS key: role',
    name VARCHAR(100) NOT NULL COMMENT 'Matches JS key: name',
    access JSON NOT NULL COMMENT 'Matches JS key: access (array of page IDs)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. PATIENTS TABLE
-- Patient admission and flow tracking
-- JS Object: samplePatients[] = { id, opd, name, aadhar, bloodGroup, caretaker, phone, status, admittedDate, transferredDate, dischargedDate, department, doctor, nurse }
-- ============================================
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(20) PRIMARY KEY COMMENT 'Matches JS key: id',
    opd VARCHAR(20) NOT NULL UNIQUE COMMENT 'Matches JS key: opd',
    name VARCHAR(100) NOT NULL COMMENT 'Matches JS key: name',
    aadhar VARCHAR(20) NOT NULL COMMENT 'Matches JS key: aadhar',
    bloodGroup VARCHAR(5) NOT NULL COMMENT 'Matches JS key: bloodGroup',
    caretaker VARCHAR(100) NOT NULL COMMENT 'Matches JS key: caretaker',
    phone VARCHAR(20) NOT NULL COMMENT 'Matches JS key: phone',
    status ENUM('admitted', 'discharged', 'transferred', 'critical') NOT NULL DEFAULT 'admitted' COMMENT 'Matches JS key: status',
    admittedDate DATE NOT NULL COMMENT 'Matches JS key: admittedDate',
    transferredDate DATE NULL COMMENT 'Matches JS key: transferredDate',
    dischargedDate DATE NULL COMMENT 'Matches JS key: dischargedDate',
    department VARCHAR(100) NOT NULL COMMENT 'Matches JS key: department',
    doctor VARCHAR(100) NOT NULL COMMENT 'Matches JS key: doctor',
    nurse VARCHAR(100) NOT NULL COMMENT 'Matches JS key: nurse',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_admittedDate (admittedDate),
    INDEX idx_department (department),
    INDEX idx_aadhar (aadhar)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. STAFF TABLE
-- Staff allocation and attendance
-- JS Object: sampleStaff[] = { id, name, department, shift, status }
-- ============================================
CREATE TABLE IF NOT EXISTS staff (
    id VARCHAR(20) PRIMARY KEY COMMENT 'Matches JS key: id',
    name VARCHAR(100) NOT NULL COMMENT 'Matches JS key: name',
    department VARCHAR(100) NOT NULL COMMENT 'Matches JS key: department',
    shift ENUM('Day', 'Night') NOT NULL COMMENT 'Matches JS key: shift',
    status ENUM('Present', 'Leave', 'Absent') NOT NULL DEFAULT 'Present' COMMENT 'Matches JS key: status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_department (department),
    INDEX idx_status (status),
    INDEX idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. ATTENDANCE TABLE (Optional - for future expansion)
-- Staff attendance tracking
-- ============================================
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staffId VARCHAR(20) NOT NULL COMMENT 'References staff.id',
    date DATE NOT NULL,
    checkIn TIME NULL,
    checkOut TIME NULL,
    status ENUM('Present', 'Leave', 'Absent', 'Half Day') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_staffId (staffId),
    INDEX idx_date (date),
    FOREIGN KEY (staffId) REFERENCES staff(id) ON DELETE CASCADE,
    UNIQUE KEY unique_staff_date (staffId, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. EQUIPMENT TABLE
-- Medical equipment tracking
-- JS Object: sampleEquipment[] = { id, name, status, department, lastService }
-- ============================================
CREATE TABLE IF NOT EXISTS equipment (
    id VARCHAR(20) PRIMARY KEY COMMENT 'Matches JS key: id',
    name VARCHAR(100) NOT NULL COMMENT 'Matches JS key: name',
    status ENUM('In Use', 'Under Repair', 'To Purchase') NOT NULL DEFAULT 'In Use' COMMENT 'Matches JS key: status',
    department VARCHAR(100) NOT NULL COMMENT 'Matches JS key: department',
    lastService DATE NULL COMMENT 'Matches JS key: lastService',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. TRANSACTIONS TABLE
-- Financial transaction records
-- JS Object: sampleTransactions[] = { id, date, type, description, amount }
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(20) PRIMARY KEY COMMENT 'Matches JS key: id',
    date DATE NOT NULL COMMENT 'Matches JS key: date',
    type ENUM('Equipment', 'Medicine', 'Revenue', 'Payroll', 'Other') NOT NULL COMMENT 'Matches JS key: type',
    description TEXT NOT NULL COMMENT 'Matches JS key: description',
    amount DECIMAL(12, 2) NOT NULL COMMENT 'Matches JS key: amount (positive=revenue, negative=expense)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. PAYROLL TABLE
-- Employee payroll records
-- JS Object: samplePayroll.{category}[] = { id, employeeId, name, role, baseSalary, bonus, deductions, netSalary }
-- Categories: doctors, nurses, management, technicians, others
-- ============================================
CREATE TABLE IF NOT EXISTS payroll (
    id VARCHAR(20) PRIMARY KEY COMMENT 'Matches JS key: id',
    employeeId VARCHAR(20) NOT NULL COMMENT 'Matches JS key: employeeId',
    name VARCHAR(100) NOT NULL COMMENT 'Matches JS key: name',
    role VARCHAR(100) NOT NULL COMMENT 'Matches JS key: role',
    category ENUM('doctors', 'nurses', 'management', 'technicians', 'others') NOT NULL COMMENT 'Payroll category',
    baseSalary DECIMAL(10, 2) NOT NULL COMMENT 'Matches JS key: baseSalary',
    bonus DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT 'Matches JS key: bonus',
    deductions DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT 'Matches JS key: deductions',
    netSalary DECIMAL(10, 2) GENERATED ALWAYS AS (baseSalary + bonus - deductions) STORED COMMENT 'Matches JS key: netSalary',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_employeeId (employeeId),
    INDEX idx_category (category),
    FOREIGN KEY (employeeId) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. BLOOD_STOCK TABLE
-- Blood inventory management
-- JS Object: sampleBloodStock[] = { type, units, donors }
-- ============================================
CREATE TABLE IF NOT EXISTS blood_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL UNIQUE COMMENT 'Matches JS key: type',
    units INT NOT NULL DEFAULT 0 COMMENT 'Matches JS key: units',
    donors INT NOT NULL DEFAULT 0 COMMENT 'Matches JS key: donors',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. ORGAN_INVENTORY TABLE (renamed from organs to match requirement)
-- Organ availability and waitlist
-- JS Object: sampleOrgans[] = { type, available, waitlist }
-- ============================================
CREATE TABLE IF NOT EXISTS organ_inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('Kidney', 'Liver', 'Heart', 'Lungs', 'Cornea') NOT NULL UNIQUE COMMENT 'Matches JS key: type',
    available INT NOT NULL DEFAULT 0 COMMENT 'Matches JS key: available',
    waitlist INT NOT NULL DEFAULT 0 COMMENT 'Matches JS key: waitlist',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. CERTIFICATES TABLE
-- Employee certificates and credentials
-- JS Object: sampleCertificates[] = { id, employeeId, name, certificate, issueDate, expiryDate, status }
-- ============================================
CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(20) PRIMARY KEY COMMENT 'Matches JS key: id',
    employeeId VARCHAR(20) NOT NULL COMMENT 'Matches JS key: employeeId',
    name VARCHAR(100) NOT NULL COMMENT 'Matches JS key: name',
    certificate VARCHAR(200) NOT NULL COMMENT 'Matches JS key: certificate',
    issueDate DATE NOT NULL COMMENT 'Matches JS key: issueDate',
    expiryDate DATE NOT NULL COMMENT 'Matches JS key: expiryDate',
    status ENUM('Valid', 'Expiring Soon', 'Expired') NOT NULL DEFAULT 'Valid' COMMENT 'Matches JS key: status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_employeeId (employeeId),
    INDEX idx_status (status),
    INDEX idx_expiryDate (expiryDate),
    FOREIGN KEY (employeeId) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 11. MEDICAL_RECORDS TABLE
-- Patient medical records database
-- JS Object: sampleRecords[] = { id, patientId, name, diagnosis, treatment, doctor, lastVisit }
-- ============================================
CREATE TABLE IF NOT EXISTS medical_records (
    id VARCHAR(20) PRIMARY KEY COMMENT 'Matches JS key: id',
    patientId VARCHAR(20) NOT NULL COMMENT 'Matches JS key: patientId',
    name VARCHAR(100) NOT NULL COMMENT 'Matches JS key: name',
    diagnosis TEXT NOT NULL COMMENT 'Matches JS key: diagnosis',
    treatment TEXT NOT NULL COMMENT 'Matches JS key: treatment',
    doctor VARCHAR(100) NOT NULL COMMENT 'Matches JS key: doctor',
    lastVisit DATE NOT NULL COMMENT 'Matches JS key: lastVisit',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patientId (patientId),
    INDEX idx_lastVisit (lastVisit),
    FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 12. TASKS TABLE
-- User task management
-- JS Object: userTasks[] = { description, dueDate, priority, completed }
-- Note: Adding id and userId for database management
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(20) NOT NULL COMMENT 'User who owns this task',
    description TEXT NOT NULL COMMENT 'Matches JS key: description',
    dueDate DATE NOT NULL COMMENT 'Matches JS key: dueDate',
    priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium' COMMENT 'Matches JS key: priority',
    completed BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Matches JS key: completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_userId (userId),
    INDEX idx_dueDate (dueDate),
    INDEX idx_completed (completed),
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SEED DATA (Sample data from original HTML)
-- ============================================

-- Insert sample users
INSERT INTO users (userId, password, role, name, access) VALUES
('CEO001', 'ceo@123', 'CEO', 'Dr. Sarah Johnson', '["dashboard", "patients", "staff", "transactions", "predictions", "inventory", "records", "certificates"]'),
('CFO001', 'cfo@123', 'CFO', 'Michael Chen', '["transactions"]'),
('CNO001', 'cno@123', 'CNO', 'Emily Davis', '["patients", "staff"]'),
('CMO001', 'cmo@123', 'CMO', 'Dr. Robert Williams', '["inventory"]'),
('CCO001', 'cco@123', 'CCO', 'Jennifer Martinez', '["certificates"]'),
('MRM001', 'mrm@123', 'MRM', 'David Thompson', '["records"]'),
('HR001', 'hr@123', 'HR', 'Human Resources Manager', '["dashboard", "patients", "staff", "transactions", "predictions", "inventory", "records", "certificates"]');

-- Insert sample patients
INSERT INTO patients (id, opd, name, aadhar, bloodGroup, caretaker, phone, status, admittedDate, transferredDate, dischargedDate, department, doctor, nurse) VALUES
('ADM001', 'OPD1001', 'John Smith', '1234-5678-9012', 'O+', 'Mary Smith', '555-0101', 'admitted', '2024-01-15', NULL, NULL, 'Cardiology', 'Dr. Amanda Foster', 'Nurse Sarah Wilson'),
('ADM002', 'OPD1002', 'Alice Brown', '2345-6789-0123', 'A+', 'Bob Brown', '555-0102', 'discharged', '2024-01-10', NULL, '2024-01-14', 'Neurology', 'Dr. Lisa Park', 'Nurse Emily Davis'),
('ADM003', 'OPD1003', 'Charlie Wilson', '3456-7890-1234', 'B+', 'Diana Wilson', '555-0103', 'transferred', '2024-01-12', '2024-01-15', NULL, 'Orthopedics → ICU', 'Dr. Robert Martinez', 'Nurse James Wilson'),
('ADM004', 'OPD1004', 'Eva Garcia', '4567-8901-2345', 'AB+', 'Frank Garcia', '555-0104', 'admitted', '2024-01-15', NULL, NULL, 'Pediatrics', 'Dr. Rachel Green', 'Nurse Maria Lopez'),
('ADM005', 'OPD1005', 'George Lee', '5678-9012-3456', 'O-', 'Helen Lee', '555-0105', 'critical', '2024-01-14', '2024-01-15', NULL, 'ICU', 'Dr. Amanda Foster', 'Nurse James Wilson');

-- Insert sample staff
INSERT INTO staff (id, name, department, shift, status) VALUES
('STF001', 'Dr. Amanda Foster', 'Cardiology', 'Day', 'Present'),
('STF002', 'Nurse James Wilson', 'ICU', 'Night', 'Present'),
('STF003', 'Dr. Lisa Park', 'Neurology', 'Day', 'Leave'),
('STF004', 'Tech Mike Brown', 'Radiology', 'Day', 'Present'),
('STF005', 'Dr. Rachel Green', 'Pediatrics', 'Night', 'Present');

-- Insert sample equipment
INSERT INTO equipment (id, name, status, department, lastService) VALUES
('EQ001', 'MRI Scanner', 'In Use', 'Radiology', '2024-01-01'),
('EQ002', 'Ventilator Unit A', 'Under Repair', 'ICU', '2023-12-15'),
('EQ003', 'X-Ray Machine', 'In Use', 'Radiology', '2024-01-10'),
('EQ004', 'Defibrillator B', 'To Purchase', 'Emergency', NULL),
('EQ005', 'ECG Monitor', 'In Use', 'Cardiology', '2024-01-05');

-- Insert sample transactions
INSERT INTO transactions (id, date, type, description, amount) VALUES
('TXN001', '2024-01-15', 'Equipment', 'MRI Maintenance', -15000.00),
('TXN002', '2024-01-15', 'Medicine', 'Monthly Medicine Stock', -45000.00),
('TXN003', '2024-01-14', 'Revenue', 'Patient Services', 125000.00),
('TXN004', '2024-01-14', 'Payroll', 'Staff Salaries', -280000.00),
('TXN005', '2024-01-13', 'Revenue', 'Lab Services', 35000.00);

-- Insert sample payroll (matching exact JS structure)
INSERT INTO payroll (id, employeeId, name, role, category, baseSalary, bonus, deductions) VALUES
-- Doctors
('PAY001', 'STF001', 'Dr. Amanda Foster', 'Cardiologist', 'doctors', 15000, 2000, 1500),
('PAY002', 'STF003', 'Dr. Lisa Park', 'Neurologist', 'doctors', 14000, 1500, 1200),
('PAY003', 'STF005', 'Dr. Rachel Green', 'Pediatrician', 'doctors', 13500, 1800, 1100),
-- Nurses
('PAY004', 'STF002', 'Nurse James Wilson', 'ICU Nurse', 'nurses', 5000, 500, 400),
-- Technicians
('PAY010', 'STF004', 'Tech Mike Brown', 'Radiology Tech', 'technicians', 4500, 300, 350);

-- Insert sample blood stock
INSERT INTO blood_stock (type, units, donors) VALUES
('A+', 45, 12),
('A-', 18, 5),
('B+', 32, 8),
('B-', 12, 3),
('AB+', 28, 7),
('AB-', 8, 2),
('O+', 55, 15),
('O-', 22, 6);

-- Insert sample organ inventory
INSERT INTO organ_inventory (type, available, waitlist) VALUES
('Kidney', 8, 45),
('Liver', 3, 28),
('Heart', 2, 15),
('Lungs', 4, 22),
('Cornea', 35, 12);

-- Insert sample certificates
INSERT INTO certificates (id, employeeId, name, certificate, issueDate, expiryDate, status) VALUES
('CERT001', 'STF001', 'Dr. Amanda Foster', 'Board Certified Cardiologist', '2020-06-15', '2025-06-15', 'Valid'),
('CERT002', 'STF002', 'Nurse James Wilson', 'RN License', '2019-03-20', '2024-03-20', 'Expiring Soon'),
('CERT003', 'STF003', 'Dr. Lisa Park', 'Neurology Specialist', '2021-08-10', '2026-08-10', 'Valid');

-- Insert sample medical records
INSERT INTO medical_records (id, patientId, name, diagnosis, treatment, doctor, lastVisit) VALUES
('REC001', 'ADM001', 'John Smith', 'Hypertension', 'Medication', 'Dr. Amanda Foster', '2024-01-15'),
('REC002', 'ADM002', 'Alice Brown', 'Migraine', 'Therapy', 'Dr. Lisa Park', '2024-01-14'),
('REC003', 'ADM004', 'Eva Garcia', 'Flu', 'Rest & Medication', 'Dr. Rachel Green', '2024-01-15');

-- ============================================
-- END OF SCHEMA
-- ============================================
