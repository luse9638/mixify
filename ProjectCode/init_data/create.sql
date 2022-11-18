-- In order for this file and insert.sql to be run when the database initializes, you need
-- to remove all volumes first, which can be done with docker compose down --volumes
-- then, next time that docker compose up is run these files will be run

-- this is the table of all users, identified by their unique userID, with their display name and profile pic also stored
CREATE TABLE users(
    userID VARCHAR(50),
    displayName VARCHAR(50),
    profilePicURL VARCHAR(100)
);

-- this table links userIDs that are friends
CREATE TABLE friends(
    userID VARCHAR(50),
    friendUserID VARCHAR(50)
);

-- this table links users to which songs they like
CREATE TABLE allUsersAllSongs(
    userID VARCHAR(50),
    songName VARCHAR(50)
);