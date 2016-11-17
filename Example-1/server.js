var express = require('express');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var path = require('path');


// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
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


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());



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

      console.log("HELLO");
      console.log(req.user)
      res.json(req.user);


  });


// Starts the server to begin listening
// =============================================================
var PORT = process.env.PORT || 3002;
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
