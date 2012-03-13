describe("SiteUpload", function(){

	var uploader = new SiteUpload();
	var progressCallback = jasmine.createSpy('uploader.progressCallback');
	var successCallback = jasmine.createSpy('uploader.successCallback');
	var errorCallback = jasmine.createSpy('uploader.errorCallback');

	describe("upload all sites successfully", function(){
		beforeEach(function(){
			var sites = [1, 2, 3];
			spyOn(devtrac.siteUpload, '_packageSite').andCallFake(function(site){
				return [{'name':site}];
			})
			spyOn(devtrac.dataPush, 'serviceSyncSaveNode').andCallThrough();
			spyOn(navigator.network, 'XHR').andCallFake(function(URL, POSTdata, successCallback, errorCallback){
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

		// TODO verify the arguments especially for the data to be sent
		it("should call navigator.network.XHR for right times", function(){
			expect(navigator.network.XHR.callCount).toEqual(3);
		});

		it("should call createBBSync with correct node data", function(){
			expect(devtrac.dataPush.serviceSyncSaveNode.mostRecentCall.args).toEqual([[{'name':1}]]);
		})
	});

	describe("should only upload the site which has been modified", function(){

		beforeEach(function(){

			spyOn(devtrac.siteUpload, '_packageSite').andCallFake(function(site){
				return [{'name':site}];
			})

			spyOn(devtrac.dataPush, 'serviceSyncSaveNode').andCallThrough();

		})

		it("should only upload the site which uploaded is false", function(){
			var sites = [{'name':1,'uploaded':false},{'name':2,'uploaded':true},{'name':3,'uploaded':false} ];

			spyOn(navigator.network, 'XHR').andCallFake(function(URL, POSTdata, successCallback, errorCallback){
				successCallback({'#data':'data_string'});
			})

			uploader.uploadMultiple(sites, progressCallback, successCallback, errorCallback);

			expect(navigator.network.XHR.callCount).toEqual(2);
		})

		it("should update the uploaded status to true if uploading is succeeded", function(){
			var site ={'name':1,'uploaded':false};

			spyOn(navigator.network, 'XHR').andCallFake(function(URL, POSTdata, successCallback, errorCallback){
				successCallback({'#data':'data_string'});
			})

			uploader.upload(site, successCallback, errorCallback)

			expect(site.uploaded).toEqual(true);
		})

		it("should update the uploaded status to false if uploading is failed", function(){
			var site ={'name':1,'uploaded':false};

			spyOn(navigator.network, 'XHR').andCallFake(function(URL, POSTdata, successCallback, errorCallback){
				errorCallback({'#data':'data_string'});
			})

			uploader.upload(site, successCallback, errorCallback)

			expect(site.uploaded).toEqual(false);
		})
	})
});
