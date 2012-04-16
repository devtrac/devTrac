function ContactInfoUpload(){
}

ContactInfoUpload.prototype.upload = function(site, successCallback, errorCallback){
    var contactInfo = Site.packageContactInfoData(site);
    var url = 'http://api.tobe.indentify';
    var success = function(response) {
        if (response['error']) {
            var errorMsg = 'Error occured in uploading contact info of site"' + site.name + '". Please try again.';
            navigator.log.log(errorMsg);
            site.uploaded = false;
            errorCallback(errorMsg);
        }
        else {
            site.uploaded = true;
            site.placeId = response['nid'];
            successCallback('ContactInfo of site "' + site.name + '" uploaded successfully.');
        }
    };
     var error = function(srvErr) {
        navigator.log.log('Error in uploading contactInfo of site "' + site.name + '".');
        navigator.log.log(srvErr);
        site.uploaded = false;
        errorCallback(srvErr);
    }
    if(site.placeId === '0'){
        devtrac.common.callServicePost(url, contactInfo, success, error);
    }else{
        devtrac.common.callServicePut(url, contactInfo, success, error);
    }
}
