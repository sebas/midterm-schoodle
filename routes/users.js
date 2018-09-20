"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    console.log("we are here");
    knex
      .select("*")
      .from("users")
      .then((results) => {
        console.log("we are at the then", results);
        res.json(results);
    });
  });

  return router;
}
