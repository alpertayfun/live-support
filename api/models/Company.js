/**
 * Origins.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uuid = require('uuid');


module.exports = {

	attributes: {

      companyId:{
        type:'string',
        unique: true,
        defaultsTo: function() {
          return uuid.v4();
        }
      },
    	status:{
  			type:'string',
        required:true
  		},
      name:{
        type:'string',
        required:true
      },
      email:{
        type:'string',
        required:true
      },
      apiKey:{
        type:'string',
        required:true
      },
  		apiKeyExpire: {
        type:'date',
        required:true
      },
      pass:{
        type:'string',
        required:true
      },
      isBotActive:{
        type:'string'
      },
      styles:{
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