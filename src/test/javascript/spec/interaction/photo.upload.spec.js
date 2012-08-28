describe("PhotoUpload", function(){
    describe("Upload image to D7", function(){
        var successCallback;
        var errorCallback;
        var cookie, method;
        successCallback = jasmine.createSpy('photoUpload.successCallback');
        errorCallback = jasmine.createSpy('photoUpload.errorCallback');

        describe("When succeed", function(){
            it("should return fid", function(){
                devtrac.user.uid = 23;
                var filePath = "twer/image/image.jpg";
                spyOn(navigator.network, 'XHRUpload').andCallFake(function(cookie, method, URL, data, filepath, loggedinUser, successCallback, errorCallback){
                    successCallback({'fid':'15'});
                })

                devtrac.photoUpload.upload(filePath, successCallback, errorCallback);

                expect(successCallback).toHaveBeenCalledWith('15');
            })
        })

        describe("When failed", function(){
            it("error callBack should be called", function(){
                devtrac.user.uid = 23;
                var filePath = "twer/image/image.jpg";
                spyOn(navigator.network, 'XHRUpload').andCallFake(function(cookie, method, URL, data, filepath, loggedinUser, successCallback, errorCallback){
                    errorCallback({'error':'true'});
                })
                devtrac.photoUpload.upload(filePath, successCallback, errorCallback);

                expect(errorCallback).toHaveBeenCalled();
            })
        })
    })
})
