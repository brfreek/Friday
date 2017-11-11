//dependencies
const express = require('express');
const morgan = require('morgan');
const loki = require('lokijs');
const axiom = require('axiom');
const SHA256 = require('crypto-js/sha256');
const uuidv1 = require('uuid/v1');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Configure LokiDB and start service after DB is initialized
const db = new loki('./friday.db.json',{
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: false
});

function databaseInitialize(){
    var users = db.getCollection("users");

    if(users === null){
        users = db.addCollection("users");
    }
    hasAdmin();
}

function hasAdmin(){
    var users = db.getCollection("users");
    var admin = users.find({name: 'friday'});
    console.log(admin);
    if(admin.length === 0){
        const password = 'admin';
        const uuid = uuidv1();
        const hash = SHA256(password).toString();
        users.insert({
            uuid: uuid,
            name: 'friday',
            password: hash,
            token: ''
        });
        console.log("Change the admin password ASAP!!");
        db.saveDatabase();
        startServer();
    } else {
        startServer();        
    }
}

function startServer(){
    const approuter = require('./routers/app');
    const userrouter = require('./routers/user');
    const authrouter = require('./routers/auth');
    app.use('/api/v1/auth', authrouter);
    app.use((req, res, next) => {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if(token){
            jwt.verify(token, require('./helper/secret'), (err, decoded) => {
                if(err){
                    res.status(401);
                    res.json({success: false, message: 'Failed to authenticate'});
                    res.send();
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(401);
            res.json({
                success: false,
                message: 'No token provided'
            });
            res.send();
        }
    });
    app.use('/api/v1/apps', approuter);
    app.use('/api/v1/users', userrouter);

    app.listen(3001);
}
