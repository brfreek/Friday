const express = require('express');
const loki = require('lokijs');

var router = express.Router();
var db = new loki('./friday.db.json');
db.loadDatabase();

router.get('/', (req, res) => {

});

module.exports = router;