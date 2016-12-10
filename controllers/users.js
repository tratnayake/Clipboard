"use strict";

/*Routing Dependencies*/
let express = require('express'),
    controller = express.Router();

/*Dependencies*/
let bcrypt = require('bcryptjs');
let models = require('../models');
let validator = require('validator');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
let jwt = require('jsonwebtoken');
let config = require('../config/config');

/*Models*/
let User = models.User;

/*Routes*/
//TODO: Registration Route


controller.post('/login', async(function(req,res,next){
	try{
		var token = login(req.body.email,req.body.password);
		res.send(token).status(200);
	}
	catch(e){
		next(e);
	}
}));


/**
* Login Controller:
* Authenticates a user and returns an API key.
* @param {String} email
* @param {String} password
* @return {String} token - used for future API transactions
**/
controller.login = function(email,password){
	//1. Check if the values are present, if not fail
	if (email === undefined){
		throw({status: 400, message: "Email address not defined"});
	}

	if (password === undefined){
		throw({status: 400, message: "Password not defined"});
	}

	//2. If values are present, check for valid emaiil addr
	if(!validator.normalizeEmail(email))
	{
		throw({status: 401, message: "Invalid characters in email"})
	}

	//3. Check db for that email address (if none fail)
	let user = await(User.findOne({ where: {email: email}}));
	if(user == null){
		throw({status: 400, message: "No account exists for that email"});
	}

	//4. In that account, check password
	if(!bcrypt.compareSync(password,user.dataValues.password)){
		throw({status: 401, message: "Incorrect credentials"});
	}

	//5. Check if they've been verified by email + admin;
	if(user.dataValues.email_verified && user.dataValues.admin_verified){
		//Sign an API key with the users ID;
			
			var token = await(jwt.sign(
					{ token: user.dataValues.UID },
			 		config.JWT_secret,
			 		{ expiresIn: '1 day'}
	 		));

	 		return {token: token};			
	}
	else{
		throw({status: 401, message: "Verification incomplete"});
	}
}

module.exports = controller;