function ContactInfoUpload(){
}

ContactInfoUpload.prototype.upload = function(site, successCallback, errorCallback){
    if(site.contactInfo.uploaded){
        var msg = 'ContactInfo of site "' + site.name + '" is skipped as it is unchanged.';
        navigator.log.log(msg);
        successCallback(msg);
        return;
    }

    var contactInfo = Site.packageContactInfoData(site);
    var url = 'http://api.tobe.indentify';
    var success = function(response) {
        if (response['error']) {
            var errorMsg = 'Error occured in uploading contact info of site"' + site.name + '". Please try again.';
            navigator.log.log(errorMsg);
            site.contactInfo.uploaded = false;
            errorCallback(errorMsg);
        }
        else {
            site.contactInfo.uploaded = true;
            site.placeId = response['nid'];
            successCallback('ContactInfo of site "' + site.name + '" uploaded successfully.');
        }
    };
     var error = function(srvErr) {
        navigator.log.log('Error in uploading contactInfo of site "' + site.name + '".');
        navigator.log.log(srvErr);
        site.contactInfo.uploaded = false;
        errorCallback(srvErr);
    }
    if(site.placeId === '0'){
        devtrac.common.callServicePost(url, contactInfo, success, error);
    }else{
        devtrac.common.callServicePut(url, contactInfo, success, error);
    }
}
