function showSiteDetailScreen(event){
    for(var id in devtrac.fieldTrip.sites){
		var site = devtrac.fieldTrip.sites[id];
		if(this.id == site.id || this.id == site.name){
			devtrac.currentSite = site;
			devtrac.siteDetailController.show();
		}
	}
}

function showActionItemEditScreen(event){
	for(var id in devtrac.currentSite.actionItems){
		var actionItem = devtrac.currentSite.actionItems[id];
		if(this.id == actionItem.id){
			devtrac.actionItemController.edit(devtrac.currentSite.actionItems[id]);
		}
	}
}

function attachClickEvents(selector, callback){
    $("'"+ selector +"'").click(callback);
}
