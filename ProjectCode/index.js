
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

  
app.listen(3000, () => {
  console.log('listening on port 3000');
});

