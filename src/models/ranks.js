"use strict";

module.exports = function(sequelize, DataTypes) {
  var Rank = sequelize.define("Rank",
    {
    //Table columns 
      number: {type: DataTypes.INTEGER, allowNull: false, unique: true},
      name: { type: DataTypes.STRING, allowNull: false, unique: true }, 
      longName: { type: DataTypes.STRING, allowNull: false, unique: true },
      type: {type: DataTypes.ENUM('Officer','Cadet'), allowNull:false}
    },
    {
      timestamps: false 
    },
    {
      getterMethods : {
        abbreviation: function() { return this.shortName }
      }
    }    
  )
  return Rank;
};
0
