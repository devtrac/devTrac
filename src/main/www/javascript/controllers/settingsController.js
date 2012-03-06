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
    } else {
        $("#update_question_places").show();
        $("#wipe_out_data").show();
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
        alert(msg);
        $('.upload_progress_log').html("");
        fieldTripController.showTripReports();
    }, function(msg){
        alert(msg);
        $('.upload_progress_log').html("");
        fieldTripController.showTripReports();
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
