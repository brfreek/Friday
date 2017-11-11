//dependencies
const express = require('express');
const loki = require('lokijs');
const axiom = require('axiom');
const bcrypt = require('bcrypt');

var app = express();

//src
const approuter = require('./routers/app');

app.use('/api/v1/apps', approuter);

app.get('/', (req, res) => {
    console.log("Received request");
});

app.listen(3001);