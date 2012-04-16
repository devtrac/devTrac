function ContactInfoUpload(){
    this.uploaded = false;
}

ContactInfoUpload.prototype.upload = function(site, successCallback, errorCallback){
    var contactInfo = Site.packageContactInfoData(site);
    var url = 'http://api.tobe.indentify';

    devtrac.common.callServicePut(url, contactInfo, successCallback, errorCallback);
}
