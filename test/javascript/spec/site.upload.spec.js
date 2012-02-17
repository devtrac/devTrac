describe("SiteUpload", function(){

	describe("upload all sites successfully", function(){

		var uploader = new SiteUpload();
		var progressCallback = jasmine.createSpy('uploader.progressCallback');
		var successCallback = jasmine.createSpy('uploader.successCallback');
		var errorCallback = jasmine.createSpy('uploader.errorCallback');

		beforeEach(function(){
			var sites = [1, 2, 3];
			spyOn(navigator.network, 'XHR').andCallFake(function(URL, POSTdata, successCallback, errorCallback){
				successCallback({'#data':'data_string'});
			})
			uploader.uploadMultiple(sites, progressCallback, successCallback, errorCallback);
		})

		it("should call progress callback for right times", function(){
			expect(progressCallback.callCount).toEqual(3);
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
	});
});
