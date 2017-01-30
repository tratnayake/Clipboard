"use strict";


module.exports = function(sequelize, DataTypes) {
  var orgGroup = sequelize.define("orgGroup",
    {
    //Table columns
      name: {type: DataTypes.STRING, allowNull: false }
    },
    {
      classMethods: {
      }
    },
    {
      timestamps: false 
    }   
  )

  return orgGroup;
};