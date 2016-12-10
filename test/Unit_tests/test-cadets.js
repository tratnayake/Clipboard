"use strict"; 
/*Core Dependencies*/
let _ = require('underscore');

/*Dependencies*/
let chai = require('chai');
let should = chai.should();
let expect = chai.expect();
let request = require('supertest');
let bcrypt = require('bcryptjs');
let migrations = require('../../dev-migrations');
let Q = require("q");
let date = require('date.js');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
let helpers = require('../helpers');

/*Models*/
let models = require('../../models');
let Rank = models.Rank;
let User = models.User;
let Staff = models.Staff;
let token;
let mainUrl;

switch(process.env.ENV){
	case "development":
		mainUrl = "http://localhost";
		break;
	case "local_dev":
		mainUrl = "http://localhost:8080"
		break;
}

console.log(mainUrl);
let credentials = {email: "thilina.ratnayake1@gmail.com", password:"testPassword"};


/*Test Login*/
//function to test:
let login = require('../../controllers/users').login;
describe('Login', function(){
	//Before running tests, blank slate. Truncate all tables
	before(async(function(){ 
		//Truncate & Run default migration
		let result = await(migrations.defaultMigration());
	}))

	afterEach(async(function(){ 
		//Truncate & Run default migration
		let result = await(migrations.defaultMigration());
	}))

	after(async(function(){ 
		//Truncate & Run default migration
		let result = await(migrations.defaultMigration());
	}))

	describe('Import some cadets', function(){

		it('Ideal case scenario', async(function(){

				//Generate some cadets
				var cadets = await(helpers.generateCadets(5,true));
				console.log(cadets);

				//Try to import those cadets
				

		}));



	})

})