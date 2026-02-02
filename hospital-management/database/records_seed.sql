-- Seed Data for Medical Records
INSERT INTO medical_records (id, patient_id, patient_name, diagnosis, treatment, doctor, last_visit) VALUES
('REC001', 'ADM001', 'John Smith', 'Hypertension', 'Medication', 'Dr. Amanda Foster', '2024-01-15'),
('REC002', 'ADM002', 'Alice Brown', 'Migraine', 'Therapy', 'Dr. Lisa Park', '2024-01-14'),
('REC003', 'ADM004', 'Eva Garcia', 'Flu', 'Rest & Medication', 'Dr. Rachel Green', '2024-01-15')
ON DUPLICATE KEY UPDATE 
    patient_name=VALUES(patient_name),
    diagnosis=VALUES(diagnosis),
    treatment=VALUES(treatment),
    doctor=VALUES(doctor),
    last_visit=VALUES(last_visit);
