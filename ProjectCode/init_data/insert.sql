-- DUMMY DATA BELOW

-- creating some existing users
INSERT INTO users(userID, displayName, profilePicURL) VALUES
('lillianUserID', 'Lillian', 'https://i.postimg.cc/j27g7sCX/IMG-0692.jpg'),
('vikkiUserID', 'Vikki', 'https://i.postimg.cc/NfxM27tV/vikki.jpg'),
('justinUserID', 'Justin','https://i.postimg.cc/BQvWNxDR/justin.jpg'),
('lukUserID', 'Luk','https://i.postimg.cc/MG2Gfs4y/IMG-0942.jpg'),
('freddyUserID', 'Freddy','https://i.postimg.cc/xjcP8TzD/Don-Cheadle-UNEP-2011-cropped.jpg');

-- giving Lillian songs
INSERT INTO Songs_lillianUserID(songID, songName, artistName, albumName, albumArtURL) VALUES
('2t8yVaLvJ0RenpXUIAC52d', 'a lot', '21 Savage', 'i am > i was', 'https://upload.wikimedia.org/wikipedia/en/3/36/21_Savage_%E2%80%93_I_Am_Greater_Than_I_Was.png'),
('29TPjc8wxfz4XMn21O7VsZ', 'Sky', 'Playboi Carti', 'Whole Lotta Red', 'https://upload.wikimedia.org/wikipedia/en/6/6c/Playboi_Carti_-_Whole_Lotta_Red.png'),
('0uxSUdBrJy9Un0EYoBowng', '20 Min', 'Lil Uzi Vert', 'Luv Is Rage 2 (Deluxe)', 'https://upload.wikimedia.org/wikipedia/en/6/65/Luv_Is_Rage_2_cover.jpg'),
('7lAK3oHbfEnvUQWosrMMpR', 'YOSEMITE', 'Travis Scott', 'ASTROWORLD', 'https://upload.wikimedia.org/wikipedia/en/0/0b/Astroworld_by_Travis_Scott.jpg'),
('6glsMWIMIxQ4BedzLqGVi4', 'So Fresh, So Clean', 'Outkast', 'Stankonia', 'https://upload.wikimedia.org/wikipedia/en/0/0b/OutKast_-_Stankonia.JPG');

-- giving Vikki songs
INSERT INTO Songs_vikkiUserID(songID, songName, artistName, albumName, albumArtURL) VALUES
('2t8yVaLvJ0RenpXUIAC52d', 'a lot', '21 Savage', 'i am > i was', 'https://upload.wikimedia.org/wikipedia/en/3/36/21_Savage_%E2%80%93_I_Am_Greater_Than_I_Was.png'),
('0ciHz919LVKoH4zgxyMPZ9', 'I Knew You Were Trouble', 'Taylor Swift', 'Red (Deluxe Edition)', 'https://i.scdn.co/image/ab67616d00001e02a7613d346501b828b56a0bc3'),
('0iSWAT0EL8TwmzcgBjKMh6', 'What a Feeling', 'One Direction', 'Made In The A.M. (Deluxe Edition)', 'https://m.media-amazon.com/images/I/61-fEvQ70PL._SY580_.jpg'),
('2MA6YoaFF7fnWqkuOAWjUg', 'Tokyo Drifting', 'Glass Animals', 'Dreamland', 'https://upload.wikimedia.org/wikipedia/en/1/11/Dreamland_%28Glass_Animals%29.png'),
('3FtYbEfBqAlGO46NUDQSAt', 'Electric Feel', 'MGMT', 'Oracular Spectacular', 'https://upload.wikimedia.org/wikipedia/en/8/83/Oracular_Spectacular_2008.jpg');

-- giving Justin songs
INSERT INTO Songs_justinUserID(songID, songName, artistName, albumName, albumArtURL) VALUES
('2t8yVaLvJ0RenpXUIAC52d', 'a lot', '21 Savage', 'i am > i was', 'https://upload.wikimedia.org/wikipedia/en/3/36/21_Savage_%E2%80%93_I_Am_Greater_Than_I_Was.png'),
('0ciHz919LVKoH4zgxyMPZ9', 'I Knew You Were Trouble', 'Taylor Swift', 'Red (Deluxe Edition)', 'https://i.scdn.co/image/ab67616d00001e02a7613d346501b828b56a0bc3'),
('4ccQmBycgXDYtIA7Z1i32V', 'Daisy', 'Zedd', 'True Colors', 'https://upload.wikimedia.org/wikipedia/en/c/c9/Zedd-True-Colors.png'),
('50Zku6Q0VpwU5MyfDF1Y0Y', 'Again', 'Mako', 'Again', 'https://i.scdn.co/image/ab67616d00001e0242d56f78e22b448f55a060be'),
('5poevcmYCOZ8uZQnUuOPxC', 'Always', 'The Him', 'Always', 'https://i.scdn.co/image/edc768e13dcaae97e12a84ea47cb8c93ae76610d');

-- giving luk songs
INSERT INTO Songs_lukUserID(songID, songName, artistName, albumName, albumArtURL) VALUES
('2t8yVaLvJ0RenpXUIAC52d', 'a lot', '21 Savage', 'i am > i was', 'https://upload.wikimedia.org/wikipedia/en/3/36/21_Savage_%E2%80%93_I_Am_Greater_Than_I_Was.png'),
('0ciHz919LVKoH4zgxyMPZ9', 'I Knew You Were Trouble', 'Taylor Swift', 'Red (Deluxe Edition)', 'https://i.scdn.co/image/ab67616d00001e02a7613d346501b828b56a0bc3'),
('4ccQmBycgXDYtIA7Z1i32V', 'Daisy', 'Zedd', 'True Colors', 'https://upload.wikimedia.org/wikipedia/en/c/c9/Zedd-True-Colors.png'),
('0ubtINXSfA7mFoza07BBap', 'Ralphie', 'Post Animal', 'When I Think Of You In A Castle', 'https://i.scdn.co/image/ab67616d00001e0212580b7b2aa51152defd74fb'),
('2Ou3pX0dobop3JBAe8gzHt', 'Climax', 'Djo', 'DECIDE', 'https://i.scdn.co/image/ab67616d00001e02da27026597de2d0d940990d2');

-- giving Freddy songs
INSERT INTO Songs_freddyUserID(songID, songName, artistName, albumName, albumArtURL) VALUES
('2t8yVaLvJ0RenpXUIAC52d', 'a lot', '21 Savage', 'i am > i was', 'https://upload.wikimedia.org/wikipedia/en/3/36/21_Savage_%E2%80%93_I_Am_Greater_Than_I_Was.png'),
('0iSWAT0EL8TwmzcgBjKMh6', 'What a Feeling', 'One Direction', 'Made In The A.M. (Deluxe Edition)', 'https://m.media-amazon.com/images/I/61-fEvQ70PL._SY580_.jpg'),
('5poevcmYCOZ8uZQnUuOPxC', 'Always', 'The Him', 'Always', 'https://i.scdn.co/image/edc768e13dcaae97e12a84ea47cb8c93ae76610d'),
('2Ou3pX0dobop3JBAe8gzHt', 'Climax', 'Djo', 'DECIDE', 'https://i.scdn.co/image/ab67616d00001e02da27026597de2d0d940990d2'),
('0ciHz919LVKoH4zgxyMPZ9', 'I Knew You Were Trouble', 'Taylor Swift', 'Red (Deluxe Edition)', 'https://i.scdn.co/image/ab67616d00001e02a7613d346501b828b56a0bc3');


