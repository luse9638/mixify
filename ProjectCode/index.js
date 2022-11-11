
// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const pgp = require('pg-promise')();
const querystring = require('querystring');

// defining the Express app
const app = express();


// set the view engine to ejs
app.set("view engine", "ejs");
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

app.get('/', function (req, res) {
    res.render("pages/register");
});

app.get('/home', function(req, res) {
    res.render("pages/home");
});

app.get('/mixify', function(req, res) {
    res.render("pages/mixify");
});

app.get('/prospects', function(req, res) {
    res.render("pages/prospects");
});

app.get('/login', function(req, res) {
    res.render("pages/login");
});

app.get('/register', function(req, res) {
    res.render("pages/register");
});

app.get('/logout', function(req, res) {
    res.render("pages/logout");
});

//spotify auth, currently linked to a button in register.ejs
//state var should probably be a randomly generated string of length 16
//required querystring to make it work
var client_id = '8ed5339bc3e6483f8ab02a378e93a136';
var redirect_uri = 'http://localhost:3000/home';

app.get('/loginSpotify', function(req, res) {

  // var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: "asfklaslkjhsak"
    }));
});



// CHANGES: created a post login to submit information like username
// will probably need to replace with the spotify API but for now
app.post("/login", (req, res) => {
  const username = req.body.username;
  const query = "select * from users where users.username = $1";

  db.one(query, values)
    .then((data) => {
      user.username = username;
      req.session.user = user;
      req.session.save();

      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
    });
});


app.get("/login", function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = "user-read-private user-read-email user-top-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});




// not tested yet but this should add to the friends table with the friend requested 
const all_friends = `
  SELECT friends.friend_username
  WHERE friends.username = $1
  FROM friends;
  `;

app.post("/prospects/add", (req, res) => {
  const username = req.body.username;
  db.tx(async (t) => {
    await t.none(
      "INSERT INTO friends(username, friend_username) VALUES ($1, $2);",
      [username, req.session.user.friend_username] 
      // not sure how to connect friend_id to ejs page
    );
    return t.any(all_friends, [req.session.user.username]);
  })
    .then(() => {
      res.render("pages/prospects", {
        message: `Successfully added friend ${req.body.friend_username}`,
      });
    })
    .catch((err) => {
      res.render("pages/prospects", {
        error: true,
        message: err.message,
      });
    });
});

  
app.listen(3000, () => {
  console.log('listening on port 3000');
});

