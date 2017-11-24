const express = require('express');
const SHA256 = require('crypto-js/sha256');
const uuid = require('uuid/v1');
const loki = require('lokijs');

var db;

var router = express.Router();

router.get('/', (req, res) => {

    var users = db.getCollection("users");
    if(users !== null){
        res.json(users.data);
        res.send();
    } else {
        res.status(404);
        res.json({
            success: false,
            message: 'No users found'
        });
    }
});

router.put('/', (req, res) => {
    var users = db.getCollection("users");
    if(req.body && req.query.uuid){
        if(users !== null){
            var user = users.find({uuid: req.query.uuid});
            if(user !== null && user.length > 0){
                user = user[0];
                if(req.body.name){
                    user.name = req.body.name;
                }
                if(req.body.password){
                    const hash = SHA256(req.body.password).toString();                   
                    user.password = hash;
                }
                if(req.body.mendixApiKey){
                    user.mendixApiKey = req.body.mendixApiKey;
                }
                users.update(user);
                
                res.status(200);
                res.json({
                    success: true,
                    user: user
                });
                res.send();
            } else {
                res.status(404);
                res.json({
                    success: false,
                    message: 'User not found'
                });
                res.send();
            }
        } else {
            res.status(404);
            res.json({
                success: false,
                message: 'Users not found'
            });
            res.send();
        }
    } else {
        //provide a valid body
        if(!req.body){
            res.status(400);
            res.json({
                success: false,
                message: 'Request body is invalid'
            });
            res.send();
        } else if(!req.query.uuid){
            res.status(400);
            res.json({
                success: false,
                message: 'Missing url parameter uuid'
            });
            res.send();
        }
        
    }
});

router.post('/', (req, res) => {
    var users = db.getCollection("users");
    if(req.body){
        if(!req.body.name || !req.body.password){
            res.status(400);
            res.json({
                success: false,
                message: 'Name or password missing'
            });
            res.send();
        }
        if(users !== null){
            var user = users.find({name: req.body.name});
            if(!user){       
                const hash = SHA256(req.body.password).toString();
                var user = {
                    uuid: uuid(),
                    name: req.body.name,
                    password: hash,
                    mendixApiKey: req.body.mendixApiKey !== null ? req.body.mendixApiKey : ''
                }
                users.insert(user);
                
                res.status(200);
                res.json({
                    success: true,
                    user: user
                });
                res.send();
            } else {
                res.status(409);
                res.json({
                    success: false,
                    message: 'User already exists'
                });
                res.send();
            }
        } else {
            res.status(404);
            res.json({
                success: false,
                message: 'Users database not found'
            });
            res.send();
        }
    } else {
        res.status(400);
        res.json({
            success: false,
            message: 'Request body is invalid'
        });
        res.send();
    }
});

module.exports = function(database){
    db = database;

    return router;
};