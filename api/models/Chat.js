/**
 * Chat.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uuid = require('uuid');


module.exports = {

	attributes: {

    messageId:{
      type:'string',
      unique: true,
      defaultsTo: function() {
        return uuid.v4();
      }
    },
  		message:{
  			type:'string',
  			required:true
  		},
      from:{
        type:'string',
        required:true
      },
  		status:{
  			type:'integer'
  		},
		cacheKey:{
			type:'string'
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