describe("SiteUpload", function(){

    var sites;
    var uploader ;
    var progressCallback;
    var successCallback;
    var errorCallback;
    var cookie, URL, method;

    beforeEach(function() {
        sites = [];
        uploader = new SiteUpload();
    })

    describe("upload existing sites", function(){
        beforeEach(function(){
            sites.push(SiteMother.createSite('YES', false, false));
            sites.push(SiteMother.createSite('NO', false, false));
            sites.push(SiteMother.createSite('YES', false, false));

            progressCallback = jasmine.createSpy('uploader.progressCallback');
            successCallback = jasmine.createSpy('uploader.successCallback');
            errorCallback = jasmine.createSpy('uploader.errorCallback');

            spyOn(devtrac.common, "callServicePut").andCallThrough();
            spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, successCallback, errorCallback){
                successCallback({'#data':'data_string'});
            })

            uploader.uploadMultiple(sites, progressCallback, successCallback, errorCallback);
        })

        it("should call progress callback for right times", function(){
            expect(progressCallback.callCount).toEqual(6);
        });

        it("should call success callback", function(){
            expect(successCallback).toHaveBeenCalled();
        });

        it("should NOT call error callback", function(){
            expect(errorCallback).not.toHaveBeenCalled();
        });

        it("should call navigator.network.XHR for right times", function(){
            expect(navigator.network.XHR.callCount).toEqual(3);
        });

        it("should use HTTP PUT to update node", function() {
            expect(devtrac.common.callServicePut).toHaveBeenCalled();
        })

        it("should send data in format of parameter string", function() {
            var expected = 'title=YES&type=ftritem&field_ftritem_narrative[und][0][value]=&field_ftritem_public_summary[und][0][value]=&field_ftritem_date_visited[und][0][value][date]=&language=und&';
            expect(navigator.network.XHR.mostRecentCall.args[3]).toEqual(expected);
        })

    });

    describe('upload site with contact info', function(){
        var site;

        beforeEach(function(){
            successCallback = jasmine.createSpy('uploader.successCallback');
            errorCallback = jasmine.createSpy('uploader.errorCallback');
            site = SiteMother.createSiteWithContactInfo("site", false, '1', "contact");
        })

        it('should upload contact info after site uploaded successfully', function(){
            spyOn(devtrac.common, "callServicePut").andCallFake(function(url, postData, callback, errorCallback){
                callback('{nid: 1}');
            });

            spyOn(devtrac.contactInfoUpload, "upload").andCallThrough();

            uploader.upload(site, successCallback, errorCallback);

            expect(devtrac.contactInfoUpload.upload).toHaveBeenCalled();
        })

        it('should not upload contact info when site uploaded failed', function(){
            spyOn(devtrac.common, "callServicePut").andCallFake(function(url, postData, callback, errorCallback){
                errorCallback();
            });

            spyOn(devtrac.contactInfoUpload, "upload").andCallThrough();

            uploader.upload(site, successCallback, errorCallback);

            expect(devtrac.contactInfoUpload.upload).not.toHaveBeenCalled();
        })

    describe('site "uploaded" should be updated to', function(){

        beforeEach(function(){
            spyOn(devtrac.common, "callServicePut").andCallFake(function(url, postData, callback, errorCallback){
                callback('{nid: 1}');
            });

           var site = SiteMother.createSiteWithContactInfo("site", false, '1', "contact");
        })

        it('"true" after contact info being uploaded successfully', function(){
            spyOn(devtrac.contactInfoUpload, "upload").andCallFake(function(site, successCallback, errorCallback){
                site.contactInfo.uploaded = true;
                successCallback();
            })

            uploader.upload(site, successCallback, errorCallback);

            expect(site.contactInfo.uploaded).toBeTruthy();
        })

        it('"false" after the contact info is uploaded failed', function(){
            spyOn(devtrac.contactInfoUpload, "upload").andCallFake(function(site, successCallback, errorCallback){
                site.contactInfo.uploaded = false;
                errorCallback();
            })

            uploader.upload(site, successCallback, errorCallback);

            expect(site.contactInfo.uploaded).toBeFalsy();
        })
    })
    })

    describe('upload site with action items', function(){
        var site;

        beforeEach(function(){
            successCallback = jasmine.createSpy('uploader.successCallback');
            errorCallback = jasmine.createSpy('uploader.errorCallback');
            site = SiteMother.createSiteWithActionItems('1', false);
        })

        it('should upload action items after site uploaded successfully', function(){
            spyOn(devtrac.common, "callServicePut").andCallFake(function(url, postData, callback, errorCallback){
                callback('{#nid: 1}');
            });

            spyOn(devtrac.actionItemUpload, "uploadMultiple").andCallFake(function(items, siteId, placeId, progressCallback, successCallback, errorCallback){
            })

            uploader.upload(site, successCallback, errorCallback);

            expect(devtrac.actionItemUpload.uploadMultiple).toHaveBeenCalled();
        })

        it('should not upload action items when site uploaded failed', function(){
            spyOn(devtrac.common, "callServicePut").andCallFake(function(url, postData, callback, errorCallback){
                errorCallback();
            });

            spyOn(devtrac.actionItemUpload, "uploadMultiple").andCallFake(function(items, siteId, placeId, progressCallback, successCallback, errorCallback){
            })

            uploader.upload(site, successCallback, errorCallback);

            expect(devtrac.actionItemUpload.uploadMultiple).not.toHaveBeenCalled();
        })

        describe('site "uploaded" should be updated to', function(){

            beforeEach(function(){
                spyOn(devtrac.common, "callServicePut").andCallFake(function(url, postData, callback, errorCallback){
                    callback('{#nid: 1}');
                });

               var site = SiteMother.createSiteWithActionItems('1', false);
            })

            it('"true" after all action items being uploaded successfully', function(){
                spyOn(devtrac.actionItemUpload, "uploadMultiple").andCallFake(function(items, siteId, placeId, progressCallback, successCallback, errorCallback){
                    for (index in items) {
                        items[index].uploaded = true;
                    }

                    successCallback();
                })

                uploader.upload(site, successCallback, errorCallback);

                expect(site.uploaded).toBeTruthy();
            })

            it('"false" after one of action item is uploaded failed', function(){
                spyOn(devtrac.actionItemUpload, "uploadMultiple").andCallFake(function(items, siteId, placeId, progressCallback, successCallback, errorCallback){
                    if (items.length > 0) {
                        items[0].uploaded = false;
                    }
                    errorCallback();
                })

                uploader.upload(site, successCallback, errorCallback);

                expect(site.uploaded).toBeFalsy();
            })
        })
    })

    describe("upload new sites", function(){
        beforeEach(function() {
            sites.push( SiteMother.createSite('YES', false, true));
        })

        it("should use HTTP POST method to create node", function(){
            spyOn(devtrac.common, "callServicePost").andCallThrough();

            uploader.uploadMultiple(sites, progressCallback, successCallback, errorCallback);

            expect(devtrac.common.callServicePost).toHaveBeenCalled();
        })

        it("updated nid of the site", function() {
            spyOn(devtrac.common, "callServicePost").andCallFake(function(url, postData, callback, errorCallback) {
                callback({"nid":"6699","uri":"http://geo.devtrac.org/api/node/6699"});
            });

            uploader.uploadMultiple(sites, progressCallback, successCallback, errorCallback);

            expect(sites[0].id).toEqual("6699");
        })
    })

    describe("should only upload the site which has been modified", function(){

        beforeEach(function(){

            spyOn(devtrac.siteUpload, '_packageSite').andCallFake(function(site){
                return [{'name':site}];
            })

            spyOn(devtrac.dataPush, 'serviceSyncSaveNode').andCallThrough();

        })

        it("should only upload the site which uploaded is false", function(){
            sites.push(SiteMother.createSite('1',false, false));
            sites.push(SiteMother.createSite('2',true, false));
            sites.push(SiteMother.createSite('3',false, false));
            spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, successCallback, errorCallback){
                successCallback({'#data':'data_string'});
            })

            uploader.uploadMultiple(sites, progressCallback, successCallback, errorCallback);

            expect(navigator.network.XHR.callCount).toEqual(2);
        })

        it("should update the uploaded status to true if uploading is succeeded", function(){
            var site = SiteMother.createSite('1',false,false);

            spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, successCallback, errorCallback){
                successCallback({'#data':'data_string'});
            })

            uploader.upload(site, successCallback, errorCallback)

            expect(site.uploaded).toEqual(true);
        })

        it("should update the uploaded status to false if uploading is failed", function(){
            var site = SiteMother.createSite('1',false,false);

            spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, successCallback, errorCallback){
                errorCallback({'#data':'data_string'});
            })

            uploader.upload(site, successCallback, errorCallback)

            expect(site.uploaded).toEqual(false);
        })
    });

    describe("uploadMultiple", function(){

        beforeEach(function(){
            progressCallback = jasmine.createSpy('progressCallback');
            successCallback = jasmine.createSpy('successCallback');
            errorCallback = jasmine.createSpy('errorCallback');

            spyOn(devtrac.common, "callServicePut").andCallFake(function(url, data, successCallback, errorCallback){
                if (/YES/.test(JSON.stringify(data))) {
                    successCallback({"error": false});
                } else {
                    errorCallback({"error": true});
                }
            })

        })

        describe("when success", function(){
            beforeEach(function(){
                sites.push(SiteMother.createSite('YES',false,false));
                sites.push(SiteMother.createSite('YES',false,false));
                devtrac.siteUpload.uploadMultiple(sites, progressCallback, successCallback, errorCallback);
            })

            it("origin sites array length should be unchanged", function(){
                expect(sites.length).toEqual(2);
            })

            it("uploaded should be true", function(){
                expect(sites[0].uploaded).toBeTruthy();
            })

            it("successCallback should be called", function(){
                expect(successCallback).toHaveBeenCalled();
            })

            it("errorCallback should NOT be called", function(){
                expect(errorCallback).not.toHaveBeenCalled();
            })
        })

        describe("when error", function(){
            beforeEach(function(){
                sites.push(SiteMother.createSite('YES',false, false));
                sites.push(SiteMother.createSite('NO',false, false));
                sites.push(SiteMother.createSite('YES',false, false));
                devtrac.siteUpload.uploadMultiple(sites, progressCallback, successCallback, errorCallback);
            })

            it("origin sites array length should be unchanged", function(){
                expect(sites.length).toEqual(3);
            })

            it("uploaded should be false when uploading failed", function(){
                expect(sites[1].uploaded).toBeFalsy();
            })

            it("uploaded should be true for site after a failed site", function(){
                expect(sites[2].uploaded).toBeTruthy();
            })

            it("successCallback should NOT be called", function(){
                expect(successCallback).not.toHaveBeenCalled();
            })

            it("errorCallback should be called", function(){
                expect(errorCallback).toHaveBeenCalled();
            })
        })
    })
})

