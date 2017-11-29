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
            if(!req.query.appId){
                var retrieveAllApps = mxApiRetrieveAllApps(userName, apiKey);
                retrieveAllApps.then((result) => {
                    res.status(200);
                    res.json(result);
                    return res.send();
                }).catch((error) => {
                    const status = error.status;
                    const message = error.message;
                    res.status(status);
                    res.json({
                        success: false,
                        message: message
                    });
                    return res.send();
                });
            } else {
                var retrieveApp = mxApiRetrieveApp(userName, apiKey, req.query.appId);
                retrieveApp.then((result) => {
                    res.status(200);
                    res.json(result);
                    return res.send();
                }).catch((error) => {
                    console.log("Error in get all apps: " + error);
                    const status = error.status;
                    const message = error.message;
                    res.status(status);
                    res.json({
                        success: false,
                        message: message
                    });
                    return res.send();
                });
            }
        }
    }
});

router.get('/environments', (req, res) => {
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
        } else if(req.query.appId){
            const userName = user[0].name;
            const apiKey = user[0].mendixApiKey;
            var retrieveEnvironments = mxApiRetrieveEnvironments(userName, apiKey, req.query.appId);
            retrieveEnvironments.then((result) => {
                res.status(200);
                res.json(result);
                return res.send();
            }).catch((error) => {
                res.status(error.response.status);
                res.json({
                    success: false,
                    message: error.response
                });
                return res.send();
            });
        } else {
            res.status(400);
            res.json({
                success: false,
                message: 'Missing query parameter appId'
            });
            return res.send();
        }
    }
});


function mxApiRetrieveEnvironments(name, apiKey, appId){
    return new Promise((resolve, reject) => {
        try{
            axios({
                url: apiURL + appId + '/environments',
                method: 'get',
                headers: {
                    "Mendix-Username": name,
                    "Mendix-ApiKey": apiKey
                }
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject({status: error.response.status, message: error.response});
            });
        } catch(error){
            reject({status: 500, message: error});
        }
    });
}

function mxApiRetrieveApp(name, apiKey, appId){
    return new Promise((resolve, reject) => {
        try{
            axios({
                url: apiURL + appId,
                method: 'get',
                headers: {
                    "Mendix-Username": name,
                    "Mendix-ApiKey": apiKey
                }
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject({status: error.response.status, message: error.response})                
            })
        } catch(error){
            console.log("Error in get app: " + error);
            reject({status: 500, message: error});            
        }
    });
}

function mxApiRetrieveAllApps(name, apiKey){
    return new Promise((resolve, reject) => {
        try{
            axios({
                url: apiURL,
                method: 'get',
                headers: {
                    "Mendix-Username": name,
                    "Mendix-ApiKey": apiKey
                }
            }).then((response) => {
               resolve(response.data);
            }).catch((error) => {
                reject({status: error.response.status, message: error.response})
            });
        } catch(error){
            console.log("Error in retrieveAll Apps: " + error);
            reject({status: 500, message: error});
        }
    });
}


module.exports = function(database){
    db = database;

    return router;
};