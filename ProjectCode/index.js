const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');


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

// app.get('/', (req, res) => {
//     res.send("test all is well");
// });


app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
    })
  );
  
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

app.listen(3000);
console.log('Server is listening on port 3000');

app.get('/', (req, res) =>{
    res.redirect('/login'); //this will call the /login route in the API
  });


app.get('/login', (req, res) =>{
    res.render('pages/login');
});
  

app.get('/register', (req, res) => {
    res.render('pages/register');
});


// Register login
app.post('/register', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = `insert into users (username, password) values ($1, $2);`

    db.any(query, [
        req.body.username,
        hash
    ])
    .then(function(data)
    {
        res.redirect('/login');
    })
    .catch(function(err) {
        res.redirect('/register');
    })
    //the logic goes here
  });


app.post('/login', async (req, res) =>{
    const query = `select password from users where username = '${req.body.username}';`

    db.any(query)
    .then(async user =>
    {
        const match = await bcrypt.compare(req.body.password, user[0].password); 

        if(match)
        {
          req.session.user = {
            api_key: process.env.API_KEY,
          };
          req.session.save();
          res.redirect('/discover');        
        }
        else
        {
          // message.log (using message.ejs)
          message.log ('Incorrect username or password.');
          res.redirect('/register', {error: 'Incorrect username or password.'});
        }

    })
    .catch(err => {
      console.log(err);
      res.redirect('/login');
    })
});


// Authentication Middleware.
const auth = (req, res, next) => {
    if (!req.session.user) {
      // Default to register page.
      return res.redirect('/register');
    }
    next();
  };
  
  // Authentication Required
  app.use(auth);


app.get('/discover', (req, res) =>{
    axios({
         url: `https://app.ticketmaster.com/discovery/v2/events.json`,
            method: 'GET',
            dataType:'json',
            params: {
                "apikey": req.session.user.api_key,
                "keyword": "Elton John", //you can choose any artist/event here
                // "size": 1
            }
         })
         .then(results => {
            console.log(results.data); // the results will be displayed on the terminal if the docker containers are running
            res.render('pages/discover', {
              error: false,
              results: results.data._embedded.events
            });
            // how to send the data ?
         })
         .catch(error => {
            res.render('pages/discover', {results: [], error: true, message: error});
            // If the API call fails, render pages/discover with an empty results array results: [] and the error message.
         })
    });


app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/login'); //this will call the /login route in the API
    message.log("logged out successfully"); 
    });
