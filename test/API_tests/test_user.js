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
let mainUrl = process.env.ENDPOINT;

let credentials = {email: "thilina.ratnayake1@gmail.com", password:"testPassword"};


/*Test Login*/
describe('Registration Function', function(){
	//Before running tests, blank slate. Truncate all tables
	before(async(function(){ 
		//Truncate & Run default migration
		let result = await(migrations.defaultMigration());
	}));

	afterEach(async(function(){ 
		//Truncate & Run default migration
		let result = await(migrations.defaultMigration());
	}));

	after(async(function(){ 
		//Truncate & Run default migration
		let result = await(migrations.defaultMigration());
	}));

	describe('User Log-In', function(){

		it('Empty email + pw', async(function(){

				let res = await(request(mainUrl)
					.post('/users/login')
					.expect(400))

				//console.log(res);
			})
		);

		it('Empty Email', async(function(){

				let inputs = {	
					password: "testPassword"
				};

				let res = await(request(mainUrl)
					.post('/users/login')
					.send(inputs)
					.expect(400));

				//console.log(res);
			})
		);

		it('Empty PW', async(function(){

				let inputs = {	
					email: "test@test.com"
				};

				let res = await(request(mainUrl)
					.post('/users/login')
					.send(inputs)
					.expect(400))

				//console.log(res);
			})
		);

		it('Dangerous characters in email', async(function(){

				let inputs = {	
					email: "test1@lk34#%^#$6346sd.com",
					password: "testPassword"
				};

				let res = await(request(mainUrl)
					.post('/users/login')
					.send(inputs)
					.expect(401))

				//console.log(res);
			})
		);

		it('Incorrect Email', async(function(){

				let inputs = {	
					email: "tasdgasdg@test.com",
					password: "BADPassword"
				};

				let res = await(request(mainUrl)
					.post('/users/login')
					.send(inputs)
					.expect(400))

				//console.log(res);
			})
		);

		it('Incorrect Password', async(function(){

				let inputs = {	
					email: "thilina.ratnayake1@gmail.com",
					password: "BADPassword"
				};

				let res = await(request(mainUrl)
					.post('/users/login')
					.send(inputs)
					.expect(401))

				//console.log(res);
			})
		);

		it('Proper Credentials, Unverified', async(function(){

				let inputs = {	
					email: "thilina.ratnayake1@gmail.com",
					password: "testPassword"
				};

				let res = await(request(mainUrl)
					.post('/users/login')
					.send(inputs)
					.expect(401))

				//console.log(res);
			})
		);

		it('Proper Credentials, Verified', async(function(){

				let inputs = {	
					email: "thilina.ratnayake1@gmail.com",
					password: "testPassword"
				};

				//Set the adminVerified and emailVerified dates 
				//to true
				let updateVerification = await(User.update(
					{
						email_verified: true,
						admin_verified: true
					},
					{
						where: {email: inputs.email}
					}
				));

				let res = await(request(mainUrl)
					.post('/users/login')
					.send(inputs)
					.expect(200));

				let result = res.body;
				(result).should.include.keys(['token'])
			})
		);
	});
	// describe('User Sign-Up', function(){
			
	// 	it('Should allow the creation of a new user with the right information', Q.async(function*(){
	// 		let rank = yield models.Rank.find({where:{name: "OCdt"}});

	// 		let txUser = {
	// 		  	firstName: "Thilina", 
	// 		  	lastName: "Ratnayake", 
	// 		  	email: "thilina@tratnayake.me",
	// 		  	password: "testPassword",
	// 		  	rank_id: rank.dataValues.id,
	// 		  	type: 'Officer'
	// 		}

	// 		let res = yield request(mainUrl)
	// 			.post('/users/register')
	// 			.send(txUser)
	// 			.expect(200)

	// 		let result = res.body;
	// 		(result).should.include.keys(['id','firstName','lastName','createdAt',
	// 		'Rank']);

	// 	}))
	// })

})
