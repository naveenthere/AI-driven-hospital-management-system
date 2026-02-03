-- Dashboard Seed Data
-- Populates beds, emergency queue, and surgeries to match dashboard metrics

-- Seed beds data (200 total beds: 20 ICU + 180 General)
-- ICU: 18 occupied, 2 available (90% occupancy)
-- General: 138 occupied, 42 available
-- Total: 156 occupied, 44 available (78% occupancy)

-- ICU Beds (20 total, 18 occupied)
INSERT INTO beds (bed_number, department, status, is_icu, patient_id) VALUES
('ICU-001', 'ICU', 'occupied', TRUE, 'ADM001'),
('ICU-002', 'ICU', 'occupied', TRUE, 'ADM002'),
('ICU-003', 'ICU', 'occupied', TRUE, 'ADM003'),
('ICU-004', 'ICU', 'occupied', TRUE, 'ADM004'),
('ICU-005', 'ICU', 'occupied', TRUE, 'ADM005'),
('ICU-006', 'ICU', 'occupied', TRUE, NULL),
('ICU-007', 'ICU', 'occupied', TRUE, NULL),
('ICU-008', 'ICU', 'occupied', TRUE, NULL),
('ICU-009', 'ICU', 'occupied', TRUE, NULL),
('ICU-010', 'ICU', 'occupied', TRUE, NULL),
('ICU-011', 'ICU', 'occupied', TRUE, NULL),
('ICU-012', 'ICU', 'occupied', TRUE, NULL),
('ICU-013', 'ICU', 'occupied', TRUE, NULL),
('ICU-014', 'ICU', 'occupied', TRUE, NULL),
('ICU-015', 'ICU', 'occupied', TRUE, NULL),
('ICU-016', 'ICU', 'occupied', TRUE, NULL),
('ICU-017', 'ICU', 'occupied', TRUE, NULL),
('ICU-018', 'ICU', 'occupied', TRUE, NULL),
('ICU-019', 'ICU', 'available', TRUE, NULL),
('ICU-020', 'ICU', 'available', TRUE, NULL);

-- General Ward Beds (180 total, 138 occupied, 42 available)
-- Cardiology (30 beds, 24 occupied)
INSERT INTO beds (bed_number, department, status, is_icu) VALUES
('CARD-001', 'Cardiology', 'occupied', FALSE),
('CARD-002', 'Cardiology', 'occupied', FALSE),
('CARD-003', 'Cardiology', 'occupied', FALSE),
('CARD-004', 'Cardiology', 'occupied', FALSE),
('CARD-005', 'Cardiology', 'occupied', FALSE),
('CARD-006', 'Cardiology', 'occupied', FALSE),
('CARD-007', 'Cardiology', 'occupied', FALSE),
('CARD-008', 'Cardiology', 'occupied', FALSE),
('CARD-009', 'Cardiology', 'occupied', FALSE),
('CARD-010', 'Cardiology', 'occupied', FALSE),
('CARD-011', 'Cardiology', 'occupied', FALSE),
('CARD-012', 'Cardiology', 'occupied', FALSE),
('CARD-013', 'Cardiology', 'occupied', FALSE),
('CARD-014', 'Cardiology', 'occupied', FALSE),
('CARD-015', 'Cardiology', 'occupied', FALSE),
('CARD-016', 'Cardiology', 'occupied', FALSE),
('CARD-017', 'Cardiology', 'occupied', FALSE),
('CARD-018', 'Cardiology', 'occupied', FALSE),
('CARD-019', 'Cardiology', 'occupied', FALSE),
('CARD-020', 'Cardiology', 'occupied', FALSE),
('CARD-021', 'Cardiology', 'occupied', FALSE),
('CARD-022', 'Cardiology', 'occupied', FALSE),
('CARD-023', 'Cardiology', 'occupied', FALSE),
('CARD-024', 'Cardiology', 'occupied', FALSE),
('CARD-025', 'Cardiology', 'available', FALSE),
('CARD-026', 'Cardiology', 'available', FALSE),
('CARD-027', 'Cardiology', 'available', FALSE),
('CARD-028', 'Cardiology', 'available', FALSE),
('CARD-029', 'Cardiology', 'available', FALSE),
('CARD-030', 'Cardiology', 'available', FALSE);

-- Neurology (30 beds, 23 occupied)
INSERT INTO beds (bed_number, department, status, is_icu)
SELECT CONCAT('NEUR-', LPAD(n, 3, '0')), 'Neurology', 
       IF(n <= 23, 'occupied', 'available'), FALSE
FROM (SELECT @row := @row + 1 as n FROM 
      (SELECT 0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
      (SELECT 0 UNION SELECT 1 UNION SELECT 2) t2,
      (SELECT @row := 0) r
      LIMIT 30) numbers;

-- Orthopedics (30 beds, 22 occupied)
INSERT INTO beds (bed_number, department, status, is_icu)
SELECT CONCAT('ORTH-', LPAD(n, 3, '0')), 'Orthopedics', 
       IF(n <= 22, 'occupied', 'available'), FALSE
FROM (SELECT @row := @row + 1 as n FROM 
      (SELECT 0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
      (SELECT 0 UNION SELECT 1 UNION SELECT 2) t2,
      (SELECT @row := 0) r
      LIMIT 30) numbers;

-- Pediatrics (30 beds, 25 occupied)
INSERT INTO beds (bed_number, department, status, is_icu)
SELECT CONCAT('PEDI-', LPAD(n, 3, '0')), 'Pediatrics', 
       IF(n <= 25, 'occupied', 'available'), FALSE
FROM (SELECT @row := @row + 1 as n FROM 
      (SELECT 0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
      (SELECT 0 UNION SELECT 1 UNION SELECT 2) t2,
      (SELECT @row := 0) r
      LIMIT 30) numbers;

-- General Medicine (60 beds, 44 occupied)
INSERT INTO beds (bed_number, department, status, is_icu)
SELECT CONCAT('GEN-', LPAD(n, 3, '0')), 'General', 
       IF(n <= 44, 'occupied', 'available'), FALSE
FROM (SELECT @row := @row + 1 as n FROM 
      (SELECT 0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
      (SELECT 0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t2,
      (SELECT @row := 0) r
      LIMIT 60) numbers;

-- Emergency Queue (7 waiting patients)
INSERT INTO emergency_queue (patient_name, triage_level, status, arrival_time) VALUES
('Emergency Patient 1', 'critical', 'waiting', DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
('Emergency Patient 2', 'urgent', 'waiting', DATE_SUB(NOW(), INTERVAL 12 MINUTE)),
('Emergency Patient 3', 'urgent', 'waiting', DATE_SUB(NOW(), INTERVAL 10 MINUTE)),
('Emergency Patient 4', 'semi-urgent', 'waiting', DATE_SUB(NOW(), INTERVAL 8 MINUTE)),
('Emergency Patient 5', 'urgent', 'waiting', DATE_SUB(NOW(), INTERVAL 5 MINUTE)),
('Emergency Patient 6', 'non-urgent', 'waiting', DATE_SUB(NOW(), INTERVAL 3 MINUTE)),
('Emergency Patient 7', 'semi-urgent', 'waiting', DATE_SUB(NOW(), INTERVAL 1 MINUTE));

-- Surgeries scheduled for today (5 total: 3 completed, 2 ongoing)
INSERT INTO surgeries (patient_id, surgery_type, scheduled_date, scheduled_time, status, surgeon) VALUES
('ADM001', 'Appendectomy', CURDATE(), '08:00:00', 'completed', 'Dr. Amanda Foster'),
('ADM002', 'Knee Replacement', CURDATE(), '09:30:00', 'completed', 'Dr. Robert Martinez'),
('ADM003', 'Cataract Surgery', CURDATE(), '11:00:00', 'completed', 'Dr. Lisa Park'),
('ADM004', 'Hernia Repair', CURDATE(), '13:00:00', 'in_progress', 'Dr. Amanda Foster'),
('ADM005', 'Gallbladder Removal', CURDATE(), '15:00:00', 'in_progress', 'Dr. Rachel Green');
