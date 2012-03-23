describe("PhotoUpload", function(){
    describe("Upload image to D7", function(){
        var successCallback;
        var errorCallback;
        successCallback = jasmine.createSpy('photoUpload.successCallback');
        errorCallback = jasmine.createSpy('photoUpload.errorCallback');

        it("should return fid", function(){
            devtrac.user.uid = 23;
            var filePath = "twer/image/image.jpg";
            spyOn(navigator.network, 'XHRUpload').andCallFake(function(URL, data, filepath, loggedinUser, targetPath, successCallback, errorCallback){
                successCallback({'fid':'15'});
            })
            devtrac.photoUpload.upload(filePath, successCallback, errorCallback);

            expect(successCallback).toHaveBeenCalledWith('15');
        })
    })
})
