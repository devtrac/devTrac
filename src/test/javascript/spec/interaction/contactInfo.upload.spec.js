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

            var site = SiteMother.createSiteWithContactInfo("site", false, '1', "contact", false);

            devtrac.contactInfoUpload.upload(site, successCallback, errorCallback);

            expect(site.contactInfo.uploaded).toBeTruthy();
            expect(successCallback).toHaveBeenCalled();
            expect(errorCallback).not.toHaveBeenCalled();
        })

        it('error callback should be called when contact info update failed', function(){

            spyOn(devtrac.common, "callServicePut").andCallFake(function(url, postData, callback, errorCallback){
                errorCallback({
                    "error": true
                });
            })

            var site = SiteMother.createSiteWithContactInfo("site", false, '1', "contact", false);

            devtrac.contactInfoUpload.upload(site, successCallback, errorCallback);

            expect(site.contactInfo.uploaded).toBeFalsy();
            expect(successCallback).not.toHaveBeenCalled();
            expect(errorCallback).toHaveBeenCalled();
        })
    })

    describe('Correct Http method should be called', function(){
        it('Http POST should be called when uploading newly created contact info', function(){
            spyOn(devtrac.common, "callServicePost").andCallThrough();
            var site = SiteMother.createSiteWithContactInfo("site", false, '0', "contact", false);

            devtrac.contactInfoUpload.upload(site, successCallback, errorCallback);

            expect(devtrac.common.callServicePost.mostRecentCall.args[0]).toEqual(DT_D7.NODE_CREATE);
        })

        it('Http PUT should be called when uploading an existing contact info', function(){
            spyOn(devtrac.common, "callServicePut").andCallThrough();
            var site = SiteMother.createSiteWithContactInfo("site", false, '1', "contact", false);

            devtrac.contactInfoUpload.upload(site, successCallback, errorCallback);

            expect(devtrac.common.callServicePut.mostRecentCall.args[0]).toEqual(DT_D7.NODE_SAVE.replace('<NODE_ID>', site.placeId))
        })

        it('Should not invoke any http method when "uploaded" of contact info is true', function(){
            spyOn(devtrac.common, "callServicePut").andCallThrough();
            spyOn(devtrac.common, "callServicePost").andCallThrough();

            var site = SiteMother.createSiteWithContactInfo("site", false, '1', "contact", true);

            devtrac.contactInfoUpload.upload(site, successCallback, errorCallback);

            expect(devtrac.common.callServicePost).not.toHaveBeenCalled();
            expect(devtrac.common.callServicePut).not.toHaveBeenCalled();
        })
    })

})
