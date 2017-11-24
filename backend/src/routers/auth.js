const express = require('express');
const loki = require('lokijs');
const SHA256 = require('crypto-js/sha256');
const jwt = require('jsonwebtoken');

const secret = require('../helper/secret.js');

const router = express.Router();

var db;

router.post('/', (req, res) => {
    if(req.body){

        var users = db.getCollection('users');
        console.log(users);
        console.log(JSON.stringify(req.body));
        if(users === null || users.length === 0){
            res.status(404);
            res.json({
                error: 'users not found'
            });
            res.send();
        } else {
            const hash = SHA256(req.body.password).toString();
            console.log("hash: " + hash);
            var user = users.find({name: req.body.name, password: hash});
            console.log(user);
            if(user !== null && user.length > 0){
                user = user[0];
                const expires = Math.floor(Date.now() / 1000) + (60 * 60);
                var token = jwt.sign({
                    exp: expires,
                    data: req.body.uuid + '' + req.body.password
                }, secret);

                user.token = token;
                user.tokenExpires = expires;
                users.update(user);
                db.saveDatabase();

                res.status(200);
                res.json(user);
                res.send();
            } else {
                res.status(404);
                res.json({
                    error: 'user not found'
                });
                res.send();
            }
        }
    }
});

module.exports = function(database){
    db = database;

    return router;
};