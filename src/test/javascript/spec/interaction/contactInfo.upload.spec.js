describe("ContactInfoUpload", function(){

    describe("callback should be called successfully", function(){
        beforeEach(function(){
            successCallback = jasmine.createSpy('successCallback');
            errorCallback = jasmine.createSpy('errorCallback');

            spyOn(devtrac.common, "callServicePost").andCallFake(function(url, postData, callback, errorCallback){
            })
        })

        it('successCallback should be called when contact info update successfully', function(){

            spyOn(devtrac.common, "callServicePut").andCallFake(function(url, postData, callback, errorCallback){
                successCallback({
                    "#error": false
                });
            })

            var site = SiteMother.createSiteWithContactInfo("site", false, false, "contact");

            devtrac.contactInfoUpload.upload(site, successCallback, errorCallback);

            expect(successCallback).toHaveBeenCalled();
            expect(errorCallback).not.toHaveBeenCalled();
        })

        it('error callback should be called when contact info update failed', function(){

            spyOn(devtrac.common, "callServicePut").andCallFake(function(url, postData, callback, errorCallback){
                errorCallback({
                    "#error": true
                });
            })

            var site = SiteMother.createSiteWithContactInfo("site", false, false, "contact");

            devtrac.contactInfoUpload.upload(site, successCallback, errorCallback);

            expect(successCallback).not.toHaveBeenCalled();
            expect(errorCallback).toHaveBeenCalled();
        })

    })
})
