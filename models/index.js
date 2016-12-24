"use strict";

/*Dependencies*/

let fs = require('fs');
let path = require('path');
let Sequelize = require('sequelize-values')();
let sequelize = new Sequelize('postgres://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@db:5432/' + process.env.DB_NAME, {
	logging: false
});

if(process.env.ENV == "test" || process.env.ENV == "local_dev" ){
	sequelize = new Sequelize('postgres://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@localhost:5432/' + process.env.DB_NAME, {
		logging: false
	});
}

let db = {};

//For each file in the models directory, add the model
//into memory.
fs.readdirSync(__dirname).filter(function (file) {
  return file.indexOf(".") !== 0 && file !== "index.js";
}).forEach(function (file) {
  var model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});



db.sequelize = sequelize;
db.Sequelize = Sequelize;

/*Helpers*/
db.helpers = {};
db.helpers.instancesToJSON = function(elements){
    let list = [];
    for(var i = 0;  i < elements.length; i++){
        list[i] = elements[i].toJSON();
    }

    return list;
};

module.exports = db;