/**
 * ChatRoomsActive.js
 *
 */

var uuid = require('uuid');

module.exports = {

	attributes: {

  		cacheKey:{
			  type:'string',
			  required: true
  		},
		apiKey:{
			type:'string',
			required: true
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