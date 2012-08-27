function PhotoUpload(){
}

PhotoUpload.prototype.upload = function(filePath, successCallback, errorCallback){
    var userId = devtrac.user.uid;
        devtrac.common.callServiceUpload(DT_D7.FILE_SAVE, filePath, userId, successCallback, errorCallback);
}

PhotoUpload.prototype.uploadMultiple = function(filePaths, successCallback, progressCallback, errorCallback){
	devtrac.photoUpload._uploadInternal(filePaths, {}, successCallback, progressCallback, errorCallback);
}

PhotoUpload.prototype._uploadInternal = function(filePaths, uploadedFiles, successCallback, progressCallback, errorCallback){
	var fileToUpload = filePaths.pop();
	if(fileToUpload){
		devtrac.photoUpload.upload(fileToUpload,function(fid){
			uploadedFiles[fileToUpload] = fid;
			if(progressCallback)
				progressCallback(uploadedFiles,fileToUpload, fid);
			devtrac.photoUpload._uploadInternal(filePaths, uploadedFiles, successCallback, progressCallback, errorCallback);
		}, errorCallback);
	} else {
		successCallback(uploadedFiles);
	}
}