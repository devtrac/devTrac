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

    function createSite(name, uploaded, offline){
        var site = new Site();
        site.name = name;
        site.uploaded = uploaded;
		site.offline = offline;
        return site;
    }

    describe("upload existing sites", function(){
        beforeEach(function(){
            sites.push(createSite('YES', false, false));
            sites.push(createSite('NO', false, false));
            sites.push(createSite('YES', false, false));

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
        beforeEach(function() {
            sites.push( createSite('YES', false, true));
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
            sites.push(createSite('1',false, false));
            sites.push(createSite('2',true, false));
            sites.push(createSite('3',false, false));
            spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, successCallback, errorCallback){
                successCallback({'#data':'data_string'});
            })

            uploader.uploadMultiple(sites, progressCallback, successCallback, errorCallback);

            expect(navigator.network.XHR.callCount).toEqual(2);
        })

        it("should update the uploaded status to true if uploading is succeeded", function(){
            var site = createSite('1',false,false);

            spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, successCallback, errorCallback){
                successCallback({'#data':'data_string'});
            })

            uploader.upload(site, successCallback, errorCallback)

            expect(site.uploaded).toEqual(true);
        })

        it("should update the uploaded status to false if uploading is failed", function(){
            var site = createSite('1',false,false);

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
                sites.push(createSite('YES',false,false));
                sites.push(createSite('YES',false,false));
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
                sites.push(createSite('YES',false, false));
                sites.push(createSite('NO',false, false));
                sites.push(createSite('YES',false, false));
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

