const express = require('express');
const loki = require('lokijs');
var router = express.Router();

const db = new loki('./friday.db.json');
db.loadDatabase();

router.get('/', (req, res) => {

    var users = db.getCollection('users');
    console.log("I have: " + users + " users");

    res.send(users);
});

module.exports = router;