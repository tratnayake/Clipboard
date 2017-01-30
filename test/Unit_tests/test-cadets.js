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
let orgGroup = models.orgGroup;
let token;
let mainUrl;

switch(process.env.ENV){
	case "development":
		mainUrl = "http://localhost";
		break;
	case "local_dev":
		mainUrl = "http://localhost:8080";
		break;
}

console.log(mainUrl);
let credentials = {email: "thilina.ratnayake1@gmail.com", password:"testPassword"};

let CadetsController = require('../../controllers/cadets');

/*Test Login*/



describe('Cadets', function(){
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

/*Test the Helpers*/
	describe('Associate OrgGroups', function(){

		it('No OrgGroups @ Start', async(function(){

				//Generate some cadets
				let cadets = await(helpers.generateCadets(5,true));

				//Make sure they are in specific flights
				cadets[0]["Org Group"] = "Hornet";
            	cadets[1]["Org Group"] = "Vampire";
            	cadets[2]["Org Group"] = "HQ";
            	cadets[3]["Org Group"] = "Vampire";
            	cadets[4]["Org Group"] = "HQ";

				//Try to import those cadets
				let orgCadets = await(CadetsController.associateOrgs(cadets));

				//Fetch orgs to compare it
				let orgs = await(orgGroup.findAll({}));
				orgs = models.helpers.instancesToJSON(orgs);

				//Tests
				(orgCadets[0].org_id).should.eql(1);
				(orgCadets[1].org_id).should.eql(2);
				(orgCadets[2].org_id).should.eql(3);
				(orgCadets[3].org_id).should.eql(2);
				(orgCadets[4].org_id).should.eql(3);
		}));

        it('Some OrgGroups @ Start', async(function(){

            //Insert some flights into the db
			let startOrgs = [];
			startOrgs.push({name: "Hornet"});
            startOrgs.push({name: "Vampire"});
            startOrgs.push({name: "HQ"});

            startOrgs = await(orgGroup.bulkCreate(startOrgs, {returning: true}));



        	//Generate some cadets
            let cadets = await(helpers.generateCadets(5,true));

            //Make sure they are in specific flights
            cadets[0]["Org Group"] = "Hornet";
            cadets[1]["Org Group"] = "Vampire";
            cadets[2]["Org Group"] = "HQ";
            cadets[3]["Org Group"] = "Vampire";
            cadets[4]["Org Group"] = "TEST";

            //Try to import those cadets
            let orgCadets = await(CadetsController.associateOrgs(cadets));

            //Fetch orgs to compare it
            let orgs = await(orgGroup.findAll({}));
            orgs = models.helpers.instancesToJSON(orgs);

            //Tests
            (orgCadets[0].org_id).should.eql(1);
            (orgCadets[1].org_id).should.eql(2);
            (orgCadets[2].org_id).should.eql(3);
            (orgCadets[3].org_id).should.eql(2);
            (orgCadets[4].org_id).should.eql(4);
        }));

        it('Some OrgGroups @ Start, no new', async(function(){

            //Insert some flights into the db
            let startOrgs = [];
            startOrgs.push({name: "Hornet"});
            startOrgs.push({name: "Vampire"});
            startOrgs.push({name: "HQ"});

            startOrgs = await(orgGroup.bulkCreate(startOrgs, {returning: true}));



            //Generate some cadets
            let cadets = await(helpers.generateCadets(5,true));

            //Make sure they are in specific flights
            cadets[0]["Org Group"] = "Hornet";
            cadets[1]["Org Group"] = "Vampire";

            //Try to import those cadets
            let orgCadets = await(CadetsController.associateOrgs(cadets));

            //Fetch orgs to compare it
            let orgs = await(orgGroup.findAll({}));
            orgs = models.helpers.instancesToJSON(orgs);

            //Tests
            (orgCadets[0].org_id).should.eql(1);
            (orgCadets[1].org_id).should.eql(2);

        }));


	});

	describe('Associate Ranks', function(){
		it('Should associate the ranks', async(function(){

			let ranks = await(models.Rank.findAll({}));

			let cadets = await(helpers.generateCadets(5,true));

            let rankCadets = await(CadetsController.associateRanks(cadets));

		}));

        it('Should fail if there is an incorrect rank', async(function(){

            let ranks = await(models.Rank.findAll({}));

            let cadets = await(helpers.generateCadets(5,true));

            cadets[0]["Rank"] = "CPO2";

			try {
                await(CadetsController.associateRanks(cadets));
            }
            catch(e){
				await(e).should.eql({message:"Error importing cadet Ranks"});
			}

        }))


	});

/*Test the helper function*/
describe('Helper Functions', function(){

    it('Should prep cadet objects based on key position', async(function(){
        let cadets = await(helpers.generateCadets(5,true));

        cadets = await (CadetsController.prepCadets(cadets));

        (cadets[0]).should.include.keys(['firstName','lastName','level'])
    }))

});


/*Integration Tests*/

/*Import the cadets*/
	describe('Import Cadets', function(){
        it('Should work if there are no new orgs',async(function() {
            //Generate some cadets
            let cadets = await(helpers.generateCadets(5,true));

            //Make sure they are in specific flights
            cadets[0]["Org Group"] = "Hornet";
            cadets[0]["Rank"] = "FSgt";
            cadets[1]["Org Group"] = "Vampire";
            cadets[2]["Org Group"] = "HQ";
            cadets[3]["Org Group"] = "Vampire";
            cadets[4]["Org Group"] = "Vampire";


            var createdCadets = await(CadetsController.import(cadets));
                (createdCadets[0].org_id).should.eql(1);
                (createdCadets[0].rank_id).should.eql(6);
                (createdCadets[1].org_id).should.eql(2);
                (createdCadets[2].org_id).should.eql(3);
                (createdCadets[3].org_id).should.eql(2);
                (createdCadets[4].org_id).should.eql(2);

        }));

        it('Should work if there are new orgs',async(function() {
            //Generate some cadets
            let cadets = await(helpers.generateCadets(5,true));

            //Make sure they are in specific flights
            cadets[0]["Org Group"] = "Hornet";
            cadets[0]["Rank"] = "FSgt";
            cadets[1]["Org Group"] = "Vampire";
            cadets[2]["Org Group"] = "HQ";
            cadets[3]["Org Group"] = "Vampire";
            cadets[4]["Org Group"] = "TEST";

            var createdCadets = await(CadetsController.import(cadets));
            (createdCadets[0].org_id).should.eql(1);
            (createdCadets[0].rank_id).should.eql(6);
            (createdCadets[1].org_id).should.eql(2);
            (createdCadets[2].org_id).should.eql(3);
            (createdCadets[3].org_id).should.eql(2);
            (createdCadets[4].org_id).should.eql(4);

        }));
	});
});