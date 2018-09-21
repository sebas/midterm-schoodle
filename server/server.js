"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require("morgan");
const knexLogger  = require("knex-logger");
const cookieParser = require("cookie-parser");

// Seperated Routes for each Resource
const usersRoutes = require("../routes/users");
const dataHelpers = require("./lib/data-helpers")();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, 
// yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(cookieParser())

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: "expanded"
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  console.log('Cookies: ', req.cookies);
  res.render("index");
});

app.get("/create", (req, res) => {
  console.log('Cookies: ', req.cookies);
  console.log('Query string: ', req.query.event_name);
  res.render("create", { event_name: req.query.event_name});
});

app.get("/create/options", (req, res) => {
  console.log('Cookies: ', req.cookies);
  console.log('Query string: ', req.query.event_name);
  res.render("createOptions", { event_name: req.query.event_name});
});

app.get("/create/initiator", (req, res) => {
  res.render("createInitiator");
});

app.post("/poll", (req, res) => {
  console.log(req.cookies,req.body);
  let newPoll = {
    event_details : JSON.parse(req.cookies.event_details),
    event_options : JSON.parse(req.cookies.event_options),
    organizer_details : req.body
  }
  console.log(newPoll);
  dataHelpers.savePoll(knex, newPoll);
  res.render("poll");
});

app.get("/poll/:id", (req, res) => {
  const super_secret_URL = req.params.id;
  const pollData = dataHelpers.getPoll(knex, super_secret_URL);
  res.render("poll", pollData);
});

app.listen(PORT, () => {
  console.log("Schoodle app listening on port " + PORT);
});
