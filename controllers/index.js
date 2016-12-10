/*Dependancies*/
let express = require('express'),
    router = express.Router();
let app = require('../app');
let path = require('path');

/*Routes*/

//Users
router.use('/users', require('./users'));

//Cadets
router.use('/cadets', require('./cadets'));

//Ranks

//Flights


module.exports = router;