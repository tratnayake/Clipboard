"use strict";

/*Routing Dependencies*/

let express = require('express'),
    controller = express.Router();

/*Dependencies*/
let bcrypt = require('bcryptjs');
let models = require('../models');
let async = require('asyncawait/async');
let await = require('asyncawait/await');

/*Models*/
let User = models.User;
let Cadet = models.Cadet;

/*Routes*/
controller.get('/import', async(function(req,res,next){
	var response = controller.import(req.cadets);
}))


/**
Takes in a list of cadets and adds them to db
* @param {Array} cadets
**/
controller.import = function(cadets){
	//1. for each cadet, generate a unique ID
	
	//2. associate to flights

	//3. associate to ranks

}

module.exports = controller;