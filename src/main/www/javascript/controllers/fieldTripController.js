var fieldTripController = new Object();

fieldTripController.showTripReports = function(){
	navigator.log.debug("Showing trip reports.");
    screens.show("loading");
    if (devtrac.user.loggedIn) {
        navigator.store.get(fieldTripController.display, function(error){
			navigator.log.debug("Used logged in but can't retrieve trip reports. Will display login screen.");
            devtrac.loginController.show();
        }, devtrac.user.name);
    }
    else {
		navigator.log.debug("User not logged in. Will display login screen.");
        devtrac.loginController.show();
    }
};

fieldTripController.display = function(response){
	navigator.log.debug("Displaying trip reports");
    if (response) {
        devtrac.fieldTrip = JSON.parse(response);
        $("#trip_title").html(fieldTripController.siteTitle(devtrac.fieldTrip.title));
        var sitesContainer = $("#site_list");
        var noSitesTip = $("#no_sites_in_trip");
        sitesContainer.html("");
        if (devtrac.fieldTrip.sites.length == 0) {
            noSitesTip.show();
            $(".sites_list").hide();
            screens.show("sites_to_visit");
            return;
        }
        fieldTripController.paintSites();
		navigator.log.debug("Displayed field trips.");
    }
    else {
        alert("You don't have active field trips.");
		navigator.log.debug("No field trips for user. Logging out.");
        devtrac.loginController.logout();
    }
}

fieldTripController.siteTitle = function(actualTitle){
    return actualTitle.length > 22 ? actualTitle.substring(0, 22) + "..." : actualTitle;
}

fieldTripController.paintSites = function(){
    var sitesContainer = $("#site_list");
    var noSitesTip = $("#no_sites_in_trip");
    for (var id in devtrac.fieldTrip.sites) {
        var site = devtrac.fieldTrip.sites[id];
        var siteId = site.id ? site.id : site.name;
		var siteType = site.type ? site.type : "";
		var html = "<div class='grid_row'><div id='" + siteId + "' class='link site_item col1'>" + site.name + "</div>";
		html += "<div class='col2'>" + siteType + "</div><div class='col3'>";
		if (site.complete) {
            html += "<span class='done'><img src='css/images/icon_tick.gif'/></span>";
        }
		html += "</div></div>";

        sitesContainer.append(html);
    }
    noSitesTip.hide();
    $(".sites_list").show();
    screens.show("sites_to_visit");
    attachClickEvents(".site_item", showSiteDetailScreen);
}
