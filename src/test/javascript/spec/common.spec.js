describe("Common", function(){

    var timeout = 1000;
    var delay = 500;
    var successData = "OK";
    var errorData = "Network error";

    var successCallback;
    var errorCallback;

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

    describe("callServiceWithTimeout", function(){
        var Callback = function() {}
        Callback.prototype.success = function(response) {}
        Callback.prototype.error = function(response) {}
        Callback.prototype.timeout = function(response) {}

        var callback = new Callback();
        var data;

        describe("when success", function(){

            beforeEach(function(){
                spyOn(navigator.network, 'XHR').andCallFake(function(URL, POSTdata, successCallback, errorCallback){
                    successCallback(successData);
                })

                spyOn(callback, "success").andCallFake(function(response){
                    data = response["data"];
                });
                spyOn(callback, "error");
                spyOn(callback, "timeout");

                devtrac.common.callServiceWithTimeout({}, timeout, callback.success, callback.error, callback.timeout);
            })

            it("'successCallback' should be called", function(){
                expect(callback.success).toHaveBeenCalled();
            })

            it("data should be received", function(){
                expect(data).toEqual(successData);
            })

            it("'errorCallback' should NOT be called", function(){
                expect(callback.error).not.toHaveBeenCalled();
            })

            it("'timeoutCallback' should NOT be called", function(){
                expect(callback.timeout).not.toHaveBeenCalled();
            })
        })

        describe("when some network error occurred", function(){

            beforeEach(function(){
                spyOn(navigator.network, 'XHR').andCallFake(function(URL, POSTdata, successCallback, errorCallback){
                    errorCallback(errorData);
                })

                spyOn(callback, "success");
                spyOn(callback, "error").andCallFake(function(response){
                    data = response["error"];
                });
                spyOn(callback, "timeout");

                devtrac.common.callServiceWithTimeout({}, timeout, callback.success, callback.error, callback.timeout);
            })

            it("'successCallback' should NOT be called", function(){
                expect(callback.success).not.toHaveBeenCalled();
            })

            it("'errorCallback' should be called", function(){
                expect(callback.error).toHaveBeenCalled();
            })

            it("'timeoutCallback' should NOT be called", function(){
                expect(callback.timeout).not.toHaveBeenCalled();
            })
        })

        describe("when request timeout", function(){

            beforeEach(function(){
                spyOn(navigator.network, 'XHR').andCallFake(function(URL, POSTdata, successCallback, errorCallback){
                    var invokeSuccessCallback = function(){
                        successCallback(successData);
                    };
                    var invokeErrorCallback = function(){
                        errorCallback(errorData);
                    };
                    setTimeout(invokeSuccessCallback, timeout + delay);
                    setTimeout(invokeErrorCallback, timeout + delay);
                })

                spyOn(callback, "success");
                spyOn(callback, "error");
                spyOn(callback, "timeout").andCallFake(function(response){
                    data = response["error"];
                });

                devtrac.common.callServiceWithTimeout({}, timeout, callback.success, callback.error, callback.timeout);
                waits(timeout + delay*2);
            })

            it("'successCallback' should NOT be called", function(){
                expect(callback.success).not.toHaveBeenCalled();
            })

            it("'errorCallback' should NOT be called", function(){
                expect(callback.error).not.toHaveBeenCalled();
            })

            it("'timeoutCallback' should be called", function(){
                expect(callback.timeout).toHaveBeenCalled();
            })
        })
    })
});

