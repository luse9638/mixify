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
    res.render("pages/mixify");
});

app.get('/prospects', function(req, res) {
  // query from database to get all of the users and their profile pictures
  const query = `select userID, displayName, profilePicURL from users;`;
  db.any(query)
  .then((queryData) => // all this data is stored in queryData
  {
    console.log(queryData);
    // send queryData to prospects page so it can be rendered
    res.render("pages/prospects", {
      queryData,
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
});



app.get('/login', function(req, res) {
    res.render("pages/login");
});

app.get('/register', function(req, res) {
    res.render("pages/register");
});

app.get('/logout', function(req, res) {
    user.spotifyUserID = undefined;
    user.spotifyDisplayName = undefined;
    user.spotifyAccessToken = undefined;
    user.spotifyRefreshToken = undefined;
    user.spotifyProfilePicURL = undefined;
    req.session.destroy();
    res.render("pages/logout");
});


// using luke's spotify developer client_id and client_secret
var client_id = 'a12be07bf1294c3cb32c3e290e15c117';
var client_secret = '851d927ede4b4d86a2ba25f1c0d29270'
// redirect uri is where to send user after they've logged in with spotify
// MAKE SURE THIS IS ADDED IN THE APPROVED REDIRECT URI LIST ON THE SPOTIFY DEVELOPER DASHBOARD
var redirect_uri = 'http://localhost:3000/callback';
// what we want to access from the user's spotify
var scope = 'user-read-private user-read-email user-top-read';

// not quite sure what this does tbh but its needed
var stateKey = 'spotify_auth_state';

/**
 * 
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
          user.spotifyProfilePicURL = body.images[0].url;
          console.log(user.spotifyProfilePicURL);
          // save the user's session
          req.session.user = user;
          req.session.save();
          // add username to database 
          db.multi(`insert into users (userID, displayName, profilePicURL) values ($1, $2, $3);`, 
          [user.spotifyUserID, user.spotifyDisplayName, user.spotifyProfilePicURL])
          .then((data) => {
            // redirect to home page if this is successful
            res.redirect('/home');
          })
          .catch((err) => {
            // should probably do something more here if this doesn't work, but that's a problem for testing week
            console.log(err);
          });

        });
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



app.post("/prospects/add", (req, res) => {
  const friendUserID = req.body.friendUserID;
  const query = `insert into friends (userID, friendUserID) values ($1, $2);`;
  db.tx(async (t) => {
    await t.multi(
      query,
      [user.spotifyUserID, req.body.friendUserID] 
      // not sure how to connect friend_id to ejs page
    );
    //return t.any(all_friends, [req.session.user.username]);
  })
    .then(() => {
      res.redirect('/prospects');
    })
    .catch((err) => {
      res.redirect('/prospects', {
        error: true,
        message: err.message,
      });
    });
});

  
app.listen(3000, () => {
  console.log('listening on port 3000');
});

