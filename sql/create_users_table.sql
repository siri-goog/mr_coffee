DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    user_id serial PRIMARY KEY, 
    firstname VARCHAR(50) NOT NULL, 
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL);