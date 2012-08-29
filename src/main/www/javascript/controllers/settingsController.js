function SettingsController(){

}

SettingsController.prototype.show = function(){
    screens.show("settings");
    navigator.log.getDebug(function(isDebugOn){
        $("#log_debug_mode").attr('checked', isDebugOn);
    });
    if (!devtrac.user.loggedIn) {
        $("#update_question_places").hide();
        $("#wipe_out_data").hide();
		$("#config_endpoint").show();
    } else {
        $("#update_question_places").show();
        $("#wipe_out_data").show();
		$("#config_endpoint").hide();
    }
}

SettingsController.prototype.updateQuestionsPlaces = function(){
    devtrac.dataPull.questions(function(){
        alert("Questions, profiles and places updated successfully.");
        devtrac.settingsController.show();
    });
}

SettingsController.prototype.wipeout = function(){
    screens.show("delete_confirm");
}

SettingsController.prototype.performWipeout = function(){
    navigator.store.nuke(function(){
        alert("All application data deleted. Application will exit.");
        navigator.utility.exit();
    }, function(){
        devtrac.common.logAndShowGenericError("Error occured while deleting application data.")
        devtrac.settingsController.show();
    });
}

SettingsController.prototype.uploadData = function(){
	if (devtrac.dataPush.isAllSitesUploaded()){
		alert('No site has been changed since last synchronization.');
		return;
	}

    screens.show("upload_progress");
    $('.upload_progress_log').html("");
    devtrac.dataPush.uploadData(function(msg){
        $('.upload_progress_log').append("<br/>" + msg);
    }, function(msg){
        setTimeout(function(){
            alert(msg);
            $('.upload_progress_log').html("");
            devtrac.dataPush.clearAndResync();
        }, 1000);
    }, function(msg){
        setTimeout(function(){
            alert(msg);
            $('.upload_progress_log').html("");
            fieldTripController.showTripReports();
        }, 1000);
    });
}

SettingsController.prototype.showLog = function(){
    navigator.log.show(function(success){
        if (!success) {
            alert("Can't open log viewer");
        }
    });
}
SettingsController.prototype.setDebugMode = function(){
    navigator.log.getDebug(function(isDebugOn){
        var debugMode = !isDebugOn;
	    navigator.log.setDebug(debugMode, function(success){
	        var hint = "Debug mode is " + (debugMode ? "ON" : "OFF") + ".";
	        navigator.log.log(hint);
        });
    });
}

SettingsController.prototype.setEndPoint = function(){
     DT_SERVER_ENDPOINT.HOST = $("#end_point").val();
     devtrac.settingsController.refreshURL();
	 alert("End point is:" + DT_SERVER_ENDPOINT.HOST + " now.");
}

SettingsController.prototype.refreshURL = function(){
        DT_D7.SYSTEM_CONNECT=DT_SERVER_ENDPOINT.HOST + '/api/system/connect.json';
	    DT_D7.USER_LOGIN=DT_SERVER_ENDPOINT.HOST +'/api/user/login.json';
		DT_D7.SERVICE_ENDPOINT=DT_SERVER_ENDPOINT.HOST+ '/api/';
        DT_D7.SYSTEM_CONNECT=DT_SERVER_ENDPOINT.HOST + '/api/system/connect.json';
        DT_D7.USER_LOGIN=DT_SERVER_ENDPOINT.HOST +'/api/user/login.json';
        DT_D7.USER_LOGOUT=DT_SERVER_ENDPOINT.HOST +'/api/user/logout.json';
        DT_D7.CURRENT_TRIP=DT_SERVER_ENDPOINT.HOST +'/api/views/api_fieldtrips.json?display_id=current_trip';
        DT_D7.PLACE_TYPES=DT_SERVER_ENDPOINT.HOST  +'/api/views/api_vocabularies.json?display_id=placetypes';
        DT_D7.USER_PROFILES=DT_SERVER_ENDPOINT.HOST +'/api/views/api_user.json?display_id=users';
        DT_D7.ACTION_ITEMS=DT_SERVER_ENDPOINT.HOST +'/api/views/api_fieldtrips.json?display_id=actionitems&args[nid]=<FIELD_TRIP_NID>&filters[field_actionitem_status_value]=1&filters[field_actionitem_status_value]=3&args[field_actionitem_ftreportitem_target_id]=<SITE_NID>';
        DT_D7.SITE_PLACES=DT_SERVER_ENDPOINT.HOST +'/api/views/api_fieldtrips.json?display_id=place&filters[nid]=<SITE_NID>';
        DT_D7.SITE_DETAILS=DT_SERVER_ENDPOINT.HOST +'/api/views/api_fieldtrips.json?display_id=sitevisits&filters[field_ftritem_field_trip_target_id]=<FIELD_TRIP_NID>&offset=0&limit=20';
        DT_D7.NODE_SAVE=DT_SERVER_ENDPOINT.HOST +'/api/node/<NODE_ID>.json';
        DT_D7.NODE_CREATE=DT_SERVER_ENDPOINT.HOST +'/api/node.json';
        DT_D7.QUESTIONS= DT_SERVER_ENDPOINT.HOST +'/api/views/api_questions.json?filters[active]=1';
        DT_D7.QUESTIONS_FILTER=DT_SERVER_ENDPOINT.HOST +'/api/views/api_questions.json?offset=0&limit=0&filters[changed]=<SYNC_TIME>';
        DT_D7.SUBMISSION=DT_SERVER_ENDPOINT.HOST +'/api/questionnaire/submit';
        DT_D7.COMMENT=DT_SERVER_ENDPOINT.HOST +'/api/comment.json';
        DT_D7.FILE_SAVE=DT_SERVER_ENDPOINT.HOST +'/api/file';
}

