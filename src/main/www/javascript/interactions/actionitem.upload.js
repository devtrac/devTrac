function ActionItemUpload(){
    this.siteID = 0;
    this.placeID = 0;
    this.items = [];
    this.itemsCount = 0;
}

ActionItemUpload.prototype.uploadMultiple = function(itemsToUpload, siteID, placeID, progressCallback, successCallback, errorCallback){
    this.items = itemsToUpload;
    this.itemsCount = itemsToUpload.length;
    this.siteID = siteID;
    this.placeID = placeID;
    this._uploadInternal(itemsToUpload.slice(), progressCallback, successCallback, errorCallback);
}

ActionItemUpload.prototype._uploadInternal = function(itemsToUpload, progressCallback, successCallback, errorCallback){
    if (itemsToUpload.length > 0) {
        var that = this;
        this.upload(itemsToUpload.shift(), function(msg) {
            progressCallback(msg);
            that._uploadInternal(itemsToUpload, progressCallback, successCallback, errorCallback);
        }, function(err) {
            progressCallback(err);
            that._uploadInternal(itemsToUpload, progressCallback, successCallback, errorCallback);
        });
    } else {
        this._processResult(successCallback, errorCallback);
    }
}

ActionItemUpload.prototype.upload = function(item, successCallback, errorCallback){
     if (item.uploaded) {
        navigator.log.log('ActionItem "' + item.title + '" is skipped as it is unchanged.');
        successCallback('ActionItem "' + item.title + '" is skipped as it is unchanged.');
        return;
    }

    var itemData = ActionItem.packageData(item, this.siteID, this.placeID);

    var success = function(response) {
        if (response['error']) {
            var errorMsg = 'Error occured in uploading actionItem "' + item.title + '". Please try again.';
            navigator.log.log(errorMsg);
            errorCallback(errorMsg);
        }
        else {
            item.id = response['nid'];
            item.uploaded = true;
            successCallback('ActionItem "' + item.title + '" uploaded successfully.');
        }
    }

    var error = function(srvErr) {
        item.uploaded = false;
        errorCallback(srvErr);
    }

    devtrac.common.callServicePost(DT_D7.NODE_CREATE, itemData, success, error);
}

ActionItemUpload.prototype._processResult = function(successCallback, errorCallback){
    var failedCounts = 0;
    for(index in this.items){
        failedCounts += (this.items[index].uploaded ? 0 : 1);
    }

    var msg = 'Uploading finished. ' + failedCounts + ' failure in ' + this.itemsCount + (this.itemsCount > 1 ? ' items' : ' item') + '.';

    failedCounts > 0 ? errorCallback(msg) : successCallback(msg);
}
