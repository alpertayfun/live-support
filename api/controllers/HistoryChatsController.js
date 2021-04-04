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
                              ChatRooms.find({ status:"0" }).limit(50).sort("updatedAt DESC").exec(function (err, theChatRooms) {
                                    if(err) console.log(err);
                                    //console.log(theChatRooms);
                                    var arr = [];
                                    async.forEach(theChatRooms, function (item, callback){
                                          var ua = parser(item.headers['user-agent']);
                                          item.browser = ua.browser.name.toLowerCase().replace(" ","");
                                          if(ua.device.model=="" || ua.device.model === undefined){
                                                item.device = "none";
                                          }else{
                                                item.device = ua.device.model.toLowerCase().replace(" ","");
                                          }
                                          item.origin = item.headers.origin.toLowerCase().replace("https://","");

                                          var osname = ""+ua.os.name+"";
                                          item.os = osname.toLowerCase().replace(" ","");
                                          item.osversion = ua.os.version;

                                          item.time = moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss');
                                          arr.push(item);
                                          callback(null,null);
                                    }, function(err) {
                                          arr.sort(function(a,b){
                                                return new Date(b.updatedAt) - new Date(a.updatedAt);
                                          });
                                          res.view('history',{layout: 'layout2',theChatRooms:arr});
                                    });
                                    //return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"chatRooms":theChatRooms});
                              });
                        }
                  });
            }
            
	},
};
