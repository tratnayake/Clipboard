"use strict"; 

/*Routing Dependencies*/
let express = require('express'),
    router = express.Router();

/*Dependencies*/
let bcrypt = require('bcryptjs');
let models = require('../models');

/*Models*/
let User = models.User;

module.exports = router;
