// var _gaq = _gaq || [];
// _gaq.push(['_setAccount', 'UA-102514745-1']);
// _gaq.push(['_trackPageview']);

// (function() {
//   var ga = document.createElement('script'); 
//   ga.type = 'text/javascript'; 
//   ga.async = true;
//   ga.src = 'https://ssl.google-analytics.com/ga.js';
//   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
// })();

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  
ga('create', 'UA-102514745-1', 'auto');
ga('set', 'checkProtocolTask', function(){});   
ga('require', 'displayfeatures');
ga('send', 'pageview','/index.html');
  


var user_id = my_cookie2("genel", "user_id");
ga('set', 'userId', user_id); 

/**
 * Track a click on a button using the asynchronous tracking API.
 *
 * See http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html
 * for information on how to use the asynchronous tracking API.
 */
function trackButtonClick(e) {
  // _gaq.push(['_trackEvent', e.target.id, 'clicked']);
  ga('send', 'event', 'Switches', 'Click', e.target.id);
}
/**
 * Now set up your event handlers for the popup's `button` elements once the
 * popup's DOM has loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
  var a = document.getElementById('unfollowing_status_btn');
  var b = document.getElementById('following_status');
  var c = document.getElementById('like_status');
  var d = document.getElementById('rateUSButton');
  var e = document.getElementById('importSettingsBtn');
  var f = document.getElementById('export_data_btn');
  var g = document.getElementById('import_data_file');
  var h = document.getElementById('share_btn');
  var j = document.getElementById('paypal-button-container');
  var buttons = [a,b,c,d,e,f,g,h,j];
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', trackButtonClick);
  }
});