"use strict";


module.exports = function(sequelize, DataTypes) {
  var orgGroup = sequelize.define("orgGroup",
    {
    //Table columns
      name: {type: DataTypes.STRING, allowNull: false}
    },
    {
      classMethods: {
        associate: function(models){
        }
      }
    },
    {
      timestamps: false 
    }   
  )

  return orgGroup;
};