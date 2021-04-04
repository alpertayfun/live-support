/**
 * Log.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 *
**/

module.exports = {
  attributes: {
    name: {
      type: 'string'
    },
    data: {
      type: 'string'
    },
    ip: {
      type: 'string'
    },
    headers:{
        type:'json'
    },
    ipInfo:{
      type:'json'
    },
	  apiKey: {
      type: 'string'
    },
    cacheKey: {
      type: 'string'
    },
	  createdAt: {
      type: 'date'
    },
	  updatedAt: {
      type: 'date'
    }
  }
};
