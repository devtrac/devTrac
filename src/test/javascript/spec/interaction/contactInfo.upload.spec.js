describe("ContactInfoUpload", function(){

    describe("callback should be called successfully", function(){
        var successCallback, errorCallback;
        beforeEach(function(){
            successCallback = jasmine.createSpy('successCallback');
            errorCallback = jasmine.createSpy('errorCallback');
        })

        it('successCallback should be called when contact info update successfully', function(){

            spyOn(devtrac.common, "callServicePut").andCallFake(function(url, postData, successCallback, errorCallback){
                successCallback({
                    "error": false
                });
            })

            var site = SiteMother.createSiteWithContactInfo("site", false, false, "contact");

            devtrac.contactInfoUpload.upload(site, successCallback, errorCallback);

            expect(devtrac.contactInfoUpload.uploaded).toBeTruthy();
            expect(successCallback).toHaveBeenCalled();
            expect(errorCallback).not.toHaveBeenCalled();
        })

        it('error callback should be called when contact info update failed', function(){

            spyOn(devtrac.common, "callServicePut").andCallFake(function(url, postData, callback, errorCallback){
                errorCallback({
                    "error": true
                });
            })

            var site = SiteMother.createSiteWithContactInfo("site", false, false, "contact");

            devtrac.contactInfoUpload.upload(site, successCallback, errorCallback);

            expect(devtrac.contactInfoUpload.uploaded).toBeFalsy();
            expect(successCallback).not.toHaveBeenCalled();
            expect(errorCallback).toHaveBeenCalled();
        })

    })
})
