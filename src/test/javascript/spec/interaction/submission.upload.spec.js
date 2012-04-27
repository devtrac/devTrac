describe("SubmissionUpload", function(){
	 describe("callback should be called successfully", function(){
        var submissionUpload,successCallback, errorCallback;
        beforeEach(function(){
			
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
            var submissionItems = [];
            var item = new SubmissionItem();
            item.id = "489";
            item.response = "66";
            submissionItems.push(item);

            var site = new Site();
            site.id = "1";
            site.placeId = "58";
            site.submission.submissionItems = submissionItems;
            site.submission.uploaded = false;

            submissionUpload.upload(site, successCallback, errorCallback);

            expect(site.submission.uploaded).toBeTruthy();
            expect(successCallback).toHaveBeenCalled();
            expect(errorCallback).not.toHaveBeenCalled();
        })

        it('errorCallback should be called when submission update failed', function(){

            spyOn(devtrac.common, "callServicePost").andCallFake(function(url, postData, callback, errorCallback){
                errorCallback({
                    "error": true
                });
            })

            var site = SiteMother.createSite("site", false, false);

            submissionUpload.upload(site, successCallback, errorCallback);

            expect(site.contactInfo.uploaded).toBeFalsy();
            expect(successCallback).not.toHaveBeenCalled();
            expect(errorCallback).toHaveBeenCalled();
        })
    })
	
	
})
