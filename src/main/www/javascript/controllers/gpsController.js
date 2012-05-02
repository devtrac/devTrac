function GPSController(){
}

GPSController.prototype.show = function(){
    var extractGpsInfo = function(placeGeo){
        if(placeGeo){
          return placeGeo.substring(placeGeo.lastIndexOf("(")+1, placeGeo.lastIndexOf(")"))
        }
        return "";
    }

    var gpsInfo = extractGpsInfo(devtrac.currentSite.placeGeo);
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
