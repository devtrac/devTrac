function SubmissionUpload(){
}

SubmissionUpload.prototype.upload = function(site, successCallback, errorCallback){
    if(site.submission.uploaded){
        var msg = 'Submission of site "' + site.name + '" is skipped as it is unchanged.';
        navigator.log.log(msg);
        successCallback(msg);
        return;
    }

    var submission = Site.packageSubmissions(site.id, site.placeId, site.submission);
    var success = function(response) {
        if (response['error']) {
            var errorMsg = 'Error occured in uploading submssion of site"' + site.name + '". Please try again.';
            navigator.log.log(errorMsg);
            site.submission.uploaded = false;
            errorCallback(errorMsg);
        }
        else {
            site.submission.uploaded = true;
            successCallback('Submission of site "' + site.name + '" uploaded successfully.');
        }
    };
     var error = function(srvErr) {
        navigator.log.log('Error in uploading contactInfo of site "' + site.name + '".');
        navigator.log.log(srvErr);
        site.submission.uploaded = false;
        errorCallback(srvErr);
    }

    devtrac.common.callServicePost(DT_D7.SUBMISSION, submission, success, error);
}
