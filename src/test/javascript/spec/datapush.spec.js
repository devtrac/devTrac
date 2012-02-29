describe("DataPush", function(){
	describe("isAllSitesUploaded", function(){
		beforeEach(function(){
			devtrac.fieldTrip.sites = [{'uploaded':true}, {'uploaded':true}];
		})

		describe("when no site is changed", function(){
			it("return true", function(){
				expect(devtrac.dataPush.isAllSitesUploaded()).toBeTruthy();
			})
		})

		describe("when some sites are changed", function() {
			it("return false", function() {
				devtrac.fieldTrip.sites[0].uploaded = false;
				expect(devtrac.dataPush.isAllSitesUploaded()).toBeFalsy();
			})
		})
	})
})