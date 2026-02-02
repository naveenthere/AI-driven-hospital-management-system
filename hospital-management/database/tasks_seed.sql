INSERT INTO tasks (description, due_date, priority, completed) VALUES
('Review weekly staff roster', CURDATE() + INTERVAL 1 DAY, 'high', FALSE),
('Order surplus bandages', CURDATE() + INTERVAL 3 DAY, 'low', FALSE),
('Schedule maintenance for MRI machine', CURDATE() + INTERVAL 7 DAY, 'medium', FALSE);
