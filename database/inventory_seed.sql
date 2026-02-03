-- Seed Data for Blood Stock
INSERT INTO blood_stock (blood_type, units, donors) VALUES
('A+', 45, 12),
('A-', 18, 5),
('B+', 32, 8),
('B-', 12, 3),
('AB+', 28, 7),
('AB-', 8, 2),
('O+', 55, 15),
('O-', 22, 6)
ON DUPLICATE KEY UPDATE units=VALUES(units), donors=VALUES(donors);

-- Seed Data for Organ Stock
INSERT INTO organ_stock (organ_type, available, waitlist) VALUES
('Kidney', 8, 45),
('Liver', 3, 28),
('Heart', 2, 15),
('Lungs', 4, 22),
('Cornea', 35, 12)
ON DUPLICATE KEY UPDATE available=VALUES(available), waitlist=VALUES(waitlist);

-- Seed Data for Donors
INSERT INTO donors (name, blood_group, contact, address, last_donation, status, donation_type) VALUES
('James Anderson', 'O+', '555-0201', '123 Oak Street', '2024-01-10', 'Eligible', 'Blood'),
('Maria Garcia', 'A-', '555-0202', '456 Pine Avenue', '2023-12-28', 'Waiting', 'Blood'),
('Robert Kim', 'B+', '555-0203', '789 Elm Road', '2024-01-05', 'Eligible', 'Blood');
