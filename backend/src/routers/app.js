const express = require('express');
const loki = require('lokijs');
const axios = require('axios');

var router = express.Router();
const apiURL = "https://deploy.mendix.com/api/1/apps/";

var db;

router.get('/', (req, res) => {
    
    var users = db.getCollection("users");
    if(!req.query.user){
        res.status(400);
        res.json({
            success: false,
            message: 'Missing query parameter user uuid'
        });
        return res.send();
    } else{
        var user = users.find({uuid: req.query.user});
        if(!user || user.length === 0){
            res.status(404);
            res.json({
                success: false,
                message: 'User not found for this uuid'
            });
            return res.send();
        } else {
            const userName = user[0].name;
            const apiKey = user[0].mendixApiKey;
            try{
                axios({
                    url: apiURL,
                    method: 'get',
                    headers: {
                        "Mendix-Username": userName,
                        "Mendix-ApiKey": apiKey
                    }
                }).then((response) => {
                    res.status(200);
                    res.json(response.data);
                    return res.send();
                }).catch((error) => {
                    console.log("Error: " + error);
                    res.status(error.response.status);
                    res.json({
                        success: false,
                        message: error.response.data
                    });
                    return res.send();
                });
            } catch(error){
                res.status(500);
                res.json({
                    success: false,
                    message: error
                });
                return res.send();
                console.log("Error: " + error);
            }
            
        }
    }
});

module.exports = function(database){
    db = database;

    return router;
};