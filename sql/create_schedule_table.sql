DROP TABLE IF EXISTS schedules;

CREATE TABLE IF NOT EXISTS schedules (
    schedule_id serial PRIMARY KEY, 
    user_id INTEGER NOT NULL, 
    day INTEGER NOT NULL,
    start_at TIME NOT NULL,
    end_at TIME NOT NULL);