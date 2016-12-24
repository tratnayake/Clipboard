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
        mainUrl = "http://localhost:8080";
        break;
}

let credentials = {email: "thilina.ratnayake1@gmail.com", password:"testPassword"};


/*Test Login*/
describe('Cadets Import Function', function() {
    //Before running tests, blank slate. Truncate all tables
    before(async(function () {
        //Truncate & Run default migration
        let result = await(migrations.defaultMigration());
    }));

    afterEach(async(function () {
        //Truncate & Run default migration
        let result = await(migrations.defaultMigration());
    }));

    after(async(function () {
        //Truncate & Run default migration
        let result = await(migrations.defaultMigration());
    }));


/*Test Cases*/
//1. Given a bunch of cadets, the API should be able
//to add them into the database. (Happy Case)

    describe('Importing Cadets', function(){
        it(' Given a bunch of cadets, the API should be able to add them into the database. (Happy Case)', async(function() {
            let cadets = await(helpers.generateCadets(5, true));

            let res = await(request(mainUrl)
                .post('/cadets/import')
                .send({cadets:cadets})
                .expect(200));

            res.body.should.eql({numberCadetsAdded: 5});
        }));

        it(' Given no cadets, FAIL', async(function() {

            let res = await(request(mainUrl)
                .post('/cadets/import')
                .expect(400));

            res.body.should.eql({ message: 'No cadets provided'});
        }));

        it(' Given improper data, FAIL', async(function() {

            let cadets = await(helpers.generateCadets(5,true));

            cadets[0]["Rank"] = "CPO2";

            let res = await(request(mainUrl)
                .post('/cadets/import')
                .send({cadets: cadets})
                .expect(400));

            //console.log(res.body);
            res.body.should.eql({ message: 'Error importing cadet Ranks'});
        }))


    });
//2. If a cadet that is being added already exists, omit
//cadets information

//3. If any cadet that is being added does not have proper
//data, fail out.

});


