const express = require('express');
const loki = require('lokijs');
const SHA256 = require('crypto-js/sha256');
const jwt = require('jsonwebtoken');

const secret = require('../helper/secret.js');

const router = express.Router();

var db = new loki('./friday.db.json');
db.loadDatabase();

router.post('/', (req, res) => {
    console.log('database: ' + JSON.stringify(db));    
    if(req.body){
        const hash = SHA256(req.body.password).toString();
        console.log(hash);
        var users = db.getCollection('users');
        if(users.length === 0){
            res.status(404);
            res.json({
                error: 'users not found'
            });
            res.send();
        } else {
            var user = users.find({name: req.body.name, password: hash, uuid: req.body.uuid});
            if(user.length > 0){
                user = user[0];
                var token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: req.body.uuid + '' + req.body.password
                }, secret);

                user.token = token;
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

module.exports = router;