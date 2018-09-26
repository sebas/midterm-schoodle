"use strict";

const express = require("express");
const dataHelpersRequireDB = require("../server/lib/data-helpers");

const router  = express.Router();


module.exports = (knex) => {
  const dataHelpers = dataHelpersRequireDB(knex);

  router.get("/events/pollOptions/:id", (req, res) => {
    const event_id = req.params.id;
    dataHelpers.getPollOptions(event_id, (eventOptionsArray) => {
      if (eventOptionsArray) {
        res.status(200).json(eventOptionsArray);
      } else {
        res.status(500).send('we fukd')
      }
    });
  });

  router.get("/events/:optionId/participants", (req,res) => {
    const event_option_id = req.params.optionId;
    dataHelpers.getParticipantsForOption(event_option_id, (participants) => {
      res.status(200).json(participants);
    });
  });

  router.get("/votes/:id", (req, res) =>{
    dataHelpers.getVotes(req.params.id, (votes) => {
      res.status(200).json(votes);
    });
  });

  return router;
};
