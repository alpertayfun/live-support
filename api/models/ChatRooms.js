/**
 * ChatRooms.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var uuid = require('uuid');

module.exports = {

	attributes: {

  		cacheKey:{
  			type:'string',
  			unique: true,
        defaultsTo: function() {
          return uuid.v4();
        }
  		},
      apiKey:{
        type:'string',
        required: true
      },
  		status:{
  			type:'string',
  			required:true
  		},
      isBotActive:{
        type:'string'
      },
  		headers:{
  			type:'json'
  		},
      ipInfo:{
        type:'json'
      },
  		createdAt: {
  			type:'date',
  			required:true
  		},
  		updatedAt: {
  			type:'date',
  			required:true
  		}
		
		
  		
	}
};