// Various Dependencies
var express = require("express");
var passport = require("passport");
var Strategy = require("passport-facebook").Strategy;
var path = require("path");

// Incorporate MySQL
var mysql = require("mysql");

// Connection Info for MySQL DB
var connection = mysql.createConnection({
  port: 3306,
  host: "localhost",
  user: "root",
  password: "CodingRocks!",
  database: "ahmedsdb"
});

// Connect to MySQL DB
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Passport / Facebook Authentication Information
passport.use(new Strategy({
  clientID: process.env.CLIENT_ID || "1826103597601691",
  clientSecret: process.env.CLIENT_SECRET || "1c5d8736244d4ecadc89fe7c0384eff0",
  callbackURL: "http://localhost:3002/login/facebook/return"
},
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user"s Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application"s database, which
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
//
// If the above doesn"t make sense... don"t worry. I just copied and pasted too.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new express application.
var app = express();

// Incorporated a variety of Express packages.
app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("express-session")({ secret: "keyboard cat", resave: true, saveUninitialized: true }));

// Here we start our Passport process and initiate the storage of sessions (i.e. closing browser maintains user)
app.use(passport.initialize());
app.use(passport.session());


// Routes
// =============================================================

// View the Main Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

// View the Login Page
app.get("/login", function(req, res) {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Initiate the Facebook Authentication
app.get("/login/facebook", passport.authenticate("facebook"));

// When Facebook is done, it uses the below route to determine where to go
app.get("/login/facebook/return",
  passport.authenticate("facebook", { failureRedirect: "/login" }),

  function(req, res) {
    res.redirect("/inbox");
  });

// This page is available for viewing a hello message
app.get("/inbox",
  require("connect-ensure-login").ensureLoggedIn(),
  function(req, res) {

    res.sendFile(path.join(__dirname, "inbox.html"));

  });

// This route is available for retrieving the information associated with the authentication method
app.get("/api/inbox",
  require("connect-ensure-login").ensureLoggedIn(),
  function(req, res) {

    var queryString = "SELECT * FROM table_of_users WHERE user_id=" + req.user.id;
    connection.query(queryString, function(err, data) {
      if (err) throw err;

      console.log(data);

      req.json(data);

    });

  });


// Starts the server to begin listening
// =============================================================
var PORT = process.env.PORT || 3002;
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
