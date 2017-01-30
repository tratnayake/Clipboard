"use strict";

/* Dependencies */
let bcrypt = require('bcryptjs');

/* Model */
module.exports = function (sequelize, DataTypes) {
  let User = sequelize.define("User", {
    //Table columns 
    UID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('Officer', 'Cadet'), allowNull: false },
    //The verification token that will be used as the /verify/URL
    verificationToken: { type: DataTypes.UUID, allowNull: false, unique: true, defaultValue: DataTypes.UUIDV4 },
    //The expiration time. 4 hours
    expires: { type: DataTypes.DATE, defaultValue: new Date().addHours(4) },
    email_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    admin_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {
    classMethods: {
      associate: function (models) {
        //User has a rank
        User.belongsTo(models.Rank, { foreignKey: 'position_id', onDelete: 'CASCADE', targetKey: 'id' });
      }
    }
  }, {
    timestamps: false
  });

  //Hash the password before adding it into the database
  User.hook('beforeCreate', function(user, options){
    let salt = bcrypt.genSaltSync(10);
    user.dataValues.password = bcrypt.hashSync(user.dataValues.password, salt);
  })

  return User;
};

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};
