function SettingsController(){

}

SettingsController.prototype.show = function(){
    screens.show("settings");
    navigator.log.getDebug(function(isDebugOn){
        $("#log_debug_mode").attr('checked', isDebugOn);
    });
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
    var debugToggle = !$("#log_debug_mode").is(':checked');
    navigator.log.setDebug(debugToggle, function(success){
        var debugMode = "Debug mode is " + (debugToggle ? "ON" : "OFF") + ".";
        navigator.log.log(debugMode);
        navigator.log.debug(debugMode);
        alert(debugMode);
    });
}
