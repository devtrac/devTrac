describe("Common", function(){

    var successCallback;
    var errorCallback;

    var successData = "OK";

    describe("callService", function(){

        describe("when success", function(){

            beforeEach(function(){
                successCallback = jasmine.createSpy("'successCallback'");
                errorCallback = jasmine.createSpy("'errorCallback'");

                spyOn(navigator.network, 'XHR').andCallFake(function(URL, POSTdata, successCallback, errorCallback){
                    successCallback(successData);
                })

                devtrac.common.callService({}, successCallback, errorCallback);
            })

            it("'successCallback' should be called with received data", function(){
                expect(successCallback).toHaveBeenCalledWith(successData);
            })

            it("'errorCallback' should NOT be called", function(){
                expect(errorCallback).not.toHaveBeenCalled();
            })
        });

        describe("when network error occurred", function(){
            var errorMessage;

            beforeEach(function(){
                successCallback = jasmine.createSpy("'successCallback'");
                errorCallback = jasmine.createSpy("'errorCallback'");
                errorMessage = "Network error occurred.";

                spyOn(navigator.network, 'XHR').andCallFake(function(URL, POSTdata, successCallback, errorCallback){
                    errorCallback(errorMessage);
                })

                devtrac.common.callService({}, successCallback, errorCallback);
            })

            it("'errorCallback' should be called with network error message", function(){
                expect(errorCallback).toHaveBeenCalledWith(errorMessage);
            })

            it("'successCallback' should NOT be called", function(){
                expect(successCallback).not.toHaveBeenCalled();
            })
        });
    });
});

