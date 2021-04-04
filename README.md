# live-support

Sails.js based live-support system. 

Get repo first. 
Install all dependencies. 
And add your code snip into your website live down below : 

 <!--Start of Live-Support Script-->
    <script type="text/javascript">
      (function(){
      var apiKey = "api key insert here";
      var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
      s1.async=true;
      s1.src='https://domain.com/embed/'+apiKey;
      s1.charset='UTF-8';
      s1.setAttribute('crossorigin','*');
      s1.setAttribute('bot',true);
      s1.setAttribute('apiKey',apiKey);
      s1.setAttribute('autoconnect',false);
      s1.setAttribute('useCORSRouteToGetCookie',false);
      /*s0.parentNode.insertBefore(s1,s0);*/
      document.body.appendChild(s1);
      })();
    </script>
    <!--End of Live-Support Script-->

a [Sails](http://sailsjs.org) application
