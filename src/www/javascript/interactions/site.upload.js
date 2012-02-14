var uncheckedSites = [];

function SiteUpload(){
}

SiteUpload.prototype.prepare = function(sites){
	uncheckedSites = [];
	$.each(sites, function(index, site){
		site.upload = $('#' + site.id + '_upload').attr('checked');
		if (!site.upload){
			uncheckedSites.push(site);
		}
	})
}

SiteUpload.prototype.unchecked = function(site){
	for(var i in uncheckedSites){
		if (uncheckedSites[i].id == site.id){
			return true;
		}
	}
	return false;
}

SiteUpload.prototype.writeBackUncheckedSites = function(sites){
	for (var i = 0; i < uncheckedSites.length; ++i) {
		var j = 0;
		for ( ; j < sites.length; ++j) {
			if (sites[j].id == uncheckedSites[i].id) {
				sites[j] = uncheckedSites[i];
				break;
			}
		}
		if (sites.length == j) {
			sites.push(uncheckedSites[i]);
		}
	}
	uncheckedSites = [];
}