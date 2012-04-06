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
            var site = new Site();
            site.name = "YES";
            site.uploaded = false;
            sites.push(site);
            site = new Site();
            site.name = "NO";
            site.uploaded = false;
            sites.push(site);
            site = new Site();
            site.name = "YES";
            site.uploaded = false;
            sites.push(site);

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
            expect(navigator.network.XHR.mostRecentCall.args[3]).toEqual('title=YES&type=ftritem&field_ftritem_narrative[und][0][value]=&field_ftritem_public_summary[und][0][value]=&field_ftritem_date_visited[und][0][value][date]=&language=und&');
        })
    });

    describe("upload new sites", function(){
        it("should use HTTP POST method to create node", function(){
            var site = new Site();
            site.name = "YES";
            site.uploaded = false;
            site.offline = true;
            sites.push(site);

            spyOn(devtrac.common, "callServicePost").andCallThrough();

            uploader.uploadMultiple(sites, progressCallback, successCallback, errorCallback);
            expect(devtrac.common.callServicePost).toHaveBeenCalled();
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
            sites = [{'name':1,'uploaded':false},{'name':2,'uploaded':true},{'name':3,'uploaded':false} ];

            spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, successCallback, errorCallback){
                successCallback({'#data':'data_string'});
            })

            uploader.uploadMultiple(sites, progressCallback, successCallback, errorCallback);

            expect(navigator.network.XHR.callCount).toEqual(2);
        })

        it("should update the uploaded status to true if uploading is succeeded", function(){
            var site ={'name':1,'uploaded':false};

            spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, successCallback, errorCallback){
                successCallback({'#data':'data_string'});
            })

            uploader.upload(site, successCallback, errorCallback)

            expect(site.uploaded).toEqual(true);
        })

        it("should update the uploaded status to false if uploading is failed", function(){
            var site ={'name':1,'uploaded':false};

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
                    successCallback({"#error": false});
                } else {
                    errorCallback({"#error": true});
                }
            })

        })

        describe("when success", function(){
            beforeEach(function(){
                sites = [{name: "YES", uploaded: false}, {name: "YES", uploaded: false}];
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
                sites = [{name: "YES", uploaded: false}, {name: "NO", uploaded: false}, {name: "YES", uploaded: false}];
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

