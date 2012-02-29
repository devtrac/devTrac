function SiteDetailController(){

}

SiteDetailController.prototype.show = function(){
	navigator.log.debug("Showing details for site.");
    $("#site_details_title").html(devtrac.currentSite.name);
    screens.show('site_details');
};

SiteDetailController.prototype.narrative = function(){
	navigator.log.debug("Showing narrative of site.");
    $(".site_narrative_notes").val(devtrac.currentSite.narrative);
    screens.show('site_narrative');
};

SiteDetailController.prototype.updateNarrative = function(){
	var narrative = $(".site_narrative_notes").val();
	if (narrative) {
		devtrac.currentSite.narrative = narrative;

		devtrac.currentSite.uploaded = false;
		devtrac.dataStore.saveCurrentSite(function(){
			alert("Updated narrative text.");
			devtrac.siteDetailController.show();
		});
	}else{
		alert("Please provide summary.");
	}
};
