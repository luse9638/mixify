CREATE TABLE users(
    username VARCHAR(50) PRIMARY KEY,
);

CREATE TABLE friends(
    username VARCHAR(50),
    friend_username VARCHAR(50)
);

CREATE TABLE allUsersAllSongs(
    username VARCHAR(50),
    song_name VARCHAR(50)
);