jQuery("#div-setting").hide();
jQuery("#div-login").hide();
jQuery.ajax({
	type: 'GET',
	url: "https://activflash.com/admin-amelia/check-session-login",
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
    url: "https://activflash.com/admin-amelia/post-session-login",
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
    url: "https://activflash.com/admin-amelia/post-forgot-password",
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
    url: "https://activflash.com/admin-amelia/post-session-logout",
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




jQuery('#btn-import-excel-non-aktif-like').click(function(e){
    var uf = jQuery('#form-import-excel-non-aktif-like');
    var fd = new FormData(uf[0]);
    jQuery.ajax({
      url: "https://activflash.com/admin-amelia/import-excel-non-aktif",
      type: 'post',
      data : fd,
      processData:false,
      contentType: false,
      beforeSend: function(result) {
        jQuery("#div-loading").show();
      },
      dataType: 'text',
      success: function(result)
      {
        // console.log(result);
        var data = jQuery.parseJSON(result);
        // console.log(data);
        jQuery("#div-loading").hide();
        $.each( data, function( key, value ) {
          // alert( key + ": " + value.nonAktifStart + " " + value.nonAktifEnd);
          // tulis di 
          var $this = this;
          setTimeout(function(){
            $("#start_time_like").val(value.nonAktifStart);
            $("#end_time_like").val(value.nonAktifEnd);
            $("#insert_time_like").trigger("click");
          }, (key + 1) * 200);          
        });
      }        
    });
});

jQuery('#btn-import-excel-non-aktif-unfollow').click(function(e){
    var uf = jQuery('#form-import-excel-non-aktif-unfollow');
    var fd = new FormData(uf[0]);
    jQuery.ajax({
      url: "https://activflash.com/admin-amelia/import-excel-non-aktif",
      type: 'post',
      data : fd,
      processData:false,
      contentType: false,
      beforeSend: function(result) {
        jQuery("#div-loading").show();
      },
      dataType: 'text',
      success: function(result)
      {
        // console.log(result);
        var data = jQuery.parseJSON(result);
        // console.log(data);
        jQuery("#div-loading").hide();
        $.each( data, function( key, value ) {
          // alert( key + ": " + value.nonAktifStart + " " + value.nonAktifEnd);
          // tulis di 
          var $this = this;
          setTimeout(function(){
            $("#start_time_unfollow").val(value.nonAktifStart);
            $("#end_time_unfollow").val(value.nonAktifEnd);
            $("#insert_time_unfollow").trigger("click");
          }, (key + 1) * 200);          
        });
      }        
    });
});

jQuery('#btn-import-excel-non-aktif-follow').click(function(e){
    var uf = jQuery('#form-import-excel-non-aktif-follow');
    var fd = new FormData(uf[0]);
    jQuery.ajax({
      url: "https://activflash.com/admin-amelia/import-excel-non-aktif",
      type: 'post',
      data : fd,
      processData:false,
      contentType: false,
      beforeSend: function(result) {
        jQuery("#div-loading").show();
      },
      dataType: 'text',
      success: function(result)
      {
        // console.log(result);
        var data = jQuery.parseJSON(result);
        // console.log(data);
        jQuery("#div-loading").hide();
        $.each( data, function( key, value ) {
          // alert( key + ": " + value.nonAktifStart + " " + value.nonAktifEnd);
          // tulis di 
          var $this = this;
          setTimeout(function(){
            $("#start_time_follow").val(value.nonAktifStart);
            $("#end_time_follow").val(value.nonAktifEnd);
            $("#insert_time_follow").trigger("click");
          }, (key + 1) * 200);          
        });
      }        
    });
});