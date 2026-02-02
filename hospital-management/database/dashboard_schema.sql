-- Dashboard Schema: Beds, Emergency Queue, and Surgeries
-- This schema supports computed dashboard metrics

-- Beds tracking table
DROP TABLE IF EXISTS beds;
CREATE TABLE beds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bed_number VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(100),
    status ENUM('occupied', 'available', 'maintenance') DEFAULT 'available',
    patient_id VARCHAR(20),
    is_icu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_icu (is_icu),
    INDEX idx_patient (patient_id)
);

-- Emergency queue table
DROP TABLE IF EXISTS emergency_queue;
CREATE TABLE emergency_queue (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_name VARCHAR(255) NOT NULL,
    arrival_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    triage_level ENUM('critical', 'urgent', 'semi-urgent', 'non-urgent') DEFAULT 'urgent',
    status ENUM('waiting', 'in_treatment', 'completed') DEFAULT 'waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_arrival (arrival_time)
);

-- Surgeries schedule table
DROP TABLE IF EXISTS surgeries;
CREATE TABLE surgeries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(20),
    surgery_type VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    surgeon VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (scheduled_date),
    INDEX idx_status (status),
    INDEX idx_patient (patient_id)
);
