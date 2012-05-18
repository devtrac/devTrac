function CommentUpload(){
    this.actionItem = "";
	this.items = "";
}

CommentUpload.prototype.uploadMultiple = function(comments, actionItem, progressCallback, successCallback, errorCallback){
	this.actionItem = actionItem;
	this.items = comments;
    this._uploadInternal(comments.slice(), progressCallback, successCallback, errorCallback);
}

CommentUpload.prototype._uploadInternal = function(itemsToUpload, progressCallback, successCallback, errorCallback){
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

CommentUpload.prototype.upload = function(item, successCallback, errorCallback){
    var that = this;
    var itemData = Comment.packageData(this.actionItem, item);
    var success = function(response) {
        if (response['error']) {
            var errorMsg = 'Error occured in uploading comment of action item "' + that.actionItem.title + '". Please try again.\n' +
                           'Error detail:'+ JSON.stringify(response);
            navigator.log.log(errorMsg);
            errorCallback(errorMsg);
        }
        else {
            item.uploaded = true;
            successCallback('Comment of action item "' + that.actionItem.title + '" uploaded successfully.');
        }
    }

    var error = function(srvErr) {
        item.uploaded = false;
        errorCallback(srvErr);
    }

    devtrac.common.callServicePost(DT_D7.COMMENT, itemData, success, error);
}

CommentUpload.prototype._processResult = function(successCallback, errorCallback){
    var failedCounts = 0;
    for(index in this.items){
        failedCounts += (this.items[index].uploaded ? 0 : 1);
    }

    var msg = 'Comment Uploading finished. ' + failedCounts + ' failure in ' + this.itemsCount + (this.itemsCount > 1 ? ' items' : ' item') + '.';
    failedCounts > 0 ? errorCallback(msg) : successCallback(msg);
}