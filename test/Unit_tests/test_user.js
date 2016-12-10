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

	describe('User Log-In', function(){

		it('Empty Email', async(function(){

			var email = undefined;
			var password = "testPassword";

			try{ login(email,password) }
			catch(e){
				e.should.eql({status: 400, message: "Email address not defined"})
			}

				
		}));

		it('Empty Password', async(function(){

			var email = "thilina.ratnayake1@gmail.com";
			var password = undefined;

			try{ login(email,password) }
			catch(e){
				e.should.eql({status: 400, message: "Password not defined"});
			}

				
		}));

		

		it('Dangerous characters in email', async(function(){

			var email = "test1@lk34#%^#$6346sd.com";
			var password = "testPassword";

			try{ login(email,password) }
			catch(e){
				e.should.eql({status: 401, message: "Invalid characters in email"});
			}
				
		}));

		it('Incorrect Email', async(function(){

			var email = "tasdgasdg@test.com";
			var password = "BADPassword";

			try{ login(email,password) }
			catch(e){
				e.should.eql({status: 400, message: "No account exists for that email"});
			}
			

		}));

		
		it('Incorrect Password', async(function(){

			var email = "thilina.ratnayake1@gmail.com";
			var password = "BADPassword";

			try{ login(email,password) }
			catch(e){
				e.should.eql({status: 401, message: "Incorrect credentials"});
			}
			

		}));

		it('Proper credentials, unverified', async(function(){

			var email = "thilina.ratnayake1@gmail.com";
			var password = "testPassword";

			try{ login(email,password) }
			catch(e){
				e.should.eql({status: 401, message: "Verification incomplete"});
			}
			

		}));

		it('Proper credentials, unverified', async(function(){

			var email = "thilina.ratnayake1@gmail.com";
			var password = "testPassword";

			let updateVerification = await(User.update(
				{
					email_verified: true,
					admin_verified: true
				},
				{
					where: {email: email}
				}
			))

			try{ 
				var token = login(email,password);
				console.log(token);
				token.should.exist
			}
			catch(e){
				//console.log(e);
			}
			

		}));

	})


})