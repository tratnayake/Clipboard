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
let Cadet = models.Cadet;
let token;
let mainUrl = process.env.ENDPOINT;



let credentials = {email: "thilina.ratnayake1@gmail.com", password:"testPassword"};


/*Test Login*/
describe('Cadets API', function() {
    //Before running tests, blank slate. Truncate all tables
    before(async(function () {
        //Truncate & Run default migration
        let result = await(migrations.defaultMigration());
        console.log(result);
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

    describe('Fetching info to generate barcodes', function() {
        it(' Given a bunch of active cadets, the API should return info for barcodes. (Happy Case)', async(function () {

            // -- Insert Cadets --
            let cadets = await(helpers.generateCadets(5, true));

            let res = await(request(mainUrl)
                .post('/cadets/import')
                .send({cadets: cadets})
                .expect(200));

            // -- Fetch proper info --
            cadets = await(Cadet.findAll({attributes: ['UID'], raw:true}))

            var UIDs = [];

            for(var x = 0; x < cadets.length; x++){
                UIDs.push(cadets[x].UID);
            }

            res = await(request(mainUrl)
                .post('/cadets/barcodes')
                .send(UIDs)
                .expect(200));

            var result = res.body;
            //There should be 5 cadets returned
            (result).should.have.length(5);
            //Should contain keys UID, firstName, lastName
            (result[0]).should.include.keys(['UID', 'firstName', 'lastName','Rank.name','orgGroup.name']);

        }));
        it('Given NO UIDs, should return nothing', async(function () {

            // -- Insert Cadets --
            let cadets = await(helpers.generateCadets(5, true));

            let res = await(request(mainUrl)
                .post('/cadets/import')
                .send({cadets: cadets})
                .expect(200));

            // -- Fetch proper info --
            cadets = await(Cadet.findAll({attributes: ['UID'], raw:true}))

            var UIDs = [];

            for(var x = 0; x < cadets.length; x++){
                UIDs.push(cadets[x].UID);
            }

            res = await(request(mainUrl)
                .post('/cadets/barcodes')
                .send([])
                .expect(200));

            var result = res.body;
            console.log(result);
            //There should be 0 cadets returned
            (result).should.have.length(0);

        }));
        it('Given incorrect IDs, should return nothing', async(function () {
            // -- Insert Cadets --
            let cadets = await(helpers.generateCadets(5, true));

            let res = await(request(mainUrl)
                .post('/cadets/import')
                .send({cadets: cadets})
                .expect(200));

            // -- Fetch proper info --
            cadets = await(Cadet.findAll({attributes: ['UID'], raw:true}))

            var UIDs = [];

            for(var x = 0; x < cadets.length; x++){
                UIDs.push(cadets[x].UID);
            }

            res = await(request(mainUrl)
                .post('/cadets/barcodes')
                .send([9,10,11])
                .expect(200));

            var result = res.body;
            (result).should.have.length(0);
        }))
        it('Given some incorrect UIDs, only return the ones that exist', async(function () {
            // -- Insert Cadets --
            let cadets = await(helpers.generateCadets(5, true));

            let res = await(request(mainUrl)
                .post('/cadets/import')
                .send({cadets: cadets})
                .expect(200));

            // -- Fetch proper info --
            cadets = await(Cadet.findAll({attributes: ['UID'], raw:true}))

            var UIDs = [];

            for(var x = 0; x < cadets.length; x++){
                UIDs.push(cadets[x].UID);
            }

            res = await(request(mainUrl)
                .post('/cadets/barcodes')
                .send([2,10,11])
                .expect(200));

            var result = res.body;
            (result).should.have.length(1);
        }))
    })


});


