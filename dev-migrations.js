/*Dependencies*/
let models = require('./models');
let bcrypt = require('bcryptjs');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var salt = bcrypt.genSaltSync(10);
var password = bcrypt.hashSync("testPassword", salt);

var txUser = {
	id: 1,
	type: 'Officer',
	firstName: "Thilina",
	lastName: "Ratnayake",
	email: "thilina.ratnayake1@gmail.com",
	password: "testPassword",
	rank_id: 10
};

let ranks = [];

/*Ranks*/
ranks.push({ number: 1, name: "AC", longName: "Air Cadet", type: 'Cadet' });
ranks.push({ number: 2, name: "LAC", longName: "Leading Air Cadet", type: 'Cadet' });
ranks.push({ number: 3, name: "Cpl", longName: "Corporal", type: 'Cadet' });
ranks.push({ number: 4, name: "FCpl", longName: "Flight Corporal", type: 'Cadet' });
ranks.push({ number: 5, name: "Sgt", longName: "Sergeant", type: 'Cadet' });
ranks.push({ number: 6, name: "FSgt", longName: "Flight Sergeant", type: 'Cadet' });
ranks.push({ number: 7, name: "WO2", longName: "Warrant Officer Second Class", type: 'Cadet' });
ranks.push({ number: 8, name: "WO1", longName: "Warrant Officer First Class", type: 'Cadet' });
//Officers
ranks.push({ number: 9, name: "CI", longName: "Civillian Instructor", type: 'Officer' });
ranks.push({ number: 10, name: "OCdt", longName: "Officer Cadet", type: 'Officer' });
ranks.push({ number: 11, name: "2Lt", longName: "Second Liutenant", type: 'Officer' });
ranks.push({ number: 12, name: "Lt", longName: "Liutenant", type: 'Officer' });
ranks.push({ number: 13, name: "Capt", longName: "Captain", type: 'Officer' });
ranks.push({ number: 14, name: "Maj", longName: "Major", type: 'Officer' });

//The "static data" that needs to be added (i.e. Ranks)
exports.defaultMigration = function () {
	return new Promise(function (resolve, reject) {
		var execute = async (function(){
			//Truncate Tables
			let result = await (models.sequelize.drop());
			result = await (models.sequelize.sync({ force: true }));

			//Add Ranks
			result = await (models.Rank.bulkCreate(ranks));

			//Add User
			result = await (models.User.create(txUser));
			
			return "DEFAULT MIGRATION COMPLETE";
		});
		execute().then(resolve).catch(errorHandler);
	});
};

function truncateTables() {
	return new Promise(function (resolve, reject) {
		models.sequelize.truncate({ cascade: true }).then(function (val) {
			resolve("Tables Truncated");
		}).catch(function (err) {
			reject(err);
		});
	});
}

function errorHandler(err){
	console.err(err);
}