-- Staff & Resources Module - Seed Data
-- Created: 2026-02-02
-- This data matches the existing UI values from allmodule_ver4.html

-- Insert staff members
REPLACE INTO staff (id, name, department, shift, status, role) VALUES
('STF001', 'Dr. Amanda Foster', 'Cardiology', 'Day', 'Present', 'Doctor'),
('STF002', 'Nurse James Wilson', 'ICU', 'Night', 'Present', 'Nurse'),
('STF003', 'Dr. Lisa Park', 'Neurology', 'Day', 'Leave', 'Doctor'),
('STF004', 'Tech Mike Brown', 'Radiology', 'Day', 'Present', 'Technician'),
('STF005', 'Dr. Rachel Green', 'Pediatrics', 'Night', 'Present', 'Doctor'),
('STF006', 'Nurse Sarah Wilson', 'Cardiology', 'Day', 'Present', 'Nurse'),
('STF007', 'Nurse Emily Davis', 'Neurology', 'Night', 'Present', 'Nurse'),
('STF008', 'Nurse Maria Lopez', 'Pediatrics', 'Day', 'Present', 'Nurse'),
('STF009', 'Dr. Robert Martinez', 'Orthopedics', 'Day', 'Present', 'Doctor'),
('STF010', 'Tech Anna Lee', 'Laboratory', 'Day', 'Present', 'Technician'),
('STF011', 'Tech David Kim', 'Radiology', 'Night', 'Present', 'Technician'),
('STF012', 'Support John Martinez', 'Security', 'Night', 'Present', 'Support'),
('STF013', 'Support Maria Santos', 'Housekeeping', 'Day', 'Present', 'Support'),
('STF014', 'Support Robert Taylor', 'Reception', 'Day', 'Present', 'Support');

-- Insert bed status for different wards
INSERT INTO beds (ward_type, total_beds, occupied_beds) VALUES
('General Ward', 50, 38),
('ICU', 20, 15),
('Pediatric', 30, 22);

-- Insert equipment records
INSERT INTO equipment (id, name, department, status, last_service) VALUES
('EQ001', 'MRI Scanner', 'Radiology', 'In Use', '2024-01-01'),
('EQ002', 'Ventilator Unit A', 'ICU', 'Under Repair', '2023-12-15'),
('EQ003', 'X-Ray Machine', 'Radiology', 'In Use', '2024-01-10'),
('EQ004', 'Defibrillator B', 'Emergency', 'To Purchase', NULL),
('EQ005', 'ECG Monitor', 'Cardiology', 'In Use', '2024-01-05'),
('EQ006', 'Ultrasound Machine', 'Radiology', 'In Use', '2024-01-08'),
('EQ007', 'CT Scanner', 'Radiology', 'In Use', '2023-12-20'),
('EQ008', 'Ventilator Unit B', 'ICU', 'In Use', '2024-01-12');
