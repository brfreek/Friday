const express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send(JSON.stringify({message: 'success'}));
});

module.exports = router;