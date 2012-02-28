function SiteUpload(){
}

SiteUpload.prototype.uploadMultiple = function(sites, progressCallback, successCallback, errorCallback){
	devtrac.siteUpload._uploadInternal(sites, progressCallback, successCallback, errorCallback);
}

SiteUpload.prototype.upload = function(site, successCallback, errorCallback){
	if (site.uploaded) {
		navigator.log.log('Site "' + site.name + '" is skipped as it is unchanged.');
		successCallback('Site "' + site.name + '" is skipped as it is unchanged.');
		return;
	}

	var siteData;
	try {
		siteData = devtrac.siteUpload._packageSite(site);
	} catch(ex) {
		navigator.log.log('Error while creating upload node');
		navigator.log.log('Error: ' + ex);
		errorCallback(ex);
		return;
	}

	var bbSyncNode = devtrac.siteUpload._createBBSyncNode(siteData);

	devtrac.dataPush._callService(bbSyncNode, function(response){
        navigator.log.debug('Received response from service: ' + JSON.stringify(response));
        if (response['#error']) {
            errorCallback('Error occured in uploading site "' + site.name + '". Please try again.');
        }
        else {
            site.uploaded = true;
            devtrac.currentSite = site;
            devtrac.dataStore.saveCurrentSite(function(){
                navigator.log.log('Site "' + site.name + '" is marked as uploaded.');
            });
            navigator.log.log('Site "' + site.name + '" uploaded successfully.');
            successCallback('Site "' + site.name + '" uploaded successfully.');
        }
    }, function(srvErr){
        navigator.log.log('Error in uploading site "' + site.name + '".');
        navigator.log.log(srvErr);
        errorCallback(srvErr);
    });
}

SiteUpload.prototype._uploadInternal = function(sites, progressCallback, successCallback, errorCallback){
	var siteToUpload = sites.pop();
	if (siteToUpload) {
		devtrac.siteUpload.upload(siteToUpload, function(msg) {
			progressCallback(msg);
			devtrac.siteUpload._uploadInternal(sites, progressCallback, successCallback, errorCallback);
		}, function(err) {
			progressCallback(err);
			errorCallback(err);
		});
	} else {
		successCallback('All sites uploaded successfully.');
	}
}

SiteUpload.prototype._packageSite = function(site){
	var siteData = [];
	
	siteData.push(devtrac.dataPush.createUpdatePlaceNode(site));
    
    if (site.offline) {
        navigator.log.debug('Collecting data for Creating new site ' + ((site && site.name) ? site.name : ''));
        site.id = "%REPORTITEMID%";
        site.placeId = "%PLACEID%";
        siteData.push(devtrac.dataPush.createFieldTripItemNode(devtrac.fieldTrip.id, site));
    }
    else {
        navigator.log.debug('Collecting data for Updating site ' + ((site && site.name) ? site.name : ''));
        siteData.push(devtrac.dataPush.updateFieldTripItemNode(site));
    }

    $.each(site.actionItems, function(ind, actionItem){
        navigator.log.debug('Collecting data for creating ActionItem ' + ((actionItem && actionItem.title) ? actionItem.title : '') + ' node');
        siteData.push(devtrac.dataPush.createActionItemNode(site.id, site.placeId, actionItem));
    });
    
    navigator.log.debug('Collecting data for Updating answers data');
    if (site.submission && site.submission.length && site.submission.length > 0) {
        var questionsNode = devtrac.dataPush.questionsSaveNode(site);
        if (questionsNode) {
            siteData.push(questionsNode);
        }
    }
    
    return siteData;
}

SiteUpload.prototype._createBBSyncNode = function(siteData){
    navigator.log.debug('Creating service sync node');
    var serviceSyncNode = devtrac.dataPush.serviceSyncSaveNode(siteData);
    var length = devtrac.common.convertHash(serviceSyncNode).length;
    navigator.log.debug('Calling upload service with ' + length + ' byte data.');
    return serviceSyncNode;
}
