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