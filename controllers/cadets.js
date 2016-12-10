"use strict";

/*Routing Dependencies*/

let express = require('express'),
    router = express.Router();

/*Dependencies*/
let bcrypt = require('bcryptjs');
let models = require('../models');

/*Models*/
let User = models.User;
let Cadet = models.Cadet;

/*Routes*/
router.get('/import', function(req,res){
	console.log("invoked");
})

module.exports = router;