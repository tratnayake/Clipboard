"use strict";


var date = require('date.js');
var schedule = require('node-schedule');

module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define("Event",
    {
    //Table columns 
      id: {type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true},
      name:{type: DataTypes.STRING, allowNull: false},
      classification: {type: DataTypes.ENUM('Optional','Mandatory','Supplementary','Other'), allowNull: false},
      location: {type: DataTypes.STRING, allowNull: false},
      dress: {type: DataTypes.STRING, allowNull: false},
      start_time: {type: DataTypes.DATE, allowNull: false},
      end_time: {type: DataTypes.DATE, allowNull: false},
      open_to_all:{type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
      level:{type: DataTypes.INTEGER}
    },
    {
      classMethods: {
        associate: function(models){
          //Events can be populated by cadets
          Event.belongsToMany(models.Cadet, { through: models.Events_Cadets })
        }
      },
      validate: {},
      hooks: {
          afterCreate: function(instance, options) {
            // var attendanceHandler = require('../controllers/attendanceHandler.js')
            // console.log("After Create Hook FIRED!");
            // var event = instance.dataValues;
            // //console.log(event);
            // //UNCOMMENT THIS TO CREATE THE JOBS
            // var currentTime = new Date();
            // console.log("Current Time: " + currentTime);
            // console.log("Event Start Time: " + event.start_time);
            // if(currentTime > event.start_time){
            //   console.log("Event ID is " + event.id);
            //   console.log("Current time is after event start time, so start the attendance right away.")
            //   //console.log("Event started before the current time, so immediately start the job");
            //     attendanceHandler.startAttendance(event.id);
            // }
            // //Case 2 - Event @ a later date
            // else{
            //   console.log("Event ID is " + event.id);
            //   console.log("Attendance is @ a later date.")
            //   var j = schedule.scheduleJob(event.start_time,function(){
            //     attendanceHandler.startAttendance(event.id);
            //   })
            // }
            //   return;
          }
      },
      scopes:{
        active:{
          where: {
            //Current date/time is greater than the start time
            start_time: {$lte: new Date()},
            $and:{end_time: {$gt: new Date()}}
          }
        }
      },
    }   
  )

  return Event;
};
0
