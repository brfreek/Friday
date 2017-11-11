//dependencies
const express = require('express');
const loki = require('lokijs');
const axiom = require('axiom');
const bcrypt = require('bcrypt');
const prompt = require('prompt');
const uuidv1 = require('uuid/v1');

var app = express();

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
    startServer();
}

function hasAdmin(){
    var users = db.getCollection("users");
    var admin = users.find({name: 'friday'});
    console.log(admin);
    if(admin.length === 0){
        prompt.start();

        prompt.get(['adminPassword'], function(err, result){
            if(result.adminPassword.length > 0){
                const uuid = new uuidv1();
                const saltRounds = 10;
                bcrypt.hash(result.adminPassword, saltRounds, function(err, hash){
                    if(!err){
                        users.insert({
                            uuid: uuid,
                            name: 'friday',
                            password: hash
                        });
                        db.saveDatabase();   
                    }
                })
            }
        });

    }
}

function startServer(){
    const approuter = require('./routers/app');
    const userrouter = require('./routers/user');
    app.use('/api/v1/apps', approuter);
    app.use('/api/v1/users', userrouter);

    app.get('/', (req, res) => {
        console.log("Received request");
    });

    app.listen(3001);
}
