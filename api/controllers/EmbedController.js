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
            var params = req.params.all();
            console.log(req.headers.origin);

            if(params.hasOwnProperty("id")){
                  Company.findOne({ apiKey:params.id, status:"1" }).exec(function (err, theCompany) {
                        if(err) console.log(err);
                        if(theCompany){
                              Origins.findOne({ origin:req.headers.origin, status:"1",companyId:theCompany.companyId }).exec(function (err, theOrigins) {
                                    if(err) console.log(err);
                                    if(theOrigins){
                                          res.type('text/javascript');
                                          res.view('embed',{layout:"embedlayout",apiKey:params.id,companyId:theCompany.companyId});
                                    }else{
                                          return res.send({"errorCode":"02","errorText":res.i18n("Embed Not Found"),"errorUUID":uuid.v4()});
                                    }
                              });
                        }else{
                              return res.send({"errorCode":"02","errorText":res.i18n("Embed Not Found"),"errorUUID":uuid.v4()});
//                            return res.serverError('Embed Not Found');
                        }
                  });
            }else{
                  return res.send({"errorCode":"02","errorText":res.i18n("Embed Not Found"),"errorUUID":uuid.v4()});
            }
            
	}
};
