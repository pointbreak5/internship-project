CREATE DATABASE dashboarddb;

-- Connect to dashboarddb

CREATE TABLE aircraft (
    id SERIAL PRIMARY KEY,
    aircraft_name VARCHAR(100),
    status VARCHAR(30),
    date DATE,
    duration VARCHAR(30),
    aircraft_count INT
);

INSERT INTO aircraft (
    aircraft_name,
    status,
    date,
    duration,
    aircraft_count
)
VALUES (
    'Mark 15',
    'Completed',
    '2026-07-11',
    '45 mins',
    4
);

CREATE TABLE performance (
    id SERIAL PRIMARY KEY,
    accuracy INT,
    efficiency INT
);

INSERT INTO performance (
    accuracy,
    efficiency
)
VALUES (
    88,
    58
);

--objective assessment
CREATE TABLE objective_assessment (
    id SERIAL PRIMARY KEY,
    objective VARCHAR(100),
    weight VARCHAR(10),
    status VARCHAR(20),
    score VARCHAR(20)
);
-- values
INSERT INTO objective_assessment (objective, weight, status, score)
VALUES
('Detect Target', '30%', 'COMPLETED', '18/20'),
('Maintain EMCON', '20%', 'PARTIAL', '12/20'),
('Detect Target', '30%', 'COMPLETED', '30/30');

--instruction summary
CREATE TABLE instructor_summary (
    summary_id SERIAL PRIMARY KEY,
    mission_id INT,

    operational_awareness INT CHECK (operational_awareness BETWEEN 1 AND 5),
    tactical_decision_making INT CHECK (tactical_decision_making BETWEEN 1 AND 5),
    communication INT CHECK (communication BETWEEN 1 AND 5),
    roe_compliance INT CHECK (roe_compliance BETWEEN 1 AND 5),

    instructor_comments TEXT,

    instructor_name VARCHAR(100)
);
--values
INSERT INTO instructor_summary
(
    mission_id,
    operational_awareness,
    tactical_decision_making,
    communication,
    roe_compliance,
    instructor_comments,
    instructor_name
)
VALUES
(
    1,
    4,
    3,
    5,
    4,
    'Good overall performance. Strong in contact classification and convoy protection. Need improvement in EMCON discipline and timely threat reporting.',
    'LCDR A. Sharma'
);

--update comment
UPDATE instructor_summary
SET instructor_comments = 'Excellent mission execution. Maintain better communication during high-threat situations.'
WHERE summary_id = 1;

--communication review
CREATE TABLE communication_log (
    log_id SERIAL PRIMARY KEY,
    timestamp TIME,
    sender VARCHAR(30),
    receiver VARCHAR(30),
    message TEXT,
    status VARCHAR(20)
);

INSERT INTO communication_log
(timestamp, sender, receiver, message, status)
VALUES
('14:02:15','AWACS','Eagle-1','Bogey detected 80 NM','Delivered'),

('14:03:47','Eagle-1','Formation','Fox-3 launched','Delivered'),

('14:04:21','Falcon-2','Eagle-1','Defensive left','Delayed'),

('14:05:32','Eagle-1','AWACS','Splash confirmed','Delivered');

--mission timeline
CREATE TABLE mission_timeline (
    timeline_id SERIAL PRIMARY KEY,
    event_time TIME,
    event_name VARCHAR(100),
    description TEXT,
    status VARCHAR(20)
);

INSERT INTO mission_timeline
(event_time, event_name, description, status)
VALUES
('09:00:00','Takeoff','Aircraft departed from base','info'),

('09:08:00','Target Detected','AWACS detected hostile aircraft','info'),

('09:12:00','Radar Lock','Target locked successfully','warning'),

('09:18:00','Fox-3 Launch','AIM-120 missile launched','success'),

('09:19:00','Missile Active','Missile entered terminal guidance','info'),

('09:22:00','Splash Confirmed','Hostile aircraft destroyed','success'),

('09:25:00','RTB','Aircraft returning to base','info'),

('09:35:00','Mission Complete','Mission ended successfully','success');