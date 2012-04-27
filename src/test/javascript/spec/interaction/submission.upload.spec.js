describe("SubmissionUpload", function(){
	 describe("callback should be called successfully", function(){
        var submissionUpload,successCallback, errorCallback,site;
        beforeEach(function(){
            site = SiteMother.createSite("site1", false, false);
            submissionUpload = new SubmissionUpload();
            successCallback = jasmine.createSpy('successCallback');
            errorCallback = jasmine.createSpy('errorCallback');
        })

        it('successCallback should be called when submission update successfully', function(){

            spyOn(devtrac.common, "callServicePost").andCallFake(function(url, postData, successCallback, errorCallback){
                successCallback({
                    "error": false
                });
            })

            submissionUpload.upload(site, successCallback, errorCallback);

            expect(site.submission.uploaded).toBeTruthy();
            expect(successCallback).toHaveBeenCalledWith('Submission of site "site1" uploaded successfully.');
            expect(errorCallback).not.toHaveBeenCalled();
        })

        it('errorCallback should be called when submission update failed', function(){

            spyOn(devtrac.common, "callServicePost").andCallFake(function(url, postData, callback, errorCallback){
                errorCallback({
                    "error": true
                });
            })

            submissionUpload.upload(site, successCallback, errorCallback);

            expect(site.contactInfo.uploaded).toBeFalsy();
            expect(successCallback).not.toHaveBeenCalled();
            expect(errorCallback).toHaveBeenCalled();
        })
    })

})
