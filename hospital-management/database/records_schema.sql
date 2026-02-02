-- Medical Records Schema
DROP TABLE IF EXISTS medical_records;

CREATE TABLE medical_records (
    id VARCHAR(20) PRIMARY KEY,
    patient_id VARCHAR(20) NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    diagnosis VARCHAR(255),
    treatment VARCHAR(255),
    doctor VARCHAR(100),
    last_visit DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_patient_id (patient_id),
    INDEX idx_patient_name (patient_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
