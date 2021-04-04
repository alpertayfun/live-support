/**
 * Origins.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uuid = require('uuid');


module.exports = {

	attributes: {

      name:{
        type:'string',
        required:true
      },
      email:{
        type:'string',
        required:true
      },
      pass:{
        type:'string',
        required:true
      },
      status:{
        type:'string',
        required:true
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