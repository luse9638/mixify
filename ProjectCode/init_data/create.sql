-- In order for this file and insert.sql to be run when the database initializes, you need
-- to remove all volumes first, which can be done with docker compose down --volumes
-- then, next time that docker compose up is run these files will be run

-- this is the table of all users, identified by their unique userID, with their display name and profile pic also stored
CREATE TABLE users(
    userID VARCHAR(50) PRIMARY KEY,
    displayName VARCHAR(50),
    profilePicURL VARCHAR(100)
);

-- this table links userIDs that are friends
CREATE TABLE friends(
    userID VARCHAR(50),
    friendUserID VARCHAR(50)
);

-- format for song tables for each user
-- CREATE TABLE Songs_userID(
--     songID VARCHAR(100) PRIMARY KEY,
--     songName VARCHAR(100),
--     artistName VARCHAR(100),
--     albumName VARCHAR(100),
--     albumArtURL VARCHAR(100)
-- );


-- DUMMY DATA BELOW

-- Lillian's song table
CREATE TABLE Songs_lillianUserID(
    songID VARCHAR(100) PRIMARY KEY,
    songName VARCHAR(100),
    artistName VARCHAR(100),
    albumName VARCHAR(100),
    albumArtURL VARCHAR(100)
);

-- Vikki's song table
CREATE TABLE Songs_vikkiUserID(
    songID VARCHAR(100) PRIMARY KEY,
    songName VARCHAR(100),
    artistName VARCHAR(100),
    albumName VARCHAR(100),
    albumArtURL VARCHAR(100)
);

-- Justin's song table
CREATE TABLE Songs_justinUserID(
    songID VARCHAR(100) PRIMARY KEY,
    songName VARCHAR(100),
    artistName VARCHAR(100),
    albumName VARCHAR(100),
    albumArtURL VARCHAR(100)
);

-- luk's song table
CREATE TABLE Songs_lukUserID(
    songID VARCHAR(100) PRIMARY KEY,
    songName VARCHAR(100),
    artistName VARCHAR(100),
    albumName VARCHAR(100),
    albumArtURL VARCHAR(100)
);
-- Freddy's song table
CREATE TABLE Songs_freddyUserID(
    songID VARCHAR(100) PRIMARY KEY,
    songName VARCHAR(100),
    artistName VARCHAR(100),
    albumName VARCHAR(100),
    albumArtURL VARCHAR(100)
);