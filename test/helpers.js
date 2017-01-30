/*Dependencies*/
var async = require('asyncawait/async');
var await = require('asyncawait/await');

let helpers ={};

/*Generators*/
//This module should be able to generate some cadets.
helpers.generateCadets = async(function(number,random,groups){
	let cadets = [];
	let ranks = ["AC", "LAC", "Cpl", "FCpl", "Sgt", "FSgt", "WO2", "WO1"];
	var orgGroups = ["HQ", "Hornet", "Vampire", "Zulu", "Nighthawk", "Polaris"];
	var trgGroups = [1,2,3,4,5];
	
	for (var i = 0; i < number; i++) {
		var cadet = {
			"Rank": ranks.randomElement(),
			//"phoneNumber": 6042700403,
			"Last Name": "TestLastName_ " + i,
			"First Name": "FirstTest_" + i,
			"Level": trgGroups.randomElement(),
		};

		if(random){
			cadet["Org Group"] = orgGroups.randomElement();
		}
		else{
			cadet["Org Group"] = groups.randomElement();
		}

		cadets.push(cadet);
	}

	return cadets;

	
})


//HelperFunctions
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
};

module.exports = helpers;