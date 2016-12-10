"use strict";


module.exports = function(sequelize, DataTypes) {
  var Events_Cadets = sequelize.define("Events_Cadets",
    {},
    {
      classMethods: {}
    },
    {
      timestamps: false 
    }   
  )

  return Events_Cadets;
};