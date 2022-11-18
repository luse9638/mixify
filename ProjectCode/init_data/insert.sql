INSERT INTO users(userID, displayName, profilePicURL) VALUES
('j2kv8kg9gf92g21kld992hd', 'Lillian', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'),
('82jfoei2f093hg934hdf93h', 'Vicki', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'),
('93hgk2hfiy29thf83hf93jd', 'Justin','https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');


INSERT INTO friends(userID, friendUserID) VALUES
('lillian', 'luke'),
('luke', 'lillian');

INSERT INTO lillian_songs(song, artist) VALUES
('Butterfly Effect', 'Travvy Scott'),
('Yosemite', 'Travvy Scott'),
('You Only Live Once', 'The Strokes');

INSERT INTO justin_songs(song, artist) VALUES
('Instant Crush', 'Daft Punk'),
('Butterfly Effect', 'Travvy Scott'),
('Equinox', 'Hotel Pools');