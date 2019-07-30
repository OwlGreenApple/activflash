jQuery("#div-setting").hide();
jQuery("#div-login").hide();
jQuery.ajax({
	type: 'GET',
	url: "https://activflash.com/admin-dashboard/check-session-login",
	data: {
		setting_id : 0,
	},
	dataType: 'text',
	success: function(result) {
		var data = jQuery.parseJSON(result);
		if (data.type=="success") {
			chrome.browserAction.setIcon({
				path : {
					"16": "img/16.png",
					"32": "img/32.png",
				}
			});
			
			jQuery("#span-until").html(data.validUntil);
			jQuery("#div-setting").show();
			jQuery("#div-login").hide();
		}
		else if (data.type=="error") {
			chrome.browserAction.setIcon({
				path : {
					"16": "img/16-gray.png",
					"32": "img/32-gray.png",
				}
			});
			// alert(data.message);
			jQuery("#div-setting").hide();
			jQuery("#div-login").show();
		}
	}
});

jQuery('#button-login').click(function(e){
  jQuery.ajax({
    type: 'GET',
    url: "https://activflash.com/admin-dashboard/post-session-login",
    data: {
      username : jQuery('#username').val(),
      password : jQuery('#password').val(),
    },
    dataType: 'text',
    success: function(result) {
      var data = jQuery.parseJSON(result);
      if (data.type=="success") {
      // if (result=="success") {
        chrome.browserAction.setIcon({
          path : {
            "16": "img/16.png",
            "32": "img/32.png",
          }
        });
        $("#account-username").html(data.username);
        $("#time-left").html(data.dayLeft);
        jQuery("#div-setting").show();
        jQuery("#div-login").hide();
      }
      // else if (result=="fail") {
      else if (data.type=="error") {
        chrome.browserAction.setIcon({
          path : {
            "16": "img/16-gray.png",
            "32": "img/32-gray.png",
          }
        });
        alert(data.message);
        jQuery("#div-setting").hide();
        jQuery("#div-login").show();
      }
    }
  });
});

jQuery('#button-forgot-password').click(function(e){
  jQuery.ajax({
    type: 'GET',
    url: "https://activflash.com/admin-dashboard/post-forgot-password",
    data: {
      username : jQuery('#username-forgot-password').val(),
    },
    dataType: 'text',
    success: function(result) {
      var data = jQuery.parseJSON(result);
      alert(data.message);
      if (data.type=="success") {
/*        jQuery("#div-setting").show();
        jQuery("#div-login").hide();
  */    }
      // else if (result=="fail") {
      else if (data.type=="error") {
    /*    alert(data.message);
        jQuery("#div-setting").hide();
        jQuery("#div-login").show();
      */}
    }
  });
});
jQuery('#button-to-forgotpassword').click(function(e){
  e.preventDefault();
  jQuery("#div-login").hide();
  jQuery("#div-forgot-password").show();
});
jQuery('#button-backto-login').click(function(e){
  e.preventDefault();
  jQuery("#div-forgot-password").hide();
  jQuery("#div-login").show();
});

jQuery('.button-logout').click(function(e){
  e.preventDefault();
  jQuery.ajax({
    type: 'GET',
    url: "https://activflash.com/admin-dashboard/post-session-logout",
    dataType: 'text',
    success: function(result) {
      // if (data.type=="success") {
        jQuery("#div-setting").hide();
        jQuery("#div-login").show();
        
      // }
      // else if (data.type=="error") {
        // jQuery("#div-setting").show();
        // jQuery("#div-login").hide();
      // }
    }
  });
});

jQuery('#dashboard_btn').click(function(e){
  jQuery("#div-dashboard").show();
  jQuery("#div-setting-view").hide();
});
jQuery('#settings_btn').click(function(e){
  jQuery("#div-dashboard").hide();
  jQuery("#div-setting-view").show();
});