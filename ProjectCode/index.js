
// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const pgp = require('pg-promise')();

// defining the Express app
const app = express();


// set the view engine to ejs
app.set("view engine", "ejs");
// using bodyParser to parse JSON in the request body into JS objects
app.use(bodyParser.json());

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

app.listen(3000, () => {
    console.log('listening on port 3000');
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
    