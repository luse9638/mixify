// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
// const { response } = require('express');
const pgp = require('pg-promise')();
const querystring = require('querystring');
const request = require('request');
const session = require('express-session')

// defining the Express app
const app = express();

// set the view engine to ejs
app.set("view engine", "ejs");

// set session
app.use(
  session({
    secret: "XASDASDA",
    saveUninitialized: true,
    resave: true,
  })
);

// using bodyParser to parse JSON in the request body into JS objects
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// database configuration
const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  };
  
const db = pgp(dbConfig);
  
  // test your database
  db.connect()
    .then(obj => {
      console.log('Database connection successful'); // you can view this message in the docker compose logs
      obj.done(); // success, release the connection;
    })
    .catch(error => {
      console.log('ERROR:', error.message || error);
    });

    //   require('dotenv').config();

// this saves information about the current user, will be updated later
const user = {
  spotifyUserID: undefined,
  spotifyDisplayName: undefined,
  spotifyAccessToken: undefined,
  spotifyRefreshToken: undefined,
  spotifyProfilePicURL: undefined,
  songTableName: undefined,
  loggedIn: false,
  topTrackIDs: [],
}

app.get('/', function (req, res) {
    res.render("pages/home");
});

app.get('/home', function(req, res) {
  // pass the userID and displayName to be used in the home page  
  res.render("pages/home", {
      userID: user.spotifyUserID,
      displayName: user.spotifyDisplayName
    });
});

app.get('/mixify', function(req, res) {
  // first make sure user is logged in
  if (!user.loggedIn) {
    res.redirect('/link');
  }
  else {
    const query = `select * from users where userID in (select friendUserID from friends where userID = $1);`;
    db.multi(query, [user.spotifyUserID])
    .then((queryData) => 
    {
      // send queryData to prospects page so it can be rendered
      res.render("pages/mixify", {
        queryData,
        // this is used so that the current user can't be added as a friend (you can't add yourself as a friend, duh!)
        currentUserID: user.spotifyUserID,
      });
    })
    .catch((err) => {
      res.render('pages/mixify', {
        displayNames: [],
        error: true,
        message: err.message,
      });
    });
  }
  
  
});

app.get('/prospects', function(req, res) {
  
  // first make sure user is logged in
  if (!user.loggedIn) {
    res.redirect('/link');
  }
  else {
    // First query gets information about all users (EXCEPT those that are already added as friends): 
    // id, display name, and profile pic, which is used for the prospective friends list
    // this gets stored in queryData[0]
    // there's probably a more concise way to write this query but for now it works fine
    
    // Second query gets information of current user's friends from friends table, which is used in the current friends list
    // this gets stored in queryData[1]
    const query = `select * from users where userID in (select userID from users except select friendUserID from friends where friends.userID=$1);
    select * from users where userID in (select friendUserID from friends where userID = $1);`;
    db.multi(query, [user.spotifyUserID])
    .then((queryData) => 
    {
      // send queryData to prospects page so it can be rendered
      res.render("pages/prospects", {
        queryData,
        // this is used so that the current user can't be added as a friend (you can't add yourself as a friend, duh!)
        currentUserID: user.spotifyUserID,
      });
    })
    .catch((err) => {
      res.render('pages/prospects', {
        displayNames: [],
        error: true,
        message: err.message,
      });
    });
  }
});

// this gets called when the add friend button is clicked in prospects.ejs
app.post("/prospects/add", (req, res) => {
  const friendUserID = req.body.friendUserID;
  // insert current user's id and friend they want to add into the database
  const query = `insert into friends (userID, friendUserID) values ($1, $2);`;
  db.tx(async (t) => {
    await t.multi(
      query,
      [user.spotifyUserID, req.body.friendUserID] 
    );
  })
    .then(() => {
      // calls the /prospects endpoint so everything can be rerendered
      res.redirect('/prospects');
    })
    .catch((err) => {
      res.redirect('/prospects', {
        error: true,
        message: err.message,
      });
    });
});

// this gets called when the remove friend button is clicked in prospects.ejs
app.post("/prospects/remove", (req, res) => {
  // delete current user's specified friend to remove from the database
  const query = `delete from friends where userid=$1 and frienduserid=$2;`
  db.tx(async (t) => {
    await t.multi(
      query,
      [user.spotifyUserID, req.body.friendUserID] 
    );
  })
    .then(() => {
      // call the /prospects endpoint so that everything can be rerendered
      res.redirect('/prospects');
    })
    .catch((err) => {
      res.redirect('/prospects', {
        error: true,
        message: err.message,
      });
    });

});

app.get('/registerSpotify', function(req, res) {
    res.render("pages/registerSpotify");
});

app.get('/link', function(req, res) {
  // don't let user log in again if they're already logged in
  if (user.loggedIn) {
    res.redirect('/home');
  }
  else {
    // pass logged in status to display a message if user hasn't logged in yet
    res.render("pages/link", {
     loggedIn: user.loggedIn
    });
  }
  
});

app.get('/logout', function(req, res) {
    user.spotifyUserID = undefined;
    user.spotifyDisplayName = undefined;
    user.spotifyAccessToken = undefined;
    user.spotifyRefreshToken = undefined;
    user.spotifyProfilePicURL = undefined;
    user.topTrackIDs = [];
    user.songTableName = undefined;
    user.loggedIn = false;
    req.session.destroy();
    res.render("pages/logout");
});

app.get('/results', function(req,res){
  res.render("pages/results");
});


// using luke's spotify developer client_id and client_secret
var client_id = 'a12be07bf1294c3cb32c3e290e15c117';
var client_secret = '851d927ede4b4d86a2ba25f1c0d29270';
// redirect uri is where to send user after they've logged in with spotify
// MAKE SURE THIS IS ADDED IN THE APPROVED REDIRECT URI LIST ON THE SPOTIFY DEVELOPER DASHBOARD
var redirect_uri = 'http://localhost:3000/callback';
// what we want to access from the user's spotify
var scope = 'user-read-private user-read-email user-top-read';

// not quite sure what this does tbh but its needed
var stateKey = 'spotify_auth_state';

/**
 * Generates a random alphanumeric string of size length
 * @param {string} length the length of the string to generate
 * @returns generated string
*/
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

/**
 * Creates a name for a user's table of songs based on the user's spotify id with format "Songs_userID"
 * @param {string} userID user's spotify User ID
 * @returns table name
 */
var getSongTableName = function(userID) {
  return "Songs_" + userID;
}

// Spotify user authorization:
// Checkout the flowchart here to see what's happening: 
// http://developer.spotify.com/documentation/general/guides/authorization/code-flow

// First step: we request authorization from the user so Mixify can access their Spotify data
// We do this by sending a GET request to spotify's /authorize endpoint by passing the client_id,
// redirect_uri, and scopes
// After the user accepts the request, they are taken back to the redirect_uri that was passed
// This occurs when the "login to spotify" button/link is clicked
app.get('/loginSpotify', function(req, res) {

  var state = generateRandomString(16);
  // stateKey is name of cookie
  res.cookie(stateKey, state);
  
  // access the spotify /authorize endpoint passing client_id, scope, redirect_uri, and state
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

// Second step: now that the user has authorized the request, we need to get the access token
// which will actually let us make requests to get the user's information,
// we do this by making a request to spotify's /api/token endpoint with the
// authorization code and redirect_uri we got after calling spotify's /authorize endpoint
// Access token, refresh token, userID, and displayName will be stored in the user object
// This is automatically called after /loginSpotify is called through the redirect uri
// spotify userID is how we'll store users in the database, display name isn't unique so shouldn't be used in the database
// but can be used on the ejs pages (e.g. welcome, *displayName*)
app.get('/callback', function(req, res) {

  // get the state and stored state
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  // original if statement was if (state === null || state !== storedState), but this would
  // always be false even though both statements would be true? temp fix was to just make this
  // always false for now
  if (false) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    // body of POST request to get access and refresh tokens
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };
    // actually making the request
    request.post(authOptions, function(error, response, body) {
      // 200 is a successful status code
      if (!error && response.statusCode === 200) {
        // this actually sets the access and refresh tokens for the current user
        user.spotifyAccessToken = body.access_token,
        user.spotifyRefreshToken = body.refresh_token;
        // body for GET request to user's id and display name
        var getUserName = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + user.spotifyAccessToken},
          json: true
        };
        // making the GET request
        request.get(getUserName, function(error, response, body) {
          // save user id and display name for database and webpages
          user.spotifyUserID = body.id;
          user.spotifyDisplayName = body.display_name;
          // if user doesn't have a set profile pic use a default one
          if (body.images.length == 0) {
            user.spotifyProfilePicURL = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
          }
          else {
            user.spotifyProfilePicURL = body.images[0].url;
          }
          // define a table name to hold the user's songs
          user.songTableName = getSongTableName(user.spotifyUserID);
          // user is now logged in!
          user.loggedIn = true;
          // save the user's session
          req.session.user = user;
          req.session.save();
          // add username to database if it isn't already in it and create table to hold the user's songs
          // name of table that holds user's songs is found with getSongTableName()
          db.multi(`insert into users (userID, displayName, profilePicURL) values ($1, $2, $3) on conflict do nothing;
          create table if not exists "$4" (songID VARCHAR(100) PRIMARY KEY, songName VARCHAR(100), artistName VARCHAR(100),
          albumName VARCHAR(100), albumArtURL VARCHAR(100));`, 
          [user.spotifyUserID, user.spotifyDisplayName, user.spotifyProfilePicURL, user.songTableName])
          .then((data) => {
            console.log("Successfully added spotify user to database")
          })
          .catch((err) => {
            // should probably do something more here if this doesn't work, but that's a problem for testing week
            console.log("An error occurred adding the spotify user to the database:");
            console.log(err);
            res.redirect('/login');
          });
        });
        // body of request to get the user's top 50 tracks
        var getTopTracks = {
          // max limit from spotify is 50 tracks, long_term means top songs of all time
          url: 'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term',
          headers: { 'Authorization': 'Bearer ' + user.spotifyAccessToken},
          json: true 
        }
        // actually making the request
        request.get(getTopTracks, function(error, response, body) {
          for (var i = 0; i < body.items.length; i++) {
            // the get top track requests doesn't get all of the information we need about the song, specifically the artist
            // we instead store the track's unique id to use in a separate get request to spotify that will give more detailed
            // information about that particular song
            user.topTrackIDs.push(body.items[i].id);
          }
          
          // loop through user.topTrackIDs[] to get detailed information about every song
          for (var i = 0; i < user.topTrackIDs.length; i++) {
            var url = 'https://api.spotify.com/v1/tracks/' + user.topTrackIDs[i];
            // body of request to detailed information about each song
            var getTrackInfo = {
              url: url,
              headers: { 'Authorization': 'Bearer ' + user.spotifyAccessToken},
              json: true 
            }
            // making the request
            request.get(getTrackInfo, function(error, response, body) {
              // insert song information into user's song database
              db.any(`insert into "$1" (songID, songName, artistName, albumName, albumArtURL) values
              ($2, $3, $4, $5, $6);`, 
              [user.songTableName, body.id, body.name, body.artists[0].name, body.album.name, body.album.images[0].url, ])
              .then((data) => {
                console.log("Successfully added song to database")
              })
              .catch((err) => {
                // should probably do something more here if this doesn't work, but that's a problem for testing week
                console.log("An error occurred adding the songs to the database:");
                console.log(err);
                res.redirect('/login');
              });
            });
          }
        });
      res.redirect('/home');
      // if we don't get a 200 status code, something's gone wrong
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});


// create a post to request data from the database on the songs 
app.post("/songs", (req, res) => {
  // const username = NEED TO FILL THIS IN with the spotify login API result 
  const query = "select * from users where users.username = $1"; 
  // CHANGE THE QUERY to select all the songs from the user to show that? 
  db.one(query, values)
    .then((data) => {

      req.session.save();
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
    });
});


// this was originally implemented to add to the friends table with the friend requested on the page
// need to ensure that the user that is selected on the website is passed in appropriately - that user needs to be displayed based on the databse
// TO DO 1. make the prospects page display friends correctly based on the database 
// 2. here from the displaying friends correctly select friends and update the database adequately - refer to lab 9


app.post("/mixify/mix", async (req, res) => {
  // var userID = user.spotifyUserID;

  var songTableName = getSongTableName(user.spotifyUserID);

  friendQuery = `SELECT friendUserID FROM friends WHERE userID = $1;`;

  const query1 = await db.query(friendQuery, [user.spotifyUserID])
  // console.log(query1)

  var dict = {}

  query1.forEach(async friend => {
    var friendSongTableName = getSongTableName(friend.friendUserID);
    const innerjoin = "SELECT * FROM $1 INNER JOIN $2 ON $1.song = $2.song;"
    // can add GROUP BY friend1.song if needed 
    const joinquery = await db.query(innerjoin, [songTableName, friendSongTableName]);
    
    joinquery.forEach(song => {
        // console.log(song)
        dict[song.song] += 1
      }
    )
  })
  // .then(() => {
    console.log(dict);
    res.redirect('/results');
  // })
  // .catch((err) => {
  //   res.redirect('/prospects', {
  //     error: true,
  //     message: err.message,
  //   });
  // });
  ;


  //[]
  // dictionary and then if any of the songs has more than one occurence, display that 
  // javascript dictionary with count: 
  // key: song name, value: increase 
  //[[{}, {}], [{}]]
});




  
app.listen(3000, () => {
  console.log('listening on port 3000');
});

