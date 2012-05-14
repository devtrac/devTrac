function SiteUpload(){
    var siteCounts;
    var sites;
}

SiteUpload.prototype.uploadMultiple = function(sitesToUpload, progressCallback, successCallback, errorCallback){
    siteCounts = sitesToUpload.length;
    sites = sitesToUpload;
    devtrac.siteUpload._uploadInternal(sitesToUpload.slice(), progressCallback, successCallback, errorCallback);
    this.progressCallback = progressCallback;
}

SiteUpload.prototype.upload = function(site, successCallback, errorCallback){
    if (site.uploaded) {
        navigator.log.log('Site "' + site.name + '" is skipped as it is unchanged.');
        successCallback('Site "' + site.name + '" is skipped as it is unchanged.');
        return;
    }

    var that = this;
    var siteData = Site.packageData(site, devtrac.fieldTrip.id);

    var success = function(response) {
        navigator.log.debug('Received response from service: ' + JSON.stringify(response));
        if (response['error']) {
            var error = 'Error occured in uploading site "' + site.name + '". Please try again.\n'+
                        'Error detail:'+ JSON.stringify(response);
            navigator.log.log(error);
            errorCallback(error);
        }
        else {
            site.id = response['nid'];
            site.uploaded = true;
            var actionUploadCallback = function (msg){
                 for(var index in site.actionItems){
                    site.uploaded =  site.uploaded && site.actionItems[index].uploaded ;
                }

                var contactUploadedCallback = function(){
                    site.uploaded = site.uploaded && site.contactInfo.uploaded;
                    var submissionUploadedCallback = function(){
                        site.uploaded = site.uploaded && site.submission.uploaded;

                        devtrac.currentSite = site;
                        devtrac.dataStore.saveCurrentSite(function(){
                            navigator.log.log('Site "' + site.name + '" is marked as uploaded.');
                        });
                        navigator.log.log('Site "' + site.name + '" uploaded successfully.');
                        successCallback('Site "' + site.name + '" uploaded successfully.');
                    }
                    devtrac.submissionUpload.upload(site, submissionUploadedCallback, submissionUploadedCallback);
                }
                devtrac.contactInfoUpload.upload(site, contactUploadedCallback, contactUploadedCallback);
            }
            devtrac.actionItemUpload.uploadMultiple(site.actionItems, site.id, site.placeId, that.progressCallback, actionUploadCallback, actionUploadCallback);
        }
    }

    var error = function(srvErr) {
        navigator.log.log('Error in uploading site "' + site.name + '".');
        navigator.log.log(srvErr);
        errorCallback(srvErr);
    }

    if (site.offline) {
        devtrac.common.callServicePost(Site.createURL(), siteData, success, error);
    } else {
        devtrac.common.callServicePut(Site.updateURL(site), siteData, success, error);
    }
}

SiteUpload.prototype._uploadInternal = function(sitesToUpload, progressCallback, successCallback, errorCallback){
    if (sitesToUpload.length > 0) {
        var index = siteCounts - sitesToUpload.length;
        progressCallback('Site ' + (index + 1) + ' of ' + siteCounts + ' is uploading...');
        devtrac.siteUpload.upload(sitesToUpload.shift(), function(msg) {
            progressCallback(msg);
            devtrac.siteUpload._uploadInternal(sitesToUpload, progressCallback, successCallback, errorCallback);
        }, function(err) {
            progressCallback(err);
            devtrac.siteUpload._uploadInternal(sitesToUpload, progressCallback, successCallback, errorCallback);
        });
    } else {
        devtrac.siteUpload._processResult(successCallback, errorCallback);
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

SiteUpload.prototype._processResult = function(successCallback, errorCallback){
    var failedSites = [];
    for(index in sites){
        if (!sites[index].uploaded) {
            failedSites.push(sites[index].name);
        }
    }

    var msg = 'Uploading finished. ' + failedSites.length + ' failure in ' + siteCounts + 'site(s)' + '.'+ '\n' + '"'+failedSites.join('",\n"')+'"';

    failedSites.length  > 0 ? errorCallback(msg) : successCallback(msg);
}

