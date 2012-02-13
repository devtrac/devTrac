var uncheckedSites = [];

function SiteUpload(){
}

SiteUpload.prototype.prepare = function(sites){
	$.each(sites, function(index, site){
		site.upload = $('#' + site.id + '_upload').attr('checked');
		if (!site.upload){
			uncheckedSites.push(site.id);
		}
	})
}

SiteUpload.prototype.unchecked = function(site){
	for(var i in uncheckedSites){
		if (uncheckedSites[i] == site.id){
			return true;
		}
	}
	return false;
}
