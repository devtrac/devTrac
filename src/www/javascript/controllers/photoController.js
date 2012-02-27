function PhotoController(){

}

PhotoController.prototype.show = function(){
	navigator.log.debug("Showing photo list.");
    var container = $("#photo_list");
    container.html("");
    for (var path in devtrac.currentSite.photos) {
        container.append("<li><img class='thumbnail' src='" + path + "'/></li>");
    }
	navigator.log.debug("Displayed photo screen.");
    screens.show("photo");
}

PhotoController.prototype.attach = function(){
    navigator.log.debug("Attaching photo.");
	var photo = $("#photo_path");
    if (photo.val()) {
        navigator.image.resize(photo.val(), 640, 480, function(path){
            devtrac.currentSite.photos[path] = "";

            devtrac.currentSite.uploaded = false;
            devtrac.dataStore.saveCurrentSite(function(){
                alert("Image attached successfully.")
                devtrac.photoController.show();
            });
        }, function(err){
            devtrac.common.logAndShowGenericError('Failed to attach image.');
        })
		navigator.log.debug("Attached photo: " + photo.val());
        photo.val("");
    }
}
