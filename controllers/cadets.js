"use strict";

/*Routing Dependencies*/

let express = require('express'),
    controller = express.Router();

/*Dependencies*/
let bcrypt = require('bcryptjs');
let models = require('../models');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
let _ = require('underscore');
let objectRenameKeys = require('object-rename-keys');

/*Models*/
let User = models.User;
let Cadet = models.Cadet;
let orgGroup = models.orgGroup;
let Rank = models.Rank;

/*Routes*/
controller.post('/import', async(function(req,res,next){
	try {
        let importedCadets = await(controller.import(req.body.cadets));
        res.status(200).json({numberCadetsAdded: importedCadets.length});
    }
    catch(e) {
		next(e);
	}
}));

controller.post('/barcodes', async(function(req,res,next){
	try{
		var cadets = await(Cadet.findAll(
			{//Where the UID is in the list given
				where:{
					UID: {
						$in: req.body
					},
					//Not been deleted at yet
                    deletedAt: {
                        $eq: null
                    }
            	},
				//Return UID, last name, first name
                attributes: ['UID', 'lastName', 'firstName'],
                include:
                	[
                		{model: Rank, attributes: ['name']},
                		{model: orgGroup, attributes: ['name']}
                	],
                raw: true
			}
		));
        res.status(200).json(cadets);
	}
	catch(e){
		next(e);
	}
}));


//Error handling
process.on('unhandledRejection', err => {throw err; });

/**
Takes in a list of cadets and adds them to db
* @param {Array} cadets
**/
controller.import = async(function(cadets){
	//1. Check if empty
	if(cadets === undefined){
		throw {status: 400, message: {message: "No cadets provided"}}
	}
	try {
        //2. associate to flights
        cadets = await(controller.associateOrgs(cadets));
        //3. associate to ranks
        cadets = await(controller.associateRanks(cadets));
        //Sanitize Data
		cadets = await (this.prepCadets(cadets));
        //Add to Database
		let newCadets = await(Cadet.bulkCreate(cadets, {returning: true}));
		//Return count
		return newCadets;
    }
    catch(e){
		console.error(e);
		if(e.message){
            throw({status: 400, message: {message: e.message }});
		}
		else{
            throw({status: 400, message: "Importing cadets went wrong"});
		}

	}
});


/*Helper Functions*/
controller.associateRanks = async(function(cadets){
	let ranks = await(Rank.findAll({}));
	ranks = models.helpers.instancesToJSON(ranks);

	try {
        cadets = await(this.associateIds(cadets, ranks, "rank_id", "Rank"));
        return cadets;
    }
    catch(e){
		throw {message: 'Error importing cadet Ranks'};
	}
});


controller.associateOrgs = async(function(cadets){
	//Get the existing org groups
	let orgGroups = await(orgGroup.findAll({}));
	//If there are 0 of them, time to add some
	if (orgGroups.length === 0){
		//To add, find the unique org groups in the cadets
		let orgs = _.uniq(_.pluck(cadets,"Org Group"));
		//Add them
		for (var i = 0; i < orgs.length; i++) {
			orgs[i] = {name: orgs[i]};
		}
		orgGroups = await(orgGroup.bulkCreate(orgs, {returning: true}));

	}
	else{
        //If there are some, but there are new ones incoming.
        //Check if incoming has new by getting list of original orgs

        let existingOrgs = _.uniq(_.pluck(orgGroups,"name"));
        let incomingOrgs = _.uniq(_.pluck(cadets,"Org Group"));
		//Get the difference
		let difference = _.difference(incomingOrgs, existingOrgs);
		if (difference.length > 0) {
            let newOrgs = [];
            for (var i = 0; i < difference.length; i++) {
                newOrgs.push({name: difference[i]});
            }
            var newOrgGroup = await(orgGroup.bulkCreate(newOrgs, {returning: true}));
            //LOG:
			console.log("New Org(s) Added: " + newOrgs);
            orgGroups = await(orgGroup.findAll({}));
		}
	}

    //Unpack all the orgGroups so they can be associated properly
    for (var i = 0; i < orgGroups.length; i++) {
        orgGroups[i] = orgGroups[i].toJSON();
    }


    //Associate each cadet with their org
	try {
        cadets = await(controller.associateIds(cadets, orgGroups, "org_id", "Org Group"));
        return cadets;
    }
    catch(e){
		throw "Error with importing cadets Org Groups";
	}

});


controller.associateIds = async(function(cadets, associations, property, key){
	for (var i = 0; i < cadets.length; i++){
		var cdt = cadets[i];
		var index = associations.map(function(el){
			return el["name"];
		}).indexOf(cdt[key]);

		cdt[property] = associations[index].id;
		delete cdt[key];
	}
	return cadets;
});

/*Function will prep and sanitize cadets before adding them into the database*/
controller.prepCadets = async(function(cadets){
	for(var i in cadets){
		var cadet = cadets[i];
		cadet.firstName = cadet[Object.keys(cadet)[0]];
        cadet.lastName = cadet[Object.keys(cadet)[1]];
        cadet.level = cadet[Object.keys(cadet)[2]];
	}
	return cadets;
});

module.exports = controller;