CREATE TABLE users(
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

CREATE TABLE friends(
    username VARCHAR(50),
    friend_username VARCHAR(50)
);