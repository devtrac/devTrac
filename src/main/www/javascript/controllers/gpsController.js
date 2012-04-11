function GPSController(){

}

GPSController.prototype.show = function(){
    var gpsInfo = devtrac.currentSite.placeGeo.substring(devtrac.currentSite.placeGeo.lastIndexOf("(")+1, devtrac.currentSite.placeGeo.lastIndexOf(")"));
    var latitude;
    var longitude;
    if (gpsInfo == ""){
        latitude = "";
        longitude = "";
    }
    else{
        latitude = gpsInfo.split(" ")[0];
        longitude = gpsInfo.split(" ")[1];
    }

    $("#latitude_edit_value").text(latitude);
    $("#longitude_edit_value").text(longitude);
    screens.show("gps_edit");
}
