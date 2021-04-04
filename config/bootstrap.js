/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

	sails.io.on('connect', function (socket){
        console.log("connected >>>>>>>>>");
    });

    sails.io.on('disconnect', function (socket){
        console.log("disconnected >>>>>>>>>");
    });

    sails.io.on('reconnect', function (socket){
        console.log("reconnected >>>>>>>>>");
    });

    sails.io.on('lower', function() { 
	   console.log("lower");
    });
    
  cb();
};
