"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8081;
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
app.use(cookieParser());

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
  res.render("create", { event_name: req.query.event_name});
});

app.get("/create/options", (req, res) => {
  res.render("createOptions", { event_name: req.query.event_name});
});

app.get("/create/initiator", (req, res) => {
  res.render("createInitiator");
});

app.post("/poll", (req, res) => {
  const event_details = JSON.parse(req.cookies.event_details);
  const event_options = JSON.parse(req.cookies.event_options);
  const organizer_details = req.body;
  const newPoll = {
    event_details, 
    event_options,
    organizer_details,
  }
  dataHelpers.savePoll(knex, newPoll, (id, super_secret_URL) => {
    console.log('url', super_secret_URL)
    res.render("poll", { 
      title: newPoll.event_details.event_name, 
      place: newPoll.event_details.event_location, 
      note: newPoll.event_details.event_note,
      organizer_email: newPoll.organizer_details.email,
      organizer_name: newPoll.organizer_details.name,
      event_id: id,
      super_secret_URL
    });
  });
});

app.post("/vote", (req, res) => {
  console.log("request in vote post is",req.body);
  const newVote = {
    event_id: req.body.event_id,
    event_option_id: req.body.option,
    username: req.body.username,
    email: req.body.email,
    super_secret_URL: req.body.super_secret_URL
  };
  dataHelpers.saveVote(knex,newVote,()=>{
    console.log('are you running', req.body.super_secret_URL);
    res.send("/poll/" + req.body.super_secret_URL);
  })

  // const event_details = JSON.parse(req.cookies.event_details);
  // const event_options = JSON.parse(req.cookies.event_options);
  // const organizer_details = req.body;
  // const newPoll = {
  //   event_details,
  //   event_options,
  //   organizer_details,
  // }
  // dataHelpers.savePoll(knex, newPoll, (id, super_secret_URL) => {
  //   console.log('url', super_secret_URL)
  //   res.render("poll", {
  //     title: newPoll.event_details.event_name,
  //     place: newPoll.event_details.event_location,
  //     note: newPoll.event_details.event_note,
  //     organizer_email: newPoll.organizer_details.email,
  //     organizer_name: newPoll.organizer_details.name,
  //     event_id: id,
  //     super_secret_URL
  //   });
  // });
});

app.get("/poll/:id", (req, res) => {
  const super_secret_URL = req.params.id;
  dataHelpers.getPoll(knex, super_secret_URL, (pollData) => {
    const { title, place, note, organizer_name, organizer_email, event_id } = pollData[0]
    const option1 = { option_text: pollData[0].option_text, event_option_id: pollData[0].event_option_id }
    const option2 = { option_text: pollData[1].option_text, event_option_id: pollData[1].event_option_id }
    res.render("poll", { title, place, note, organizer_name, organizer_email, option1, option2, super_secret_URL, event_id });
  });
});

app.get("/api/events/pollOptions/:id", (req, res) => {
  const event_id = req.params.id;
  dataHelpers.getPollOptions(knex, event_id, (eventOptionsArray) => {
    if (eventOptionsArray) {
      res.status(200).json(eventOptionsArray);
    } else {
      res.status(500).send('we fukd')
    };
  })
})

app.get("/api/events/:optionId/participants", (req,res) => {
  const event_option_id = req.params.optionId;
  dataHelpers.getParticipantsForOption(knex, event_option_id, (participants) => {
    res.status(200).json(participants);
  });
});

app.get("/api/votes/:id", (req, res) =>{
  dataHelpers.getVotes(knex, req.params.id, (votes) => {
    console.log('these are the votes in /api/votes/', votes);
    res.status(200).json(votes)
  })
});
app.listen(PORT, () => {
  console.log("Schoodle app listening on port " + PORT);
});
