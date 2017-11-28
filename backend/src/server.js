//dependencies
const express = require('express');
const morgan = require('morgan');
const loki = require('lokijs');
const SHA256 = require('crypto-js/sha256');
const uuidv1 = require('uuid/v1');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

var app = express();

var db = new loki(__dirname + '/friday.json', {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 1000
});

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.disable('etag');

app.use(cors());

function databaseInitialize() {
    var users = db.getCollection("users");
    var apps = db.getCollection("apps");
    if(users === null) {
        users = db.addCollection("users",{
            unique: ['name'],
            autoupdate: true
        });
    }
    if(apps === null) {
        apps = db.addCollection("apps", {
            unique: ['uuid'],
            autoupdate: true
        })
    }

    hasAdmin();
}

function hasAdmin(){
    var users = db.getCollection("users");
    var admin = users.find({name: "friday"});
    console.log('Am i loaded?, %s' + admin);
    if(admin.length === 0){
        const password = 'admin';
        const uuid = uuidv1();
        const hash = SHA256(password).toString();
        var newAdmin = users.insert({
            uuid: uuid,
            name: 'friday',
            password: hash,
            mendixApiKey: '',
            token: '',
        });
        console.log("Change the admin password ASAP!!");
        
        users.on("error", (errorDoc) => {
            if(errorDoc === newAdmin){
                console.log("We fucked up");
            }
        });

        startServer();
    } else {
        startServer();        
    }    
}

function startServer(){
    const approuter = require('./routers/app');
    const userrouter = require('./routers/user');
    const authrouter = require('./routers/auth');
    app.use('/api/v1/auth', authrouter(db));
    
    app.use((req, res, next) => {
        var token = req.headers["x-access-token"];
        console.log("I can haz token? " + token);
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
            console.log("No token found");
            res.status(401);
            res.json({
                success: false,
                message: 'No token provided'
            });
            res.send();
        }
    });
    app.use('/api/v1/apps', approuter(db));
    app.use('/api/v1/users', userrouter(db));

    app.listen(3001);
}
