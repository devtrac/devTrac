function ContacInfoUpload(){
    this.uploaded = false;
}

ContacInfoUpload.prototype.upload = function(site, successCallback, errorCallback){
    var contactInfo = Site.packageContactInfoData(site);
    var url = 'http://api.tobe.indentify';

    devtrac.common.callServicePut(url, contactInfo, successCallback, errorCallback);
}
