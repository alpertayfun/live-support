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
                  res.redirect("/login");
            }else{
                  jwToken.verify(token, function (err, token_catch) {
                        if (err) 
                        {
                              res.redirect("/login");
                        }else{
                              if(req.query.hasOwnProperty("id")){
                                    Company.findOne({ companyId:req.query.id}).sort("createdAt DESC").exec(function (err, theCompany) {
                                          if(err) console.log(err);
                                          theCompany.expireTime = moment(theCompany.apiKeyExpire).format('YYYY-MM-DD HH:mm:ss');
                                          if(theCompany.status=="1"){
                                                theCompany.statusName = "Opened";
                                          }else if(theCompany.status=="2"){
                                                theCompany.statusName = "Bloked";
                                          }else{
                                                theCompany.statusName = "Closed";
                                          }
                                          theCompany.time = moment(theCompany.createdAt).format('YYYY-MM-DD HH:mm:ss');
                                          Agents.find({companyId:theCompany.companyId}).exec(function (err, theAgents) {
                                                if(err) console.log(err);
                                                theCompany.totalagents = theAgents.length;
                                                res.view('agents',{layout: 'layout2',theCompanys:theCompany,theAgents:theAgents,moment:moment});
                                          });
                                    });
                              }else{
                                    res.redirect('users');
                              }
                        }
                  });
                  
            }
            
	},
};
