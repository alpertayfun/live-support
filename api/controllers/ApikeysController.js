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
                              Company.find({ status:"1" }).limit(5).sort("createdAt DESC").exec(function (err, theCompany) {
                                    if(err) console.log(err);
                                    //console.log(theChatRooms);
                                    var arr = [];
                                    async.forEach(theCompany, function (item, callback){
                                          if(item.status=="1"){
                                                item.statusName = "Opened";
                                          }else if(item.status=="2"){
                                                item.statusName = "Bloked";
                                          }else{
                                                item.statusName = "Closed";
                                          }

                                          item.time = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss');
                                          item.expireTime = moment(item.apiKeyExpire).format('YYYY-MM-DD HH:mm:ss');
                                          arr.push(item);
                                                callback(null,null);
                                    }, function(err) {
                                          res.view('apikeys',{layout: 'layout2',theChatRooms:arr});
                                    });
                                    //return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"chatRooms":theChatRooms});
                              });
                        }
                  });
                  
            }
            
      },
};
