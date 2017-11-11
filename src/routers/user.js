const express = require('express');
const loki = require('lokijs');
var router = express.Router();

var db = new loki('./friday.db.json',{
    autoload: true,
    autosave: false
});

router.get('/', (req, res) => {
   
    var users = db.getCollection("users");
    console.log("users: " + JSON.stringify(users));
    if(users.length !== null){
        res.json(users.data);
        res.send();
    } else {
        res.status(404);
        res.json({
            success: false,
            message: 'No users found'
        })
    }
    
});

module.exports = router;