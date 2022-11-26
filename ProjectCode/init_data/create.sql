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


-- this table links songs ids and their details to which users have them as a top song
CREATE TABLE usersToSongs(
    userID VARCHAR(50),
    songID VARCHAR(50),
    songName VARCHAR(100),
    artistName VARCHAR(100),
    albumName VARCHAR(100),
    albumArtURL VARCHAR(100)
);


CREATE TABLE lillian_songs(
    song VARCHAR(100),
    artist VARCHAR(50)
);


CREATE TABLE justin_songs(
    song VARCHAR(100),
    artist VARCHAR(50)
);