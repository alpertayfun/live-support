const botBuilder = require('claudia-bot-builder');
const excuse = require('huh');
const wiki = require('wikijs').default;
//ekle yeni

var uuid = require("uuid");
var md5 = require('md5');
var redis = require('redis');
var redisclient = redis.createClient();
var async = require("async");
var moment = require('moment');
var IPinfo = require("node-ipinfo");
var accessToken = "da862df3c3d2d1";
var btoa = require('btoa');
var request = require('request');
var weather = require('weather-js');
var parser = require('ua-parser-js');

var texts  = {};
texts.authError = "Auth Error";
texts.error = "Error";
texts.authSuccess = "Success";
texts.onlyPostAction = "Only Post Action";
var y24 = (60*1000)*24;

module.exports = {

    answer: function(req, res) {
            var headerSS = {};

            var params = req.params.all();
            var createdAt = new Date();
            var updatedAt = new Date();
            var arr = [];
            var returnedParams = {};
            var y24 = (60*1000)*24;

            var gets = function(reqParam){
                console.log(reqParam);

                if(reqParam.hasOwnProperty('words') && reqParam.hasOwnProperty('cacheKey')){
                    var cacheKey = reqParam.cacheKey;
                    if(cacheKey==null || cacheKey==""){
                        return res.send({"errorCode":"02","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                    }else{

                        
                            ChatRooms.findOne({ cacheKey:reqParam.cacheKey,apiKey:reqParam.apiKey }).exec(function (err, theChatRooms) {
                                if (err) return console.log(err);
                                if (!theChatRooms) 
                                {
                                    return res.send({"errorCode":"02","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                                }else{
                                    if(theChatRooms.isBotActive.indexOf("1") !=-1){
                                        Chat.create({cacheKey:cacheKey,message:reqParam.words,status:"1",from:"self",createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                            if(err) console.log(err);
                                            console.log(created);
                                            var chatCreated = created;
                                            Log.create({name:'CHAT_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'Chat '+created.id+'Created By User',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                    if(err) console.log(err);
                                                    console.log(created);
                                                    var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":chatCreated};
                                                    sails.sockets.broadcast(cacheKey,'incomingFromUser',datas,req);

                                                    reqParam.words = reqParam.words.toLowerCase();
                                                    
                                                    if(reqParam.words.toLowerCase() == "ping"){
                                                        returnedParams.words = "pong";
                                                    }else if(reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "help" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "hello" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "hi" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "good morning" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "good night" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "good afternoon"){
                                                        returnedParams.words = "Greetings,\\nHow can i help you?";
                                                    }else if(reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "yardım" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "yardimci" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "yardımcı" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "yardım" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "yardımcı olur" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "yardimci olur" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "yardımcı olur musun" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "yardimci olur musun" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "yardımcı olur musunuz" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "yardimci olur musunuz" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "iyi akşamlar" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "günaydın"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "selam"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "as"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "aleyküm"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "aleyküm selam"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "iyi günler"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "sa"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "selamün aleyküm"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "selamün"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "ayol"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "Merhabalar"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "meraba"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "melaba"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "merhabalar"
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "merhaba"){
                                                        returnedParams.words = "Merhabalar,\\nNasıl yardımcı olabilirim?";
                                                    }else if(reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "nasılsın" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "nasilsin" ){
                                                        returnedParams.words = "Merhabalar İyiyim,\\nPeki size nasıl yardımcı olabilirim?";
                                                    }else if(reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "teşekkürler" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "teşekkür ederim" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "tesekkur ederim" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "teşekkür" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "tesekkur" 
                                                        || reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "tesekkurler" ){
                                                        returnedParams.words = "Ben teşekkür ederim.\\nBaşka yardımcı olacağım konu var mıdır?";
                                                    }else if(reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "istiyorum"){
                                                        returnedParams.words = "Merhabalar,\\nNe istediğinizi bana söylebilirsiniz!";
                                                    }else if(reqParam.words.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'') == "evet"){
                                                        returnedParams.words = "Sizi dinlemek için yaratıldım!\\nNe istediğinizi bana söylebilirsiniz!";
                                                    }else{
                                                        var wordsArr = reqParam.words.split(" ");
                                                        console.log(wordsArr);
                                                        if(wordsArr.includes("okey") || wordsArr.includes("101") || wordsArr.includes("oynamak") || wordsArr.includes("hemen")){
                                                            returnedParams.words = "Hemen şimdi oynayabilirsiniz!\\n<a href='http://caferummy.com/'>Bu linke tıklayınız.</a>";                      
                                                        }else if(wordsArr.includes("nasıl") && wordsArr.includes("oynanır")){
                                                            returnedParams.words = "Kurallar için.\\n<a href='https://caferummy.com/yardim'>Bu linke tıklayınız.</a>";                      
                                                        }else if(wordsArr.includes("nasıl") && wordsArr.includes("para") 
                                                            || wordsArr.includes("para") && wordsArr.includes("gönder")
                                                            || wordsArr.includes("para") && wordsArr.includes("al")
                                                            || wordsArr.includes("para") && wordsArr.includes("transfer")
                                                            || wordsArr.includes("para") && wordsArr.includes("transfer") && wordsArr.includes("et")
                                                            || wordsArr.includes("para") && wordsArr.includes("göndermek")
                                                            || wordsArr.includes("para") && wordsArr.includes("göndermek")  && wordsArr.includes("istiyorum")
                                                            || wordsArr.includes("para") && wordsArr.includes("almak")  && wordsArr.includes("istiyorum")
                                                            || wordsArr.includes("para") && wordsArr.includes("transfer")  && wordsArr.includes("istiyorum")
                                                         || wordsArr.includes("para") && wordsArr.includes("almak")
                                                          || wordsArr.includes("para") && wordsArr.includes("transfer")
                                                          || wordsArr.includes("ödeme") && wordsArr.includes("yardımı")
                                                          || wordsArr.includes("ödeme") && wordsArr.includes("yardım")
                                                           ){
                                                            returnedParams.words = "Para göndermek ve almak için.\\n<a href='https://caferummy.com/moneytransfer'>Bu linke tıklayınız.</a>";                      
                                                        }else if(wordsArr.includes("yardım") || wordsArr.includes("yardim") || wordsArr.includes("yardımcı")  || wordsArr.includes("yardimci")){
                                                            returnedParams.words = "Tabii ki de.\\nKurallar için.\\n<a href='https://caferummy.com/yardim'>Bu linke tıklayınız.</a>";                 
                                                        }else if(wordsArr.includes("hava") && wordsArr.includes("nasıl")
                                                            || wordsArr.includes("hava") && wordsArr.includes("kaç") && wordsArr.includes("derece")
                                                            || wordsArr.includes("hava")){
                                                            returnedParams.words = "Hava Durumu";
                                                        }else if(wordsArr.includes("döviz")){
                                                            returnedParams.words = "Doviz";
                                                        }else if(wordsArr.includes("dolar") && wordsArr.includes("kaç")){
                                                            returnedParams.words = "Dolar";
                                                        }else if(wordsArr.includes("altın") && wordsArr.includes("kaç")){
                                                            returnedParams.words = "Altin";
                                                        }else if(wordsArr.includes("altın") && wordsArr.includes("fiyatları")){
                                                            returnedParams.words = "Altin";
                                                        }else if(wordsArr.includes("altın")){
                                                            returnedParams.words = "Altin";
                                                        }else if(wordsArr.includes("dolar")){
                                                            returnedParams.words = "DolarSelf";
                                                        }else if(wordsArr.includes("euro") && wordsArr.includes("kaç")){
                                                            returnedParams.words = "Euro";
                                                        }else if(wordsArr.includes("euro")){
                                                            returnedParams.words = "EuroSelf";
                                                        }else if(wordsArr.includes("ak") || wordsArr.includes("am") || wordsArr.includes("göt") || wordsArr.includes("yarrak") || wordsArr.includes("orospu") 
                                                            || wordsArr.includes("pezevenk")
                                                            || wordsArr.includes("yavşak")
                                                            || wordsArr.includes("sex")
                                                            || wordsArr.includes("ananı")
                                                            || wordsArr.includes("aq")
                                                            || wordsArr.includes("amk")
                                                            ){
                                                            returnedParams.words = "Seviyesiz konuşmalar için yaratılmadım.Peki,\\nSize Nasıl yardımcı olabilirim?";
                                                        }else{
                                                            returnedParams.words = "Siz sorun ben yanıtlayayım!";
                                                        }
                                                    }

                                                    var getWiki = function(data){
                                                        console.log("getWiki >>>>");
                                                        console.log(data);
                                                        console.log("getWiki >>>>");
                                                        if(data==""){
                                                            returnedParams.words = "Siz sorun ben yanıtlayayım!";
                                                        }else{
                                                            if(data.indexOf("Error") !=-1){
                                                                returnedParams.words = "Siz sorun ben yanıtlayayım!";
                                                            }else{
                                                                returnedParams.words = data + "\\nPowered Wikipedia";
                                                            }
                                                        }
                                                        

                                                        Chat.create({cacheKey:cacheKey,message:returnedParams.words,status:"1",from:"system",createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                            if(err) console.log(err);
                                                            console.log(created);
                                                            setRedis("botKey"+cacheKey,"",y24);
                                                            returnedParams.createdAt = created.createdAt;
                                                            var chatCreated = created;
                                                            Log.create({name:'CHAT_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'Chat '+created.id+'Created By System',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                if(err) console.log(err);
                                                                console.log(created);
                                                                var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":chatCreated};
                                                                sails.sockets.broadcast(cacheKey,'incomingFromSystem',datas,req);
                                                                return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam,"returned":returnedParams});
                                                            });
                                                        });
                                                    };

                                                    if(returnedParams.words=="Siz sorun ben yanıtlayayım!"){
                                                        var wordNew = reqParam.words.replace("kimdir","").replace("kim","").replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                                                        console.log(wordNew);
                                                        wiki({ apiUrl: 'https://tr.wikipedia.org/w/api.php' })
                                                        .page(wordNew)
                                                        .then(page => page.summary())
                                                        .then(function(env) {
                                                            getWiki(env);
                                                        })
                                                        .catch(function(error) {
                                                            getWiki("Error");
                                                        });
                                                    }else if(returnedParams.words=="Altin"){
                                                        request.get({url:'https://finans.truncgil.com/today.json'}, function optionalCallback(err, httpResponse, body) {
                                                        if (err) {
                                                            return console.error('upload failed:', err);
                                                        }
                                                            var jsonArr = JSON.parse(body);
                                                            
                                                            returnedParams.words = "Altın fiyatlarında son durum. \\nGram Altın : " + jsonArr["Gram Altın"]["Alış"] 
                                                                                    + " TRY \\n Çeyrek Altın : " + jsonArr["Çeyrek Altın"]["Alış"] + " TRY"
                                                                                    + " TRY \\n Yarım Altın : " + jsonArr["Yarım Altın"]["Alış"] + " TRY"
                                                                                    + " TRY \\n Tam Altın : " + jsonArr["Tam Altın"]["Alış"] + " TRY"
                                                                                    + " TRY \\n Cumhuriyet Altını : " + jsonArr["Cumhuriyet Altını"]["Alış"] + " TRY"
                                                                                    + " TRY \\n Reşat Altın : " + jsonArr["Reşat Altın"]["Alış"] + " TRY"
                                                                                    + " TRY \\n Hamit Altın : " + jsonArr["Hamit Altın"]["Alış"] + " TRY"
                                                                                    + " TRY \\n İkibuçuk Altın : " + jsonArr["İkibuçuk Altın"]["Alış"] + " TRY"
                                                                                    + " TRY \\n Gremse Altın : " + jsonArr["Gremse Altın"]["Alış"] + " TRY"
                                                                                    + " TRY \\n Ons Altın : " + jsonArr["Ons Altın"]["Alış"] + " TRY"
                                                                                    + " TRY \\n 14 Ayar Altın : " + jsonArr["14 Ayar Altın"]["Alış"] + " TRY"
                                                                                    + " TRY \\n 18 Ayar Altın : " + jsonArr["18 Ayar Altın"]["Alış"] + " TRY"
                                                                                    + " TRY \\n 22 Ayar Bilezik : " + jsonArr["22 Ayar Bilezik"]["Alış"] + " TRY";

                                                            Chat.create({cacheKey:cacheKey,message:returnedParams.words,status:"1",from:"system",createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                if(err) console.log(err);
                                                                console.log(created);
                                                                setRedis("botKey"+cacheKey,"",y24);
                                                                returnedParams.createdAt = created.createdAt;
                                                                var chatCreated = created;
                                                                Log.create({name:'CHAT_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'Chat '+created.id+'Created By System',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                    if(err) console.log(err);
                                                                    console.log(created);
                                                                    var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":chatCreated};
                                                                    sails.sockets.broadcast(cacheKey,'incomingFromSystem',datas,req);
                                                                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam,"returned":returnedParams});
                                                                });
                                                            }); 
                                                        });
                                                    }else if(returnedParams.words=="Doviz"){
                                                        (async () => {
                                                            const TCMB_Doviz = require('tcmb-doviz');
                                                            const Doviz = new TCMB_Doviz();
                                                            //const ress = await Doviz.DovizListesi();
                                                            //console.log(ress);
                                                            const usd = await Doviz.getKur("USD"); 
                                                            const euro = await Doviz.getKur("EUR");
                                                            var arrDov = {usd:usd,euro:euro};
                                                            
                                                            returnedParams.words = "Döviz Kurlarında son durum. \\nDolar : " + arrDov.usd.satis + " TRY \\n Euro : " + arrDov.euro.satis + " TRY";

                                                            Chat.create({cacheKey:cacheKey,message:returnedParams.words,status:"1",from:"system",createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                if(err) console.log(err);
                                                                console.log(created);
                                                                setRedis("botKey"+cacheKey,"",y24);
                                                                returnedParams.createdAt = created.createdAt;
                                                                var chatCreated = created;
                                                                Log.create({name:'CHAT_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'Chat '+created.id+'Created By System',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                    if(err) console.log(err);
                                                                    console.log(created);
                                                                    var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":chatCreated};
                                                                    sails.sockets.broadcast(cacheKey,'incomingFromSystem',datas,req);
                                                                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam,"returned":returnedParams});
                                                                });
                                                            }); 
                                                        })();
                                                    }else if(returnedParams.words=="Dolar"){
                                                        (async () => {
                                                            const TCMB_Doviz = require('tcmb-doviz');
                                                            const Doviz = new TCMB_Doviz();
                                                            const usd = await Doviz.getKur("USD"); 

                                                            var regex = /\d+/g;
                                                            var matches = reqParam.words.match(regex);
                                                            console.log(matches[0]);

                                                            var lastThing = parseFloat(parseInt(matches[0]) * parseFloat(usd.satis)).toFixed(2);

                                                            returnedParams.words = "" + matches[0] + " Dolar : " + lastThing + " TRY yapmaktadır.";

                                                            Chat.create({cacheKey:cacheKey,message:returnedParams.words,status:"1",from:"system",createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                if(err) console.log(err);
                                                                console.log(created);
                                                                setRedis("botKey"+cacheKey,"",y24);
                                                                returnedParams.createdAt = created.createdAt;
                                                                var chatCreated = created;
                                                                Log.create({name:'CHAT_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'Chat '+created.id+'Created By System',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                    if(err) console.log(err);
                                                                    console.log(created);
                                                                    var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":chatCreated};
                                                                    sails.sockets.broadcast(cacheKey,'incomingFromSystem',datas,req);
                                                                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam,"returned":returnedParams});
                                                                });
                                                            }); 
                                                        })();
                                                    }else if(returnedParams.words=="Euro"){
                                                        (async () => {
                                                            const TCMB_Doviz = require('tcmb-doviz');
                                                            const Doviz = new TCMB_Doviz();
                                                            const euro = await Doviz.getKur("EUR"); 

                                                            var regex = /\d+/g;
                                                            var matches = reqParam.words.match(regex);
                                                            console.log(matches[0]);

                                                            var lastThing = parseFloat(parseInt(matches[0]) * parseFloat(euro.satis)).toFixed(2);

                                                            returnedParams.words = "" + matches[0] + " Euro : " + lastThing + " TRY yapmaktadır.";

                                                            Chat.create({cacheKey:cacheKey,message:returnedParams.words,status:"1",from:"system",createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                if(err) console.log(err);
                                                                console.log(created);
                                                                setRedis("botKey"+cacheKey,"",y24);
                                                                returnedParams.createdAt = created.createdAt;
                                                                var chatCreated = created;
                                                                Log.create({name:'CHAT_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'Chat '+created.id+'Created By System',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                    if(err) console.log(err);
                                                                    console.log(created);
                                                                    var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":chatCreated};
                                                                    sails.sockets.broadcast(cacheKey,'incomingFromSystem',datas,req);
                                                                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam,"returned":returnedParams});
                                                                });
                                                            }); 
                                                        })();
                                                    }else if(returnedParams.words=="DolarSelf"){
                                                        (async () => {
                                                            const TCMB_Doviz = require('tcmb-doviz');
                                                            const Doviz = new TCMB_Doviz();
                                                            const usd = await Doviz.getKur("USD"); 
                                                            var arrDov = {usd:usd};

                                                            returnedParams.words = "Dolar Kurunda son durum. \\nDolar : " + arrDov.usd.satis + " TRY";

                                                            Chat.create({cacheKey:cacheKey,message:returnedParams.words,status:"1",from:"system",createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                if(err) console.log(err);
                                                                console.log(created);
                                                                setRedis("botKey"+cacheKey,"",y24);
                                                                returnedParams.createdAt = created.createdAt;
                                                                var chatCreated = created;
                                                                Log.create({name:'CHAT_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'Chat '+created.id+'Created By System',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                    if(err) console.log(err);
                                                                    console.log(created);
                                                                    var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":chatCreated};
                                                                    sails.sockets.broadcast(cacheKey,'incomingFromSystem',datas,req);
                                                                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam,"returned":returnedParams});
                                                                });
                                                            }); 
                                                        })();
                                                    }else if(returnedParams.words=="EuroSelf"){
                                                        (async () => {
                                                            const TCMB_Doviz = require('tcmb-doviz');
                                                            const Doviz = new TCMB_Doviz();
                                                            const euro = await Doviz.getKur("USD"); 
                                                            var arrDov = {euro:euro};

                                                            returnedParams.words = "Euro Kurunda son durum. \\nEuro : " + arrDov.euro.satis + " TRY";

                                                            Chat.create({cacheKey:cacheKey,message:returnedParams.words,status:"1",from:"system",createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                if(err) console.log(err);
                                                                console.log(created);
                                                                setRedis("botKey"+cacheKey,"",y24);
                                                                returnedParams.createdAt = created.createdAt;
                                                                var chatCreated = created;
                                                                Log.create({name:'CHAT_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'Chat '+created.id+'Created By System',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                    if(err) console.log(err);
                                                                    console.log(created);
                                                                    var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":chatCreated};
                                                                    sails.sockets.broadcast(cacheKey,'incomingFromSystem',datas,req);
                                                                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam,"returned":returnedParams});
                                                                });
                                                            }); 
                                                        })();
                                                    }else if(returnedParams.words=="Hava Durumu"){
                                                        var oldcity = wordsArr[0];
                                                        var city = "";
                                                        if(oldcity.indexOf("'") !=-1){
                                                            var cityNarr = oldcity.split("'"); 
                                                            city=cityNarr[0];
                                                        }else{
                                                            city=oldcity;
                                                        }
                                                        weather.find({search: city+', Turkey', degreeType: 'C' , lang:'tr-TR'}, function(err, result) {
                                                            if(err){
                                                                returnedParams.words = "Siz sorun ben yanıtlayayım!";
                                                            }else{
                                                                if(result[0]){
                                                                    returnedParams.words = capitalizeFirstLetter(city)+" şehrinde hava "+result[0].current.temperature+" &deg; ve "+result[0].current.skytext+".\\nBugün günlerden "+ result[0].current.day +".";
                                                                }else{
                                                                    returnedParams.words = "Siz sorun ben yanıtlayayım!";
                                                                }
                                                            }

                                                            console.log(result[0].current);
                                                            console.log(result[0].current.temperature);
                                                            console.log(result[0].current.skytext);
                                                            console.log(result[0].current.day);
                                                            console.log(result[0].current.winddisplay);
                                                            console.log(result[0].current.humidity);

                                                            Chat.create({cacheKey:cacheKey,message:returnedParams.words,status:"1",from:"system",createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                if(err) console.log(err);
                                                                console.log(created);
                                                                setRedis("botKey"+cacheKey,"",y24);
                                                                returnedParams.createdAt = created.createdAt;
                                                                var chatCreated = created;
                                                                Log.create({name:'CHAT_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'Chat '+created.id+'Created By System',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                    if(err) console.log(err);
                                                                    console.log(created);
                                                                    var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":chatCreated};
                                                                    sails.sockets.broadcast(cacheKey,'incomingFromSystem',datas,req);
                                                                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam,"returned":returnedParams});
                                                                });
                                                            });           

                                                        });
                                                    }else{
                                                        Chat.create({cacheKey:cacheKey,message:returnedParams.words,status:"1",from:"system",createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                            if(err) console.log(err);
                                                            console.log(created);
                                                            setRedis("botKey"+cacheKey,"",y24);
                                                            returnedParams.createdAt = created.createdAt;
                                                            var chatCreated = created;
                                                            Log.create({name:'CHAT_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'Chat '+created.id+'Created By System',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                                if(err) console.log(err);
                                                                console.log(created);
                                                                var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":chatCreated};
                                                                sails.sockets.broadcast(cacheKey,'incomingFromSystem',datas,req);
                                                                return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam,"returned":returnedParams});
                                                            });
                                                        });
                                                    }
                                            });
                                        });
                                    }else{
                                        Chat.create({cacheKey:cacheKey,message:reqParam.words,status:"1",from:"self",createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                            if(err) console.log(err);
                                            var chatCreated = created;
                                            Log.create({name:'CHAT_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'Chat '+created.id+'Created By User',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                if(err) console.log(err);
                                                console.log(created);
                                                setRedis("botKey"+cacheKey,"",y24);
                                                var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":chatCreated};
                                                sails.sockets.broadcast(cacheKey,'incomingFromUser',datas,req);
                                                return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam,"returned":returnedParams});

                                            });
                                        });

                                    }
                                    
                                }
                            });

                        
                        
                        
                    }
                    
                }
                
            };

            if(req.isSocket)
            {
                headerSS = {host:req.socket.handshake.headers["host"],'x-real-ip':req.socket.handshake.headers["x-real-ip"],'x-forwarded-for':req.socket.handshake.headers["x-forwarded-for"],connection:req.socket.handshake.headers["connection"],'content-length':req.socket.handshake.headers["content-length"],'accept-encoding':req.socket.handshake.headers["accept-encoding"],'cf-ipcountry':req.socket.handshake.headers["cf-ipcountry"],accept:req.socket.handshake.headers["accept"],origin:req.socket.handshake.headers["origin"],'user-agent':req.socket.handshake.headers["user-agent"],'content-type':req.socket.handshake.headers["content-type"],'referer':req.socket.handshake.headers["referer"],'accept-language':req.socket.handshake.headers["accept-language"],'cf-connecting-ip':req.socket.handshake.headers["cf-connecting-ip"]};                  

                //token = req.socket.handshake.query.param;
                var paramsFromSocket = params = req.params.all();
                Origins.findOne({ origin:req.socket.handshake.headers["origin"],status:"1" }).exec(function (err, theOrigins) {
                    if (err) return console.log(err);
                    if (!theOrigins) 
                    {
                        return res.send({"errorCode":"04","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                    }else{
                        Company.findOne({ apiKey:paramsFromSocket.apiKey,status:"1" }).exec(function (err, theCompany) {
                            if (err) return console.log(err);
                            if (!theCompany) 
                            {
                                return res.send({"errorCode":"05","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                            }else{
                                if (moment(theCompany.apiKeyExpire).isBefore(createdAt))
                                {
                                    return res.send({"errorCode":"06","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                                }else{
                                    gets(paramsFromSocket);
                                }
                                
                            }
                        });
                    }
                });
            }else if(req.method == "POST"){
                headerSS = {host:req.headers["host"],'x-real-ip':req.headers["x-real-ip"],'x-forwarded-for':req.headers["x-forwarded-for"],connection:req.headers["connection"],'content-length':req.headers["content-length"],'accept-encoding':req.headers["accept-encoding"],'cf-ipcountry':req.headers["cf-ipcountry"],accept:req.headers["accept"],origin:req.headers["origin"],'user-agent':req.headers["user-agent"],'content-type':req.headers["content-type"],'referer':req.headers["referer"],'accept-language':req.headers["accept-language"],'cf-connecting-ip':req.headers["cf-connecting-ip"]};

                Origins.findOne({ origin:req.headers["origin"],status:"1" }).exec(function (err, theOrigins) {
                    if (err) return console.log(err);
                    if (!theOrigins) 
                    {
                        return res.send({"errorCode":"04","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                    }else{
                        Company.findOne({ apiKey:params.apiKey,status:"1" }).exec(function (err, theCompany) {
                            if (err) return console.log(err);
                            if (!theCompany) 
                            {
                                return res.send({"errorCode":"05","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                            }else{
                                if (moment(theCompany.apiKeyExpire).isBefore(createdAt))
                                {
                                    return res.send({"errorCode":"06","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                                }else{
                                    gets(params);

                                }
                                
                            }
                        });
                    }
                });
            }else{
                    return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
            }
    },
    getKey:function(req,res){

            var headerSS = {};
            var params = req.params.all();
            var cacheKey = "";
            var createdAt = new Date();
            var updatedAt = new Date();
            var ipinfo = new IPinfo(accessToken);
            console.log(req.cookies);
            var y24 = (60*1000)*24;

            var welcomeMessage = function(reqParam,cacheKey){
                setTimeout(function(){
                    var data = '{ "cacheKey" : "'+cacheKey+'"}';
                    var json_obj = JSON.parse(data);
                    request.post({
                        headers: {'content-type': 'application/json'},
                        method: 'POST',
                        url:     'http://localhost:1337/api/welcomeMessageToUserFromBackend',
                        form: json_obj
                    }, function(error, response, body){
                        console.log(body);
                    });
                },3000);
            };

            var gets = function(reqParam,theCompany){
                console.log(reqParam);
                if(reqParam.hasOwnProperty('cacheKey') && reqParam.hasOwnProperty("apiKey")){
                    cacheKey = reqParam.cacheKey;
                    redisclient.exists("botKey"+cacheKey, function(err, reply) {

                        if (reply === 1) {
                            setRedis("botKey"+cacheKey,"",y24);
                            ChatRooms.findOne({ cacheKey:cacheKey }).exec(function (err, theChatRooms) {
                                if (err) return console.log(err);
                                if (!theChatRooms) 
                                {
                                    console.log("yok");
                                    ipinfo.lookupIp(headerSS["cf-connecting-ip"]).then((response) => {
                                        ChatRooms.create({apiKey:reqParam.apiKey,cacheKey:cacheKey,status:"1",headers:headerSS,ipInfo:response,createdAt:createdAt,updatedAt:updatedAt,isBotActive:theCompany.isBotActive}).exec(function createCB(err, created){
                                            if(err) console.log(err);
                                            Log.create({name:'CHATROOMS_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'ChatRooms Created By User',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                  if(err) console.log(err);
                                            });
                                            sails.sockets.join(req, cacheKey ,function(err) {
                                                if (err) {
                                                  console.log(err);
                                                }else{
                                                    welcomeMessage(reqParam,cacheKey);
                                                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"cacheKey":cacheKey});

                                                }
                                            });
                                        });
                                    });
                                }else{
                                    console.log("var");
                                    console.log({ cacheKey:cacheKey , status:"1" });
                                    console.log("var");

                                    Chat.find({ cacheKey:cacheKey,status:"1"}).exec(function (err, theChats) {
                                        if(err) console.log(err);
                                        Log.findOne({cacheKey:cacheKey,apiKey:reqParam.apiKey,ip:headerSS["cf-connecting-ip"]}).exec(function (err, theLogs){
                                            if(err) console.log(err);
                                            if(theLogs){
                                                sails.sockets.join(req, cacheKey ,function(err) {
                                                    if (err) {
                                                      console.log(err);
                                                    }else{
                                                        ChatRooms.update({ cacheKey:cacheKey,apiKey:reqParam.apiKey },{status:"1",isBotActive:theCompany.isBotActive,updatedAt:updatedAt}).exec(function afterwards(err, updated){
                                                            if(err) console.log(err);
                                                        });
                                                        return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"cacheKey":cacheKey,"chats":theChats});
                                                    }
                                                });
                                            }else{

                                                ipinfo.lookupIp(headerSS["cf-connecting-ip"]).then((response) => {
                                                    if(theChatRooms.isBotActive.indexOf("1") !=-1){
                                                        ChatRooms.update({ cacheKey:cacheKey,apiKey:reqParam.apiKey },{status:"1",isBotActive:theCompany.isBotActive,headers:headerSS,ipInfo:response,updatedAt:updatedAt}).exec(function afterwards(err, updated){
                                                            if(err) console.log(err);
                                                        });
                                                    }else{
                                                        ChatRooms.update({ cacheKey:cacheKey,apiKey:reqParam.apiKey },{status:"1",headers:headerSS,ipInfo:response,updatedAt:updatedAt}).exec(function afterwards(err, updated){
                                                            if(err) console.log(err);
                                                        });
                                                    }
                                                    
                                                });
                                                Log.create({name:'CHATROOMS_IP_CHANGED',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'ChatRooms Ip Changed By User',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                    if(err) console.log(err);
                                                    console.log(created);
                                                    sails.sockets.join(req, cacheKey ,function(err) {
                                                        if (err) {
                                                          console.log(err);
                                                        }else{
                                                            return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"cacheKey":cacheKey,"chats":theChats});
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        }else{
                            console.log("reply 2");

                            cacheKey = ""+uuid.v4()+"";
                            setRedis("botKey"+cacheKey,"",y24);
                            ChatRooms.findOne({ cacheKey:cacheKey }).exec(function (err, theChatRooms) {
                                if (err) return console.log(err);
                                if (!theChatRooms) 
                                {
                                    console.log("yok1");

                                    ipinfo.lookupIp(headerSS["cf-connecting-ip"]).then((response) => {
                                        ChatRooms.create({apiKey:reqParam.apiKey,cacheKey:cacheKey,status:"1",isBotActive:theCompany.isBotActive,headers:headerSS,ipInfo:response,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                            if(err) console.log(err);
                                            console.log(created);
                                            Log.create({name:'CHATROOMS_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'ChatRooms Created By User',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                  if(err) console.log(err);
                                                  console.log(created);
                                            });
                                            sails.sockets.join(req, cacheKey ,function(err) {
                                                if (err) {
                                                  console.log(err);
                                                }else{
                                                    welcomeMessage(reqParam,cacheKey);
                                                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"cacheKey":cacheKey});
                                                }
                                            });
                                        });
                                    });
                                }else{
                                    console.log("var1");

                                    Chat.find({ cacheKey:cacheKey , status:"1" }).exec(function (err, theChats) {
                                        if(err) console.log(err);
                                        console.log(theChats);
                                        Log.findOne({cacheKey:cacheKey,apiKey:reqParam.apiKey,ip:headerSS["cf-connecting-ip"]}).exec(function (err, theLogs){
                                            if(err) console.log(err);
                                            if(theLogs){
                                                sails.sockets.join(req, cacheKey ,function(err) {
                                                    if (err) {
                                                      console.log(err);
                                                    }else{
                                                        //update time
                                                        ChatRooms.update({ cacheKey:cacheKey,apiKey:reqParam.apiKey },{status:"1",isBotActive:theChatRooms.isBotActive,updatedAt:updatedAt}).exec(function afterwards(err, updated){
                                                            if(err) console.log(err);
                                                        });
                                                        return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"cacheKey":cacheKey,"chats":theChats});
                                                    }
                                                });
                                            }else{
                                                ipinfo.lookupIp(headerSS["cf-connecting-ip"]).then((response) => {
                                                    if(theChatRooms.isBotActive.indexOf("1") !=-1){
                                                        ChatRooms.update({ cacheKey:cacheKey,apiKey:reqParam.apiKey },{status:"1",isBotActive:theChatRooms.isBotActive,headers:headerSS,ipInfo:response,updatedAt:updatedAt}).exec(function afterwards(err, updated){
                                                            if(err) console.log(err);
                                                        });
                                                    }else{
                                                        ChatRooms.update({ cacheKey:cacheKey,apiKey:reqParam.apiKey },{status:"1",isBotActive:theChatRooms.isBotActive,headers:headerSS,ipInfo:response,updatedAt:updatedAt}).exec(function afterwards(err, updated){
                                                            if(err) console.log(err);
                                                        });
                                                    }
                                                });
                                                Log.create({name:'CHATROOMS_IP_CHANGED',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'ChatRooms Ip Changed By User',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                                    if(err) console.log(err);
                                                    console.log(created);
                                                    sails.sockets.join(req, cacheKey ,function(err) {
                                                        if (err) {
                                                          console.log(err);
                                                        }else{
                                                            return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"cacheKey":cacheKey,"chats":theChats});
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    });
                                }
                            });

                        }
                    });

                }else{
                    cacheKey = ""+uuid.v4()+"";
                    setRedis("botKey"+cacheKey,"",y24);
                    ChatRooms.findOne({ cacheKey:cacheKey }).exec(function (err, theChatRooms) {
                        if (err) return console.log(err);
                        if (!theChatRooms) 
                        {

                            ipinfo.lookupIp(headerSS["cf-connecting-ip"]).then((response) => {
                                ChatRooms.create({apiKey:reqParam.apiKey,cacheKey:cacheKey,status:"1",isBotActive:theCompany.isBotActive,headers:headerSS,ipInfo:response,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                    if(err) console.log(err);
                                    Log.create({name:'CHATROOMS_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'ChatRooms Created By User',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                        if(err) console.log(err);
                                        sails.sockets.join(req, cacheKey ,function(err) {
                                            if (err) {
                                              console.log(err);
                                            }else{
                                                welcomeMessage(reqParam,cacheKey);
                                                return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"cacheKey":cacheKey});
                                            }
                                        });
                                    });
                                });
                            });
                        }else{
                                    console.log("var2");

                            Chat.find({ cacheKey:cacheKey , status:"1" }).exec(function (err, theChats) {
                                if(err) console.log(err);
                                console.log(theChats);
                                Log.findOne({cacheKey:cacheKey,apiKey:reqParam.apiKey,ip:headerSS["cf-connecting-ip"]}).exec(function (err, theLogs){
                                    if(err) console.log(err);
                                    if(theLogs){
                                        sails.sockets.join(req, cacheKey ,function(err) {
                                            if (err) {
                                              console.log(err);
                                            }else{
                                                ChatRooms.update({ cacheKey:cacheKey,apiKey:reqParam.apiKey },{status:"1",isBotActive:theChatRooms.isBotActive,updatedAt:updatedAt}).exec(function afterwards(err, updated){
                                                    if(err) console.log(err);
                                                });
                                                return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"cacheKey":cacheKey,"chats":theChats});
                                            }
                                        });
                                    }else{
                                        ipinfo.lookupIp(item.headers["cf-connecting-ip"]).then((response) => {
                                            if(theChatRooms.isBotActive.indexOf("1") !=-1){
                                                ChatRooms.update({ cacheKey:cacheKey,apiKey:reqParam.apiKey },{status:"1",isBotActive:theChatRooms.isBotActive,headers:headerSS,ipInfo:response,updatedAt:updatedAt}).exec(function afterwards(err, updated){
                                                    if(err) console.log(err);
                                                });
                                            }else{
                                                ChatRooms.update({ cacheKey:cacheKey,apiKey:reqParam.apiKey },{status:"1",isBotActive:theChatRooms.isBotActive,headers:headerSS,ipInfo:response,updatedAt:updatedAt}).exec(function afterwards(err, updated){
                                                    if(err) console.log(err);
                                                });
                                            }
                                            
                                        });
                                        Log.create({name:'CHATROOMS_IP_CHANGED',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'ChatRooms Ip Changed By User',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                            if(err) console.log(err);
                                            console.log(created);
                                            sails.sockets.join(req, cacheKey ,function(err) {
                                                if (err) {
                                                  console.log(err);
                                                }else{
                                                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"cacheKey":cacheKey,"chats":theChats});
                                                }
                                            });
                                        });
                                    }
                                });
                            });
                        }
                    });
                }

                
            };

            if(req.isSocket)
            {
                //console.log(req.socket.handshake);
                var paramsFromSocket = params = req.params.all();
                headerSS = {host:req.socket.handshake.headers["host"],'x-real-ip':req.socket.handshake.headers["x-real-ip"],'x-forwarded-for':req.socket.handshake.headers["x-forwarded-for"],connection:req.socket.handshake.headers["connection"],'content-length':req.socket.handshake.headers["content-length"],'accept-encoding':req.socket.handshake.headers["accept-encoding"],'cf-ipcountry':req.socket.handshake.headers["cf-ipcountry"],accept:req.socket.handshake.headers["accept"],origin:req.socket.handshake.headers["origin"],'user-agent':req.socket.handshake.headers["user-agent"],'content-type':req.socket.handshake.headers["content-type"],'referer':req.socket.handshake.headers["referer"],'accept-language':req.socket.handshake.headers["accept-language"],'cf-connecting-ip':req.socket.handshake.headers["cf-connecting-ip"]};                  
                //token = req.socket.handshake.query.param;
                if(req.socket.handshake.headers["user-agent"].indexOf("bot") !=-1 
                    || req.socket.handshake.headers["user-agent"].indexOf("Bot") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("AOLBuild") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("Baidu") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("msnbot") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("bingbot") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("DuckDuckBot") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("Googlebot") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("Mediapartners") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("Teoma") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("Yahoo") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("yandex") !=-1){ 
                    console.log("bot");
                    return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                }else{
                    console.log("Origins");
                    Origins.findOne({ origin:req.socket.handshake.headers["origin"],status:"1" }).exec(function (err, theOrigins) {
                        if (err) return console.log(err);
                        if (!theOrigins) 
                        {
                            console.log("Origins error");
                            return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                        }else{
                            Company.findOne({ apiKey:params.apiKey,status:"1" }).exec(function (err, theCompany) {
                                if (err) return console.log(err);
                                if (!theCompany) 
                                {
                                    return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                                }else{
                                    if (moment(theCompany.apiKeyExpire).isBefore(createdAt))
                                    {
                                        return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                                    }else{
                                        gets(paramsFromSocket,theCompany);
                                    }
                                    
                                }
                            });
                        }
                    });
                    
                }
            }else if(req.method == "POST"){
                headerSS = {host:req.headers["host"],'x-real-ip':req.headers["x-real-ip"],'x-forwarded-for':req.headers["x-forwarded-for"],connection:req.headers["connection"],'content-length':req.headers["content-length"],'accept-encoding':req.headers["accept-encoding"],'cf-ipcountry':req.headers["cf-ipcountry"],accept:req.headers["accept"],origin:req.headers["origin"],'user-agent':req.headers["user-agent"],'content-type':req.headers["content-type"],'referer':req.headers["referer"],'accept-language':req.headers["accept-language"],'cf-connecting-ip':req.headers["cf-connecting-ip"]};

                if(req.headers["user-agent"].indexOf("bot") !=-1 
                    || req.headers["user-agent"].indexOf("Bot") !=-1
                    || req.headers["user-agent"].indexOf("AOLBuild") !=-1
                    || req.headers["user-agent"].indexOf("Baidu") !=-1
                    || req.headers["user-agent"].indexOf("msnbot") !=-1
                    || req.headers["user-agent"].indexOf("bingbot") !=-1
                    || req.headers["user-agent"].indexOf("DuckDuckBot") !=-1
                    || req.headers["user-agent"].indexOf("Googlebot") !=-1
                    || req.headers["user-agent"].indexOf("Mediapartners") !=-1
                    || req.headers["user-agent"].indexOf("Teoma") !=-1
                    || req.headers["user-agent"].indexOf("Yahoo") !=-1
                    || req.headers["user-agent"].indexOf("yandex") !=-1){ 
                    return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                }else{
                    Origins.findOne({ origin:req.headers["origin"],status:"1" }).exec(function (err, theOrigins) {
                        if (err) return console.log(err);
                        if (!theOrigins) 
                        {
                            return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                        }else{
                            Company.findOne({ apiKey:params.apiKey,status:"1" }).exec(function (err, theCompany) {
                                if (err) return console.log(err);
                                if (!theCompany) 
                                {
                                    return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                                }else{
                                    if (moment(theCompany.apiKeyExpire).isBefore(createdAt))
                                    {
                                        return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                                    }else{
                                        gets(params,theCompany);
                                    }
                                    
                                }
                            });
                        }
                    });
                }
            }else{
                    return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
            }
    },
    setLogout:function(req,res){
        var headerSS = {};
        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();

        var gets = function(reqParam,theCompany){
            ChatRooms.findOne({ cacheKey:reqParam.cacheKey,apiKey:reqParam.apiKey}).exec(function (err, theChatRooms) {
              if (err) console.log(err);
              if (!theChatRooms)
              {
                return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});
              }else{
                  ChatRooms.update({ cacheKey:reqParam.cacheKey,apiKey:reqParam.apiKey },{status:"0",updatedAt:updatedAt}).exec(function afterwards(err, updated){
                        if(err) console.log(err);
                        //console.log(updated);
                        return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});
                  });
              }
            }); 
        };
        

        if(req.isSocket)
        {
                //console.log(req.socket.handshake);
                var paramsFromSocket = params = req.params.all();
                //token = req.socket.handshake.query.param;
                if(req.socket.handshake.headers["user-agent"].indexOf("bot") !=-1 
                    || req.socket.handshake.headers["user-agent"].indexOf("Bot") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("AOLBuild") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("Baidu") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("msnbot") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("bingbot") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("DuckDuckBot") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("Googlebot") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("Mediapartners") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("Teoma") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("Yahoo") !=-1
                    || req.socket.handshake.headers["user-agent"].indexOf("yandex") !=-1){ 
                    return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                }else{
                    Origins.findOne({ origin:req.socket.handshake.headers["origin"],status:"1" }).exec(function (err, theOrigins) {
                        if (err) return console.log(err);
                        if (!theOrigins) 
                        {
                            return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                        }else{
                            Company.findOne({ apiKey:params.apiKey,status:"1" }).exec(function (err, theCompany) {
                                if (err) return console.log(err);
                                if (!theCompany) 
                                {
                                    return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                                }else{
                                    if (moment(theCompany.apiKeyExpire).isBefore(createdAt))
                                    {
                                        return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                                    }else{
                                        gets(paramsFromSocket,theCompany);
                                    }
                                    
                                }
                            });
                        }
                    });
                    
                }
            }else{
                    return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
            }
    },
    loginBackOffice:function(req,res){
        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();

        var gets = function(reqParam){
            Users.findOne({ name:reqParam.username,status:"1",pass:md5(reqParam.pass) }).exec(function (err, theUsers) {
                if (err) return console.log(err);
                if (!theUsers) 
                {
                    return res.send({"errorCode":"04","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                }else{
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),token: jwToken.issue({id:theUsers.id,name:theUsers.name}) });                    
                }
            });
        };


        if(req.method == "POST"){
            gets(params);
        }else{
            return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
        }
    },
    logoutBackOffice:function(req,res){
        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();


        var gets = function(reqParam){
            jwToken.verify(reqParam.token, function (err, token_catch) {
                if (err) 
                {
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});                    
                }else{
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});                    
                }
            });
        };


        if(req.method == "POST"){
            gets(params);
        }else{
                return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
        }
    },
    loginAgentBackOffice:function(req,res){
        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();

        var gets = function(reqParam){
            Agents.findOne({ name:reqParam.username,status:"1",pass:md5(reqParam.pass) }).exec(function (err, theAgents) {
                if (err) return console.log(err);
                if (!theAgents) 
                {
                    return res.send({"errorCode":"04","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                }else{
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"agentsToken": jwToken.issue({id:theAgents.id,name:theAgents.name}) });                    
                }
            });
        };


        if(req.method == "POST"){
            gets(params);
        }else{
            return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
        }
    },
    logoutAgentBackOffice:function(req,res){
        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();


        var gets = function(reqParam){
            jwToken.verify(reqParam.agentsToken, function (err, token_catch) {
                if (err) 
                {
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});                    
                }else{
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});                    
                }
            });
        };


        if(req.method == "POST"){
            gets(params);
        }else{
                return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
        }
    },
    loginAgentBackOffice:function(req,res){
        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();

        var gets = function(reqParam){
            Company.findOne({ name:reqParam.username,status:"1",pass:md5(reqParam.pass) }).exec(function (err, theCompany) {
                if (err) return console.log(err);
                if (!theCompany) 
                {
                    return res.send({"errorCode":"04","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                }else{
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"companyToken": jwToken.issue({id:theCompany.id,name:theCompany.name}) });                    
                }
            });
        };


        if(req.method == "POST"){
            gets(params);
        }else{
            return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
        }
    },
    logoutCompanyBackOffice:function(req,res){
        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();


        var gets = function(reqParam){
            jwToken.verify(reqParam.companyToken, function (err, token_catch) {
                if (err) 
                {
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});                    
                }else{
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});                    
                }
            });
        };


        if(req.method == "POST"){
            gets(params);
        }else{
                return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
        }
    },
    checkIpInfo:function(req,res){
        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();

        ChatRooms.find({ status:"1" }).sort("createdAt DESC").exec(function (err, theChatRooms) {
            if(err) console.log(err);
            //console.log(theChatRooms);
            var arr = [];
            async.forEach(theChatRooms, function (item, callback){
                var ipinfo = new IPinfo(accessToken);
                if(item.headers["cf-connecting-ip"] === null){
                    arr.push(item);
                    callback(null,null);
                }else{
                    if(item.hasOwnProperty("ipInfo")){
                        arr.push(item);
                        callback(null,null);
                    }else{
                        console.log(item.headers["cf-connecting-ip"]);
                        ipinfo.lookupIp(item.headers["cf-connecting-ip"]).then((response) => {
                            ChatRooms.update({ cacheKey:item.cacheKey },{ipInfo:response,updatedAt:updatedAt}).exec(function afterwards(err, updated){
                                item.ipInfo = response;
                                arr.push(item);
                                callback(null,null);
                            });
                        });
                    }
                    
                    
                }
                
            }, function(err) {
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"data":arr});            
            });
            //return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"chatRooms":theChatRooms});
      });
    },
    wiki:function(req,res){

        var gets = function(data){
            console.log(data);
            return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"data":data});            
        };
        
        wiki({ apiUrl: 'https://tr.wikipedia.org/w/api.php' })
        .page('Albert Einstein')
        .then(page => page.summary())
        .then(function(env) {
            gets(env);
        });
    },
    sms:function(req,res){

        var milliseconds = Math.round(+new Date()/1000);

        var postData = {
            "user" : {
                "name": "5053604728",                     // Kullanıcı Adı
                "pass": "Emir386326",                     // Şifre
            },
            "msgBaslik" : "ATBForex",                   // Mesaj Başlığı ( 850 )
            "tr" : true,                            // Türkçe karakter kullanımı
            "start" : milliseconds,                   // GMT değeri https://www.epochconverter.com/
            "msgData" : [
                {
                    "msg" : "Test Mesajı",
                    "tel" : [ "5523302575" ]
                }
            ]
        };

        var jsonData = JSON.stringify(postData);    // Json Encode
        console.log(jsonData);
        var baseData = btoa(jsonData);              // Base64 Encode
        console.log(baseData);

        request.post({url:'http://api.mesajpaneli.com/json_api/', form: {data: baseData}}, function optionalCallback(err, httpResponse, body) {
          if (err) {
            return console.error('upload failed:', err);
          }
            console.log('Upload successful!  Server responded with:', body);
            return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"data":body});            

        });
    },
    weather:function(req,res){

        weather.find({search: 'Izmir, Turkey', degreeType: 'C' , lang:'tr-TR'}, function(err, result) {
            if(err) console.log(err);
            
            console.log(result[0].current);
            console.log(result[0].current.temperature);
            console.log(result[0].current.skytext);
            console.log(result[0].current.day);
            console.log(result[0].current.winddisplay);
            console.log(result[0].current.humidity);

            return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"data":result});            

        });
    },
    socketTest:function(req,res){
        var now = new Date();

        ChatRooms.find({ status:"1" }).sort("createdAt DESC").exec(function (err, theChatRooms) {
            if(err) console.log(err);
            
            var createdAt = moment(now).format('YYYY-MM-DD HH:mm:ss');
            
            var returnedParams = {message:"Bol Cevapp Uygulamasına Hoşgeldiniz!",from:"system",createdAt:createdAt};
            var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":returnedParams};

            async.forEach(theChatRooms, function (item, callback){
                sails.sockets.broadcast(item.cacheKey,'incomingFromAgent',datas,req);
                callback();
            }, function(err) {
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});            
            });

        });
    },
    sendMessageToUser:function(req,res){
        var headerSS = {};

        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();

        var gets = function(reqParam){
            jwToken.verify(reqParam.token, function (err, token_catch) {
                if (err) 
                {
                    return res.send({"errorCode":"01","errorText":res.i18n(texts.authError),"errorUUID":uuid.v4()});                    
                }else{
                    Users.findOne({ name:token_catch.name,status:"1",id:token_catch.id }).exec(function (err, theUsers) {
                        if (err) return console.log(err);
                        if (!theUsers) 
                        {
                            return res.send({"errorCode":"04","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                        }else{

                            //implementation sendMessageToUser
                            //isSocket
                            var cacheKey = reqParam.cacheKey;

                            Chat.create({cacheKey:cacheKey,message:reqParam.message,status:"1",from:"system",createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                if(err) console.log(err);
                                console.log(created);
                                setRedis("botKey"+cacheKey,"",y24);
                                var chatCreated = created;
                                Log.create({name:'CHAT_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'Chat '+created.id+'Created By Agent',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                                    if(err) console.log(err);
                                    console.log(created);
                                    var returnedParams = {message:reqParam.message,from:"system",createdAt:createdAt};
                                    var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":returnedParams};
                                    sails.sockets.broadcast(cacheKey,'incomingFromAgent',datas,req);
                                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam,"returned":returnedParams,"created":chatCreated});
                                });
                            });       
                        }
                    });                 
                }
            });
        };


        if(req.isSocket){
            headerSS = {host:req.socket.handshake.headers["host"],'x-real-ip':req.socket.handshake.headers["x-real-ip"],'x-forwarded-for':req.socket.handshake.headers["x-forwarded-for"],connection:req.socket.handshake.headers["connection"],'content-length':req.socket.handshake.headers["content-length"],'accept-encoding':req.socket.handshake.headers["accept-encoding"],'cf-ipcountry':req.socket.handshake.headers["cf-ipcountry"],accept:req.socket.handshake.headers["accept"],origin:req.socket.handshake.headers["origin"],'user-agent':req.socket.handshake.headers["user-agent"],'content-type':req.socket.handshake.headers["content-type"],'referer':req.socket.handshake.headers["referer"],'accept-language':req.socket.handshake.headers["accept-language"],'cf-connecting-ip':req.socket.handshake.headers["cf-connecting-ip"]};
            gets(params);
        }else{
            return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
        }
    },
    welcomeMessageToUserFromBackend:function(req,res){
        var headerSS = {};

        var reqParam = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();
        var message = "Hoşgeldiniz,\\n Sistem ile konuşmalarınız kayıt altına alınmaktadır.\\nNasıl yardımcı olabiliriz ? ";

        if(req.method == "POST"){
            headerSS = {host:req.headers["host"],'x-real-ip':req.headers["x-real-ip"],'x-forwarded-for':req.headers["x-forwarded-for"],connection:req.headers["connection"],'content-length':req.headers["content-length"],'accept-encoding':req.headers["accept-encoding"],'cf-ipcountry':req.headers["cf-ipcountry"],accept:req.headers["accept"],origin:req.headers["origin"],'user-agent':req.headers["user-agent"],'content-type':req.headers["content-type"],'referer':req.headers["referer"],'accept-language':req.headers["accept-language"],'cf-connecting-ip':req.headers["cf-connecting-ip"]};

            var cacheKey = reqParam.cacheKey;
            Chat.create({cacheKey:cacheKey,message:message,status:"1",from:"system",createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                if(err) console.log(err);
                console.log(created);
                setRedis("botKey"+cacheKey,"",y24);
                var chatCreated = created;
                Log.create({name:'CHAT_CREATE',ip:headerSS["cf-connecting-ip"],headers:headerSS,data:'Chat '+created.id+'Created By Agent',cacheKey:cacheKey,apiKey:reqParam.apiKey,createdAt:createdAt,updatedAt:updatedAt}).exec(function createCB(err, created){
                    if(err) console.log(err);
                    console.log(created);
                    var returnedParams = {message:message,from:"system",createdAt:createdAt};
                    var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":returnedParams};
                    sails.sockets.broadcast(cacheKey,'incomingFromAgent',datas,req);
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam,"returned":returnedParams,"created":chatCreated});
                });
            });
        }else{
            return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
        }
       
    },
    setBotActive:function(req,res){
        var headerSS = {};

        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();

        var gets = function(reqParam){
            jwToken.verify(reqParam.token, function (err, token_catch) {
                if (err) 
                {
                    return res.send({"errorCode":"01","errorText":res.i18n(texts.authError),"errorUUID":uuid.v4()});                    
                }else{
                    Users.findOne({ name:token_catch.name,status:"1",id:token_catch.id }).exec(function (err, theUsers) {
                        if (err) return console.log(err);
                        if (!theUsers) 
                        {
                            return res.send({"errorCode":"04","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                        }else{
                            var cacheKey = reqParam.cacheKey;
                            ChatRooms.update({ cacheKey:cacheKey },{isBotActive:reqParam.botActive,updatedAt:updatedAt}).exec(function afterwards(err, updated){
                                return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});            
                            });
                                 
                        }
                    });                 
                }
            });
        };


        if(req.isSocket){
            gets(params);
        }else{
            return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
        }
    },
    getPanelDataInformation:function(req,res){
        var headerSS = {};

        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();
        var arr = [];
        var browser = [];
        var device = [];
        var os = [];

        var gets = function(reqParam){
            jwToken.verify(reqParam.token, function (err, token_catch) {
                if (err) 
                {
                    return res.send({"errorCode":"01","errorText":res.i18n(texts.authError),"errorUUID":uuid.v4()});                    
                }else{
                    Users.findOne({ name:token_catch.name,status:"1",id:token_catch.id }).exec(function (err, theUsers) {
                        if (err) return console.log(err);
                        if (!theUsers) 
                        {
                            return res.send({"errorCode":"04","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                        }else{

                            ChatRooms.native(function(err, collection) {
                                if(err) console.log(err);
                              
                                collection.aggregate([{ $sortByCount: "$headers.user-agent" }], function (err, result) {
                                    if (err) return reject(err);                
                                    console.log(result);
                                    async.forEach(result, function (item, callback){
                                        console.log(item);
                                        var ua = parser(item._id);
                                        console.log(ua);
                                        browser.push({name:ua.browser.name});
                                        if(ua.device.model=="" || ua.device.model === undefined){
                                                device.push({name:"pc"});
                                        }else{
                                                device.push({name:ua.device.model.toLowerCase().replace(" ","")});
                                        }

                                        var osname = ""+ua.os.name+"";
                                        os.push({name:osname.toLowerCase().replace(" ","")});
                                        //arr.push(item);

                                        callback(null,null);
                                    }, function(err) {
                                        var browserCounts = browser.reduce((p, c) => {
                                            var name = c.name;
                                            if (!p.hasOwnProperty(name)) {
                                                p[name] = 0;
                                            }
                                            p[name]++;
                                            return p;
                                        }, {});

                                        var browserCountsE = Object.keys(browserCounts).map(k => {
                                            return {name: k, count: browserCounts[k]}; });
                                        console.log(browserCountsE);

                                        var osCounts = os.reduce((p, c) => {
                                            var name = c.name;
                                            if (!p.hasOwnProperty(name)) {
                                                p[name] = 0;
                                            }
                                            p[name]++;
                                            return p;
                                        }, {});

                                        var osCountsE = Object.keys(osCounts).map(k => {
                                            return {name: k, count: osCounts[k]}; });
                                        console.log(osCountsE);


                                        var deviceCounts = device.reduce((p, c) => {
                                            var name = c.name;
                                            if (!p.hasOwnProperty(name)) {
                                                p[name] = 0;
                                            }
                                            p[name]++;
                                            return p;
                                        }, {});

                                        var deviceCountsE = Object.keys(deviceCounts).map(k => {
                                            return {name: k, count: deviceCounts[k]}; });
                                        console.log(deviceCountsE);
                                        var datas = {browser:browserCountsE,os:osCountsE,device:deviceCountsE}
                                        arr.push(datas);
                                        return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"data":arr});            
                                    });
                                });

                            });
                                 
                        }
                    });                 
                }
            });
        };


        if(req.isSocket){
            gets(params);
        }else{
            return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
        }
    },
    updateIsBotActive:function(req,res){
        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();

        ChatRooms.find({ status:"1" }).sort("createdAt DESC").exec(function (err, theChatRooms) {
            if(err) console.log(err);
            //console.log(theChatRooms);
            var arr = [];
            async.forEach(theChatRooms, function (item, callback){
                ChatRooms.update({ cacheKey:item.cacheKey },{isBotActive:"1",updatedAt:updatedAt}).exec(function afterwards(err, updated){
                    arr.push(item);
                    callback(null,null);
                });
                
            }, function(err) {
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"data":arr});            
            });
            //return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"chatRooms":theChatRooms});
      });
    },
    joinChatBackOffice:function(req,res){
        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();

        var gets = function(reqParam){
            jwToken.verify(reqParam.token, function (err, token_catch) {
                if (err) 
                {
                    return res.send({"errorCode":"01","errorText":res.i18n(texts.authError),"errorUUID":uuid.v4()});                    
                }else{
                    Users.findOne({ name:token_catch.name,status:"1",id:token_catch.id }).exec(function (err, theUsers) {
                        if (err) return console.log(err);
                        if (!theUsers) 
                        {
                            return res.send({"errorCode":"04","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                        }else{

                            sails.sockets.join(req, reqParam.cacheKey ,function(err) {
                                  if (err) {
                                    console.log(err);
                                  }else{
                                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam});
                                  }
                            });    
                        }
                    });                 
                }
            });
        };


        if(req.isSocket){
            gets(params);
        }else{
            return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
        }   
    },
    getChatBackOffice:function(req,res){
        var params = req.params.all();
        var createdAt = new Date();
        var updatedAt = new Date();

        var gets = function(reqParam){
            jwToken.verify(reqParam.token, function (err, token_catch) {
                if (err) 
                {
                    return res.send({"errorCode":"01","errorText":res.i18n(texts.authError),"errorUUID":uuid.v4()});                    
                }else{
                    Users.findOne({ name:token_catch.name,status:"1",id:token_catch.id }).exec(function (err, theUsers) {
                        if (err) return console.log(err);
                        if (!theUsers) 
                        {
                            return res.send({"errorCode":"04","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                        }else{

                            ChatRooms.findOne({ cacheKey:reqParam.cacheKey }).exec(function (err, theChatRooms) {
                                if (err) return console.log(err);
                                if (!theChatRooms) 
                                {
                                    return res.send({"errorCode":"02","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                                }else{
                                    Chat.find({ cacheKey:reqParam.cacheKey , status:"1" }).exec(function (err, theChats) {
                                        if(err) console.log(err);
                                        console.log(theChats);
                                        return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":reqParam,"returned":theChats});
                                    });
                                }
                            });
                               
                        }
                    });                 
                }
            });
        };


        if(req.isSocket){
            gets(params);
        }else{
            return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
        }   
    },
    getExchanges:function(req,res){
        (async () => {
            const TCMB_Doviz = require('tcmb-doviz');
            const Doviz = new TCMB_Doviz();
            const usd = await Doviz.getKur("USD"); 
            const euro = await Doviz.getKur("EUR");
            var arrDov = {usd:usd,euro:euro};
            return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"params":arrDov});
        })();
    },
    pingAsAService:function(req,res){

        //kullanıcılara ping gönderildi.
        //pinge cevap dönenler chatroomsactive'e eklendi.
        //
        ChatRooms.find({ status:"1" }).sort("createdAt DESC").exec(function (err, theChatRooms) {
            if(err) console.log(err);
            
            var createdAt = moment(now).format('YYYY-MM-DD HH:mm:ss');
            
            var returnedParams = {message:"Ping Service Actived",from:"system",createdAt:createdAt};
            var datas = {"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4(),"returned":returnedParams};

            async.forEach(theChatRooms, function (item, callback){
                sails.sockets.broadcast(cacheKey,'ping',datas,req);
                ChatRoomsActive.findOne({ cacheKey:cacheKey,status:"1" }).exec(function (err, theChatRoomsActive) {
                    if (err) return console.log(err);
                    if (!theChatRoomsActive) 
                    {
                        callback();
                    }else{
                        callback();
                    }
                });

            }, function(err) {
                    return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});            
            });

        });
    },
    pongfromclient:function(req,res){
        var headerSS = {};
        var params = req.params.all();
        var cacheKey = "";
        var createdAt = new Date();
        var updatedAt = new Date();

        var gets = function(reqParam,theCompany){
            if(reqParam.hasOwnProperty('cacheKey') && reqParam.hasOwnProperty("apiKey")){
                cacheKey = reqParam.cacheKey;
                redisclient.exists("botKey"+cacheKey, function(err, reply) {
                    if (reply === 1) {
                        console.log("reply 1");
                        ChatRoomsActive.findOne({ cacheKey:cacheKey}).exec(function (err, theChatRoomsActive) {
                            if (err) return console.log(err);
                            if (!theChatRoomsActive) 
                            {
                                console.log("yok");
                                return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});            
                            }else{
                                setRedis("botKey"+cacheKey,"",y24);
                                if(theChatRoomsActive.status == "1"){
                                    ChatRoomsActive.update({ cacheKey:cacheKey,status:"1" },{status:"1",updatedAt:updatedAt}).exec(function afterwards(err, updated){
                                        if(err) console.log(err);
                                    });
                                }
                                return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});            
                            }
                        });
                    }else{
                        console.log("reply 2");
                        return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});            
                    }
                });
            }else{
                return res.send({"errorCode":"00","errorText":res.i18n(texts.authSuccess),"errorUUID":uuid.v4()});            
            }
        };

        if(req.isSocket)
        {
            //console.log(req.socket.handshake);
            var paramsFromSocket = params = req.params.all();
            headerSS = {host:req.socket.handshake.headers["host"],'x-real-ip':req.socket.handshake.headers["x-real-ip"],'x-forwarded-for':req.socket.handshake.headers["x-forwarded-for"],connection:req.socket.handshake.headers["connection"],'content-length':req.socket.handshake.headers["content-length"],'accept-encoding':req.socket.handshake.headers["accept-encoding"],'cf-ipcountry':req.socket.handshake.headers["cf-ipcountry"],accept:req.socket.handshake.headers["accept"],origin:req.socket.handshake.headers["origin"],'user-agent':req.socket.handshake.headers["user-agent"],'content-type':req.socket.handshake.headers["content-type"],'referer':req.socket.handshake.headers["referer"],'accept-language':req.socket.handshake.headers["accept-language"],'cf-connecting-ip':req.socket.handshake.headers["cf-connecting-ip"]};                  
            //token = req.socket.handshake.query.param;
            if(req.socket.handshake.headers["user-agent"].indexOf("bot") !=-1 
                || req.socket.handshake.headers["user-agent"].indexOf("Bot") !=-1
                || req.socket.handshake.headers["user-agent"].indexOf("AOLBuild") !=-1
                || req.socket.handshake.headers["user-agent"].indexOf("Baidu") !=-1
                || req.socket.handshake.headers["user-agent"].indexOf("msnbot") !=-1
                || req.socket.handshake.headers["user-agent"].indexOf("bingbot") !=-1
                || req.socket.handshake.headers["user-agent"].indexOf("DuckDuckBot") !=-1
                || req.socket.handshake.headers["user-agent"].indexOf("Googlebot") !=-1
                || req.socket.handshake.headers["user-agent"].indexOf("Mediapartners") !=-1
                || req.socket.handshake.headers["user-agent"].indexOf("Teoma") !=-1
                || req.socket.handshake.headers["user-agent"].indexOf("Yahoo") !=-1
                || req.socket.handshake.headers["user-agent"].indexOf("yandex") !=-1){ 
                console.log("bot");
                return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
            }else{
                console.log("Origins");
                Origins.findOne({ origin:req.socket.handshake.headers["origin"],status:"1" }).exec(function (err, theOrigins) {
                    if (err) return console.log(err);
                    if (!theOrigins) 
                    {
                        console.log("Origins error");
                        return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                    }else{
                        Company.findOne({ apiKey:params.apiKey,status:"1" }).exec(function (err, theCompany) {
                            if (err) return console.log(err);
                            if (!theCompany) 
                            {
                                return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                            }else{
                                if (moment(theCompany.apiKeyExpire).isBefore(createdAt))
                                {
                                    return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                                }else{
                                    gets(paramsFromSocket,theCompany);
                                }
                                
                            }
                        });
                    }
                });
                
            }
        }else if(req.method == "POST"){
            headerSS = {host:req.headers["host"],'x-real-ip':req.headers["x-real-ip"],'x-forwarded-for':req.headers["x-forwarded-for"],connection:req.headers["connection"],'content-length':req.headers["content-length"],'accept-encoding':req.headers["accept-encoding"],'cf-ipcountry':req.headers["cf-ipcountry"],accept:req.headers["accept"],origin:req.headers["origin"],'user-agent':req.headers["user-agent"],'content-type':req.headers["content-type"],'referer':req.headers["referer"],'accept-language':req.headers["accept-language"],'cf-connecting-ip':req.headers["cf-connecting-ip"]};

            if(req.headers["user-agent"].indexOf("bot") !=-1 
                || req.headers["user-agent"].indexOf("Bot") !=-1
                || req.headers["user-agent"].indexOf("AOLBuild") !=-1
                || req.headers["user-agent"].indexOf("Baidu") !=-1
                || req.headers["user-agent"].indexOf("msnbot") !=-1
                || req.headers["user-agent"].indexOf("bingbot") !=-1
                || req.headers["user-agent"].indexOf("DuckDuckBot") !=-1
                || req.headers["user-agent"].indexOf("Googlebot") !=-1
                || req.headers["user-agent"].indexOf("Mediapartners") !=-1
                || req.headers["user-agent"].indexOf("Teoma") !=-1
                || req.headers["user-agent"].indexOf("Yahoo") !=-1
                || req.headers["user-agent"].indexOf("yandex") !=-1){ 
                return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
            }else{
                Origins.findOne({ origin:req.headers["origin"],status:"1" }).exec(function (err, theOrigins) {
                    if (err) return console.log(err);
                    if (!theOrigins) 
                    {
                        return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                    }else{
                        Company.findOne({ apiKey:params.apiKey,status:"1" }).exec(function (err, theCompany) {
                            if (err) return console.log(err);
                            if (!theCompany) 
                            {
                                return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                            }else{
                                if (moment(theCompany.apiKeyExpire).isBefore(createdAt))
                                {
                                    return res.send({"errorCode":"03","errorText":res.i18n(texts.error),"errorUUID":uuid.v4()});
                                }else{
                                    gets(params,theCompany);
                                }
                                
                            }
                        });
                    }
                });
            }
        }else{
                return res.send({"errorCode":"01","errorText":res.i18n(texts.onlyPostAction),"errorUUID":uuid.v4()});
        }
    }
   
};

function setRedis(key,data,time){
    redisclient.set(key, data, redis.print);
    redisclient.expire(key, time);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}