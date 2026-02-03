-- ============================================
-- FINANCE MODULE SEED DATA (UPDATED - Using Existing Staff)
-- ============================================

-- Note: Transactions table already has data, adding more sample transactions
-- Type must be one of: 'Equipment','Medicine','Revenue','Payroll','Other'

-- Insert additional sample transactions
INSERT INTO transactions (id, date, type, description, amount) VALUES
('TXN011', '2026-02-01', 'Revenue', 'Patient Consultation Fees', 45000.00),
('TXN012', '2026-02-01', 'Medicine', 'Medical Supplies Purchase', -28000.00),
('TXN013', '2026-01-31', 'Revenue', 'Emergency Services', 62000.00),
('TXN014', '2026-01-30', 'Revenue', 'Surgical Procedures', 85000.00),
('TXN015', '2026-01-29', 'Other', 'Monthly Electricity Bill', -12000.00)
ON DUPLICATE KEY UPDATE id=id;

-- Insert Payroll Records for February 2026 (using existing staff IDs)
-- Doctors
INSERT INTO payroll_records (id, employee_id, employee_name, category, role, base_salary, bonus, deductions, period_month, period_year) VALUES
('PAY001', 'STF001', 'Dr. Amanda Foster', 'doctors', 'Cardiologist', 15000.00, 2000.00, 1500.00, 2, 2026),
('PAY002', 'STF003', 'Dr. Lisa Park', 'doctors', 'Neurologist', 14000.00, 1500.00, 1200.00, 2, 2026),
('PAY003', 'STF005', 'Dr. Rachel Green', 'doctors', 'Pediatrician', 13500.00, 1800.00, 1100.00, 2, 2026),
('PAY016', 'STF009', 'Dr. Robert Martinez', 'doctors', 'General Physician', 13000.00, 1600.00, 1050.00, 2, 2026)
ON DUPLICATE KEY UPDATE id=id;

-- Nurses
INSERT INTO payroll_records (id, employee_id, employee_name, category, role, base_salary, bonus, deductions, period_month, period_year) VALUES
('PAY004', 'STF002', 'Nurse James Wilson', 'nurses', 'ICU Nurse', 5000.00, 500.00, 400.00, 2, 2026),
('PAY005', 'STF006', 'Nurse Sarah Wilson', 'nurses', 'Staff Nurse', 4800.00, 450.00, 380.00, 2, 2026),
('PAY006', 'STF007', 'Nurse Emily Davis', 'nurses', 'Senior Nurse', 5200.00, 600.00, 420.00, 2, 2026),
('PAY017', 'STF008', 'Nurse Maria Lopez', 'nurses', 'Staff Nurse', 4700.00, 400.00, 370.00, 2, 2026)
ON DUPLICATE KEY UPDATE id=id;

-- Technicians
INSERT INTO payroll_records (id, employee_id, employee_name, category, role, base_salary, bonus, deductions, period_month, period_year) VALUES
('PAY010', 'STF004', 'Tech Mike Brown', 'technicians', 'Radiology Tech', 4500.00, 300.00, 350.00, 2, 2026),
('PAY011', 'STF010', 'Tech Anna Lee', 'technicians', 'Lab Technician', 4200.00, 250.00, 320.00, 2, 2026),
('PAY012', 'STF011', 'Tech David Kim', 'technicians', 'X-Ray Technician', 4600.00, 350.00, 360.00, 2, 2026)
ON DUPLICATE KEY UPDATE id=id;

-- Others (Support Staff)
INSERT INTO payroll_records (id, employee_id, employee_name, category, role, base_salary, bonus, deductions, period_month, period_year) VALUES
('PAY013', 'STF012', 'Support John Martinez', 'others', 'Security Guard', 3500.00, 200.00, 280.00, 2, 2026),
('PAY014', 'STF013', 'Support Maria Santos', 'others', 'Janitor', 3200.00, 150.00, 250.00, 2, 2026),
('PAY015', 'STF014', 'Support Robert Taylor', 'others', 'Receptionist', 3800.00, 250.00, 300.00, 2, 2026)
ON DUPLICATE KEY UPDATE id=id;

-- Management (using existing staff with adjusted roles for display)
INSERT INTO payroll_records (id, employee_id, employee_name, category, role, base_salary, bonus, deductions, period_month, period_year) VALUES
('PAY007', 'STF001', 'Dr. Amanda Foster', 'management', 'Chief Medical Officer', 25000.00, 5000.00, 2500.00, 2, 2026),
('PAY008', 'STF003', 'Dr. Lisa Park', 'management', 'Medical Director', 20000.00, 4000.00, 2000.00, 2, 2026),
('PAY009', 'STF012', 'Support John Martinez', 'management', 'Operations Manager', 12000.00, 1500.00, 1000.00, 2, 2026)
ON DUPLICATE KEY UPDATE id=id;
