var siteController = new Object();

siteController.add = function(){
    navigator.log.debug("Adding site.");
	var questions = new QuestionTypes(devtrac.questions);
	var list = $('#sitetypes');
	list.html("");
    $(questions.locationTypes()).each(function(i, option){
        list.append("<option>" + option + "</option>");
    });
    screens.show("add_new_site");
	navigator.log.debug("Displayed add new site screen.");
};

siteController.list = function(){
	navigator.log.debug("Displayed list of field trips.");
    screens.show("sites_to_visit");
};

siteController.create = function(){
	navigator.log.debug("Creating a new site");
    var site = new Site();
    site.id = Math.round(new Date().getTime() / 1000);
    site.offline = true;
    site.name = $("#site_title").val();
    site.type = $("#sitetypes").val();
    site.narrative = "Please provide a full report.";
	devtrac.fieldTrip.sites.push(site);
	navigator.store.put(function(){
        alert(site.name + " added successfuly.");
		$("#site_title").val("");
		navigator.log.debug("Saved newly created site.");
        fieldTripController.showTripReports();
    }, function(){
        devtrac.common.logAndShowGenericError("Error in creating trip.");
        screens.show("sites_to_visit");
    }, devtrac.user.name, JSON.stringify(devtrac.fieldTrip));
}

