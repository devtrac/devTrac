function SiteUpload(){
}

SiteUpload.prototype.uploadMultiple = function(sites, progressCallback, successCallback, errorCallback){
	devtrac.siteUpload._uploadInternal(sites, {}, successCallback, progressCallback, errorCallback);
}

SiteUpload.prototype.upload = function(site, successCallback, errorCallback){
	var nodeData = {
	}

    devtrac.common.callService(nodeData, function(data){
        successCallback(data, data['#data']);
    }, function(data){
        errorCallBack('Failed: ' + JSON.stringify(data));
    });
}

SiteUpload.prototype._uploadInternal = function(sites, uploadedSites, progressCallback, successCallback, errorCallback){
	var siteToUpload = sites.pop();
	if(siteToUpload){
		devtrac.siteUpload.upload(siteToUpload, function(nid){
			uploadedSites[siteToUpload] = nid;
			if(progressCallback)
				progressCallback(uploadedSites, siteToUpload, nid);
			devtrac.siteUpload._uploadInternal(sites, uploadedSites, progressCallback, successCallback, errorCallback);
		}, errorCallback);
	} else {
		successCallback(uploadedSites);
	}
}
