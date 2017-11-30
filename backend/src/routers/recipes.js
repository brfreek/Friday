const express = require('express');
const loki = require('lokijs');
const axios = require('axios');
const _ = require("lodash");
const uuid = require('uuid/v1');

var router = express.Router();
const apiURL = "https://deploy.mendix.com/api/1/";

var db;

router.get('/', (req, res) => {
    //Get list of recipes
    if(req.params.uuid){//Get specific recipes for user
        var getRecipe = getRecipeForUser(req.params.uuid);
        getRecipe.then((result) => {
            if(result || result.length > 0){
                res.status(200);
                res.json(result);
                return res.send();
            } else{
                res.status(404);
                res.json({
                    success: true,
                    message: "No recipes found for user with uuid: " + req.params.uuid
                });
                return res.send();
            }
        }).catch((error) => {
            switch(error){
                case 404:
                    res.status(404);
                    res.json({
                        success: true,
                        message: "No recipes found for user with uuid: " + req.params.uuid
                    });
                    return res.send();
                    break;
                default:
                    res.status(500);
                    res.json({
                        success: false,
                        message: "Something went wrong"
                    });
                    return res.send();
                    break;
            }
        });
    } else {
        var recipes = getAllRecipes();
        if(!recipes){
            res.status(404);
            res.json({
                success: true,
                message: "No recipes found"
            });
            return res.send();
        } else {
            res.status(200);
            res.json(recipes);
            return res.send();
        }
    }
});

router.post('/', (req, res) => {
    //Create new recipe
});

router.put('/', (req, res) => {
    //Update existing recipe
});
router.delete('/', (req, res) => {
    //Delete existing recipe
});


function getUser(uuid){
    return new Promise((resolve, reject) => {
        var users = db.getCollection("users");
        if(!users){
            reject('No users found in DB');
        }
        var user = users.find({uuid: uuid});
        if(user){
            resolve(user);
        } else {
            reject('User not found for uuid: ' + uuid);
        }
    });
}

function getRecipeForUser(uuid){
    return new Promise((resolve, reject) => {
        var recipes = db.getCollection("recipes");
        var results = recipes.where((obj) => {
            return obj.createdBy === uuid;
        });
        if(results || results.length > 0){
            resolve(results);
        } else {
            reject(404);
        }
    });
}

function getAllRecipes(){
    var recipes = db.getCollection("recipes");
    if(recipes || recipes.length > 0){
        return recipes;
    } else {
        return null;
    }
}

function createRecipe(name, type, createdBy, sourceAppId, parallelExecution, environments, lastRevision){
    return new Promise((resolve, reject) => {
        if(!name || name === ""){
            reject("Name is missing");
        } else if(!type || type === ""){
            reject("Type is missing");
        } else if(!createdBy || createdBy === 0){
            reject("createdBy is missing");
        } else if(!sourceAppId || sourceAppId === 0){
            reject("sourceAppId is missing");
        } else if(!environments || environments.length === 0){
            reject("Please provide some environments");
        } else {
            var recipes = db.getCollection("recipes");
            var newRecipe = {
                uuid: uuid(),
                name: name,
                type: type,
                createdBy: createdBy,
                sourceAppId: sourceAppId,
                parallelExecution: parallelExecution,
                environments: environments,
                lastRevision: lastRevision
            }
            
            var createdRecipe = recipes.insert(newRecipe); 
            resolve(createdRecipe);
        }
        
    });
}
function updateRecipe(uuid, name, type, createdBy, sourceAppId, parallelExecution, environments, lastRevision){
    return new Promise((resolve, reject) => {
        if(!uuid || uuid === 0){
            reject("UUID is missing");
        } else {
            var recipes = db.getCollection("recipes");
            var recipe = recipes.find({uuid: uuid});
            if(!recipe || reicpe.length === 0){
                reject("Recipe not found");
            } else {
                recipe.name = name ? name : recipe.name;
                recipe.type = type ? type : recipe.type;
                recipe.createdBy = createdBy ? createdBy : recipe.createdBy;
                recipe.sourceAppId = sourceAppId ? sourceAppId : recipe.sourceAppId,
                recipe.parallelExecution = parallelExecution ? parallelExecution : recipe.parallelExecution;
                recipe.environments = environments ? this.updateEnvironments(environments, recipe.environments) : recipe.environments;
                recipe.lastRevision = lastRevision ? lastRevision : recipe.lastRevision;
            }           
            
            var updatedRecipe = recipes.update(recipe); 
            resolve(updatedRecipe);
        }
    });
}

function updateEnvironments(newEnv, oldEnv){
    var sameSame = _.isEqual(newEnv, oldEnv);
    if(sameSame){
        return oldEnv;
    } else {
        return newEnv;
    }
}

module.exports = function(database) {
    db = database;

    return router;
}