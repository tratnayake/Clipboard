"use strict";


module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define("User",
    {
    //Table columns 
      UID: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      email: {type: DataTypes.STRING, allowNull: false},
      password: {type: DataTypes.STRING, allowNull: false},
      type: {type: DataTypes.ENUM('Officer','Cadet'), allowNull: false},
       //The verification token that will be used as the /verify/URL
      verificationToken:{type: DataTypes.UUID, allowNull: false, unique: true, defaultValue: DataTypes.UUIDV4},
      //The expiration time. 4 hours
      expires:{type: DataTypes.DATE, defaultValue: new Date().addHours(4) },
      email_verified:{type: DataTypes.BOOLEAN, allowNull:false, defaultValue: false},
      admin_verified:{type: DataTypes.BOOLEAN, allowNull:false, defaultValue: false}
    },
    {
      classMethods: {
        associate: function(models){
        //User has a rank
        User.belongsTo(models.Rank, {foreignKey: 'position_id', onDelete: 'CASCADE', targetKey: 'id'});
        //   //Users have a position (CO, DCO, AdminO)
        //   //User.belongsTo(models.Position, {foreignKey: 'position_id', onDelete: 'CASCADE', targetKey: 'id'});
        //   //Users have many roles
        //   User.belongsToMany(models.Role, {through: models.Users_Roles});
        }
      }
    },
    {
      timestamps: false 
    }   
  )

  // Method 2 via the .hook() method
  // User.hook('afterCreate', function(user, options) {
  //   //console.log(options);
  //   var user = user.dataValues;
  //   if(user.email_verified == false){
  //     console.log("Sending emails!");
  //     logger.info("User After Create Email Hook Fired for User: " + user.email)
  //     email.sendVerificationEmail(user);
  //   }
    
  // })
  return User;
};

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
0
