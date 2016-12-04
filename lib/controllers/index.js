/*Dependancies*/
let express = require('express'),
    router = express.Router();
let app = require('../app');
let path = require('path');

/*Routes*/

//Users
router.use('/users', require('./users'));

//Cadets

//Ranks

//Flights


module.exports = router;