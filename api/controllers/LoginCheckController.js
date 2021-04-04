var uuid = require("uuid");
var md5 = require('md5');
var redis = require('redis');
var redisclient = redis.createClient();
var async = require("async");
var parser = require('ua-parser-js');
var moment = require('moment');

var texts  = {};
texts.authError = "Auth Error";
texts.error = "Error";
texts.authSuccess = "Success";
texts.onlyPostAction = "Only Post Action";


module.exports = {

	index: function(req, res) {

            var token = req.cookies.token;

            if(token === undefined || token === null)
            {
                  res.view("login",{layout:"layout3"});
            }else{
                  jwToken.verify(token, function (err, token_catch) {
                        if (err){
                              res.view("login",{layout:"layout3"});
                        }else{
                              res.redirect("/Activechats");
                        }
                        
                  });
                  
            }
            
	},
};
