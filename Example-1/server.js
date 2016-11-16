// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mysql = require("mysql");
var passport = require("passport")
var Strategy = require("passport-facebook").Strategy

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Setup MySQL Connection
var connection = mysql.createConnection({
  port: 3306,
  host: 'localhost',
  user: 'root',
  password: 'CodingRocks!',
  database: 'ahmedsdb'
});

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

// Sets up the Passport Authentication 
passport.use(new Strategy({
    clientID: process.env.CLIENT_ID || "1826103597601691",
    clientSecret: process.env.CLIENT_SECRET || "1c5d8736244d4ecadc89fe7c0384eff0",
    callbackURL: 'http://localhost:3002/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


// Routes
// =============================================================

// View the Main Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

// View the Main Page
app.get("/login", function(req, res) {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Login Facebook
app.get("/login/facebook", passport.authenticate("facebook"))

// Where to return to from facebook
app.get('/login/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),

  function(req, res) {
    res.redirect('/');
  });

// Get User's Message
app.get("/inbox", 

  function(req, res) {

      console.log(req.user)
      res.json(req.user);


  });


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
