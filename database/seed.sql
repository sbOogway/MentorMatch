-- SEED: USERS

-- ADMIN
INSERT INTO users (full_name, email, password_hash, role)
VALUES
('Admin User', 'admin@example.com', '$2b$10$KqzB8QyHHCqB6FDLW7N1GuVQz.hG5OxRjIr/xJzqP2sJ7iI5UZkC2', 'admin');

INSERT INTO users (full_name, email, password_hash, role)
VALUES
('Mario Rossi',  'mentor1@example.com',  'hashedpassword', 'mentor'),
('Luca Bianchi', 'mentor2@example.com',  'hashedpassword', 'mentor'),
('Giulia Verdi', 'mentee1@example.com',  'hashedpassword', 'mentee'),
('Anna Russo',   'mentee2@example.com',  'hashedpassword', 'mentee');

-- SEED: MENTOR PROFILES

INSERT INTO mentor_profiles (user_id, bio, sectors, languages, meeting_link_template)
SELECT id,
       'Esperto di sviluppo software con 10 anni di esperienza.',
       ARRAY['Software', 'Backend'],
       ARRAY['it','en'],
       'https://zoom.us/mentor1'
FROM users WHERE email = 'mentor1@example.com';

INSERT INTO mentor_profiles (user_id, bio, sectors, languages, meeting_link_template)
SELECT id,
       'Senior data scientist specializzato in machine learning.',
       ARRAY['Data', 'ML'],
       ARRAY['it','en'],
       'https://meet.google.com/mentor2'
FROM users WHERE email = 'mentor2@example.com';

-- SEED: AVAILABILITY SLOTS

-- MENTOR 1 – 2 slot
INSERT INTO availability_slots (mentor_id, start_time, end_time)
SELECT mp.id,
       NOW() + INTERVAL '1 day 10 hours',
       NOW() + INTERVAL '1 day 10 hours 30 minutes'
FROM mentor_profiles mp
JOIN users u ON mp.user_id = u.id
WHERE u.email = 'mentor1@example.com';

INSERT INTO availability_slots (mentor_id, start_time, end_time)
SELECT mp.id,
       NOW() + INTERVAL '1 day 11 hours',
       NOW() + INTERVAL '1 day 11 hours 30 minutes'
FROM mentor_profiles mp
JOIN users u ON mp.user_id = u.id
WHERE u.email = 'mentor1@example.com';


-- MENTOR 2 – 2 slot
INSERT INTO availability_slots (mentor_id, start_time, end_time)
SELECT mp.id,
       NOW() + INTERVAL '2 days 14 hours',
       NOW() + INTERVAL '2 days 14 hours 30 minutes'
FROM mentor_profiles mp
JOIN users u ON mp.user_id = u.id
WHERE u.email = 'mentor2@example.com';

INSERT INTO availability_slots (mentor_id, start_time, end_time)
SELECT mp.id,
       NOW() + INTERVAL '2 days 15 hours',
       NOW() + INTERVAL '2 days 15 hours 30 minutes'
FROM mentor_profiles mp
JOIN users u ON mp.user_id = u.id
WHERE u.email = 'mentor2@example.com';


INSERT INTO bookings (slot_id, mentor_id, mentee_id, meeting_link, status)
SELECT 
    s.id,
    s.mentor_id,
    (SELECT id FROM users WHERE email='mentee1@example.com'),
    'https://zoom.us/meeting-test',
    'confirmed'
FROM availability_slots s
JOIN mentor_profiles mp ON mp.id = s.mentor_id
JOIN users u2 ON mp.user_id = u2.id
WHERE u2.email = 'mentor1@example.com'
ORDER BY s.start_time
LIMIT 1;

-- SEED: MARK BOOKING AS COMPLETED


UPDATE bookings
SET status = 'completed'
WHERE ctid IN (
  SELECT ctid FROM bookings WHERE status='confirmed' LIMIT 1
);


INSERT INTO reviews (booking_id, mentor_id, mentee_id, rating, comment)
SELECT 
    b.id,
    b.mentor_id,
    b.mentee_id,
    5,
    'Sessione eccellente, molto utile!'
FROM bookings b
ORDER BY b.created_at
LIMIT 1;
