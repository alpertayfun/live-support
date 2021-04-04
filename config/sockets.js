/**
 * WebSocket Server Settings
 * (sails.config.sockets)
 *
 * These settings provide transparent access to the options for Sails'
 * encapsulated WebSocket server, as well as some additional Sails-specific
 * configuration layered on top.
 *
 * For more information on sockets configuration, including advanced config options, see:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.sockets.html
 */

var redis = require('redis');
var redisclient = redis.createClient();
var y24 = (60*1000)*24;
var querystring = require('querystring');

module.exports.sockets = {

  adapter: 'socket.io-redis',
  host: '127.0.0.1',
  port: 6379,
  grant3rdPartyCookie: true,
  beforeConnect: function(handshake, cb) {
    console.log("socket >>>>>");
    console.log(JSON.stringify(querystring.parse(handshake.url, null, null)));
    var q = JSON.stringify(querystring.parse(handshake.url, null, null));
    var a = JSON.parse(q);
    if(q.includes("__version_of_bot") && q.includes("__api_key") && q.includes("__company_id") ){
      console.log("Bot Version Check : " + a.__version_of_bot);
      console.log("Api Key : " + a.__api_key);
      console.log("Company Id : " + a.__company_id);
    }
    console.log("socket >>>>>");
    var createdAt = new Date();
    var updatedAt = new Date();
    if(handshake.hasOwnProperty("_query")){
        const query = JSON.parse(JSON.stringify(handshake._query)); 
        if(query.hasOwnProperty("apiKey") && query.hasOwnProperty("cacheKey")){
          redisclient.exists("botKey"+query.cacheKey, function(err, reply) {
              if (reply === 1) {
                  ChatRooms.findOne({ cacheKey:query.cacheKey,apiKey:query.apiKey}).exec(function (err, theChatRooms) {
                      if (err) console.log(err);
                      if (!theChatRooms) 
                      {
                          return cb(null, true);               
                      }else{
                          ChatRooms.update({ cacheKey:query.cacheKey,apiKey:query.apiKey },{status:"1",updatedAt:updatedAt}).exec(function afterwards(err, updated){
                              if(err) console.log(err);
                              setRedis("botKey"+query.cacheKey,"",y24);
                              return cb(null, true);
                          });
                      }
                  }); 
              }else{
                return cb(null, true);
              }
          });
          
        }else{
          return cb(null, true);
        }
        
    }else{
        return cb(null, true);
    }
  },
  afterDisconnect: function(session, socket, cb) {
    var createdAt = new Date();
    var updatedAt = new Date();
    if(socket.handshake.hasOwnProperty("query") && socket.handshake.query.hasOwnProperty("cacheKey")){
      //console.log("asdasda1");
      ChatRooms.findOne({ cacheKey:socket.handshake.query.cacheKey,apiKey:socket.handshake.query.apiKey}).exec(function (err, theChatRooms) {
          if (err) return cb();
          if (!theChatRooms)
          {
            return cb();
          }else{
              ChatRooms.update({ cacheKey:socket.handshake.query.cacheKey,apiKey:socket.handshake.query.apiKey },{status:"0",updatedAt:updatedAt}).exec(function afterwards(err, updated){
                  if(err) return cb();
                  //console.log(updated);
                  return cb();
              });
          }
      }); 
    }else{
      //console.log("asdasda5");
      return cb();
    }
   

    
  },
  transports: ["polling", "websocket","xhr-polling","jsonp-polling"]

};


function setRedis(key,data,time){
    redisclient.set(key, data, redis.print);
    redisclient.expire(key, time);
}