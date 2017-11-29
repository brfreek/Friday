const express = require('express');
const loki = require('lokijs');
const axios = require('axios');

var router = express.Router();
const apiURL = "https://deploy.mendix.com/api/1/";

var db;

router.get('/', (req, res) => {
    //Get list of recipes
});

router.post('/', (req, res) => {
    //Create new recipe
});

router.put('/', (req, res) => {
    //Update existing recipe
});
router.delete('/', (req, res) => {
    //Delete existing recipe
});

module.exports = function(database) {
    db = database;

    return router;
}