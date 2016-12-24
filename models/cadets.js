"use strict";

module.exports = function(sequelize, DataTypes) {
  var Cadet = sequelize.define("Cadet",
    {
    //Table columns 
      UID: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      firstName: { type: DataTypes.STRING, allowNull: false, unique:'compositeIndex' },
      lastName: { type: DataTypes.STRING, allowNull: false, unique: 'compositeIndex' },
      // phoneNumber: {type: DataTypes.STRING, allowNull: false},
      level: {type: DataTypes.INTEGER, allowNull: false},
    },
    {
      classMethods: {
        //Method used for deleting Cadets
        delete: function(UID){
          return this.destroy({where:{CIN:CIN}})
        },
        associate: function(models){
          //Cadet has a rank
          Cadet.belongsTo(models.Rank, {foreignKey: 'rank_id', targetKey: 'id'});
          // //Cadet has an org group
          Cadet.belongsTo(models.orgGroup, {foreignKey: 'org_id'});
          //Cadets can belong to an event.
          Cadet.belongsToMany(models.Event, { through: models.Events_Cadets })
        }
      },
      hooks:{},
      timestamps: true,
      paranoid: true,
    } 
  );

  return Cadet;
};