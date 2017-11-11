const express = require('express');
const loki = require('lokijs');
const axios = require('axios');

var router = express.Router();
const apiURL = "https://deploy.mendix.com/api/1/apps/";

var db = new loki('./friday.db.json');
db.loadDatabase();

router.get('/', (req, res) => {
    db.loadDatabase();
    var users = db.getCollection("users");
    if(!req.query.user){
        res.status(400);
        res.json({
            success: false,
            message: 'Missing query parameter user uuid'
        });
        res.send();
    } else{
        var user = users.find({uuid: req.query.user});
        if(!user || user.length === 0){
            res.status(404);
            res.json({
                success: false,
                message: 'User not found for this uuid'
            });
            res.send();
        } else {
            user = user[0];

            axios({
                url: apiURL,
                method: 'get',
                headers: {
                    "Mendix-Username": user.name,
                    "Mendix-ApiKey": user.mendixApiKey
                }
            }).then((response) => {
                res.status(200);
                res.send(response);
            }).catch((error) => {
                res.status(500);
                res.json({
                    success: false,
                    message: error
                });
            })
        }
    }
});

module.exports = router;