// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mysql = require("mysql");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Routes
// =============================================================

// View the Main Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "view.html"));
});

// User Login (Check Credentials)
app.post("/login", function(req, res){
  body = req.body;
  res.json(req.body)
})

// Get User's Message
app.get("/inbox", function(req, res) {
  res.sendFile(path.join(__dirname, "add.html"));
});



// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
