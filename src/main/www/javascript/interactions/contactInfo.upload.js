function ContactInfoUpload(){
    this.uploaded = false;
}

ContactInfoUpload.prototype.upload = function(site, successCallback, errorCallback){
    var contactInfo = Site.packageContactInfoData(site);
    var url = 'http://api.tobe.indentify';
    var success = function(response) {
        if (response['error']) {
            var errorMsg = 'Error occured in uploading contact info of site"' + site.name + '". Please try again.';
            navigator.log.log(errorMsg);
            devtrac.contactInfoUpload.uploaded = false;
            errorCallback(errorMsg);
        }
        else {
            devtrac.contactInfoUpload.uploaded = true;
            site.placeId = response['nid'];
            successCallback('ContactInfo of site "' + site.name + '" uploaded successfully.');
        }
    };
     var error = function(srvErr) {
        navigator.log.log('Error in uploading contactInfo of site "' + site.name + '".');
        navigator.log.log(srvErr);
        devtrac.contactInfoUpload.uploaded = false;
        errorCallback(srvErr);
    }
    devtrac.common.callServicePut(url, contactInfo, success, error);
}
