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
            if(req.query.hasOwnProperty("id")){
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
                                    ChatRooms.findOne({ cacheKey:req.query.id }).exec(function (err, theChatRooms) {
                                          if(err) console.log(err);
                                          if(theChatRooms){
                                                Chat.find({ cacheKey:req.query.id,status:"1" }).sort("createdAt DESC").exec(function (err, theChats) {
                                                      if(err) console.log(err);
                                                      //console.log(theChats);
                                                      var arr = [];
                                                      if (!theChats.length<=0){
                                                            async.forEach(theChats, function (item, callback){
                                                                  item.time = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss');
                                                                  item.messagesOld = item.message.replace('\\n', "<br />").replace('\n',"<br />");
                                                                  if(item.messagesOld.length>100){
                                                                        item.messages = item.messagesOld.slice(0,100)+"...";
                                                                  }else{
                                                                        item.messages = item.messagesOld;
                                                                  }
                                                                  arr.push(item);
                                                                  callback(null,null);
                                                            }, function(err) {
                                                                  arr.sort(function(a,b){
                                                                          return new Date(b.createdAt) - new Date(a.createdAt);
                                                                  });
                                                                  res.view('detail',{layout: 'layout4',theChatRooms:arr,ids:req.query.id,detail:theChatRooms});
                                                            });
                                                      }else{
                                                            res.view('detail',{layout: 'layout4',theChatRooms:arr,ids:req.query.id,detail:theChatRooms});
                                                      }

                                                      //return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"chatRooms":theChatRooms});
                                                });
                                          }else{
                                                res.redirect('ActiveChats');
                                          }
                                    });

                                    
                              }
                        });
                        
                  }
            }else{
                  res.redirect('ActiveChats');
            }
		
	},
};
