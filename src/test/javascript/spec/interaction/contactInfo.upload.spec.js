describe("ContactInfoUpload", function(){
    var successCallback, errorCallback;
    var contactInfoUpload;
    beforeEach(function(){
        contactInfoUpload = new ContactInfoUpload();
        successCallback = jasmine.createSpy('successCallback');
        errorCallback = jasmine.createSpy('errorCallback');
    })

    describe("callback should be called successfully", function(){
        it('successCallback should be called when contact info update successfully', function(){

            spyOn(devtrac.common, "callServicePut").andCallFake(function(url, postData, successCallback, errorCallback){
                successCallback({
                    "error": false
                });
            })

            var site = SiteMother.createSiteWithContactInfo("site", false, '1', "contact");

            devtrac.contactInfoUpload.upload(site, successCallback, errorCallback);

            expect(site.uploaded).toBeTruthy();
            expect(successCallback).toHaveBeenCalled();
            expect(errorCallback).not.toHaveBeenCalled();
        })

        it('error callback should be called when contact info update failed', function(){

            spyOn(devtrac.common, "callServicePut").andCallFake(function(url, postData, callback, errorCallback){
                errorCallback({
                    "error": true
                });
            })

            var site = SiteMother.createSiteWithContactInfo("site", false, '1', "contact");

            devtrac.contactInfoUpload.upload(site, successCallback, errorCallback);

            expect(site.uploaded).toBeFalsy();
            expect(successCallback).not.toHaveBeenCalled();
            expect(errorCallback).toHaveBeenCalled();
        })
    })

    describe('Correct Http method should be called', function(){
        it('Http POST should be called when uploading newly created contact info', function(){
            spyOn(devtrac.common, "callServicePost").andCallThrough();
            var site = SiteMother.createSiteWithContactInfo("site", false, '0', "contact");

            devtrac.contactInfoUpload.upload(site, successCallback, errorCallback);

            expect(devtrac.common.callServicePost).toHaveBeenCalled();
        })

        it('Http PUT should be called when uploading an existing contact info', function(){
            spyOn(devtrac.common, "callServicePut").andCallThrough();
            var site = SiteMother.createSiteWithContactInfo("site", false, '1', "contact");

            devtrac.contactInfoUpload.upload(site, successCallback, errorCallback);

            expect(devtrac.common.callServicePut).toHaveBeenCalled();
        })
    })

})
