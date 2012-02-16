describe("SiteUpload", function(){

	describe("upload all sites successfully", function(){

		var uploader = new SiteUpload();
		var sites = [1, 2, 3];
		var progressCallback = jasmine.createSpy('uploader.progressCallback');
		var successCallback = jasmine.createSpy('uploader.successCallback');
		var errorCallback = jasmine.createSpy('uploader.errorCallback');
		navigator.network = {XHR: jasmine.createSpy('navigator.network.XHR')};

		uploader.uploadMultiple(sites, progressCallback, successCallback, errorCallback);

		it("progress callback should be called at right times", function(){
			expect(progressCallback.callCount).toEqual(3);
		});
		
		it("success callback should be called", function(){
			expect(successCallback).toHaveBeenCalled();
		});

		it("error callback should not be called", function(){
			expect(errorCallback).not.toHaveBeenCalled();
		});
		
		// TODO verify the arguments especially for the data to be sent
		it("navigator.network.XHR should be called at right times", function(){
			expect(navigator.network.XHR.callCount).toEqual(3);
		});
	});
});
