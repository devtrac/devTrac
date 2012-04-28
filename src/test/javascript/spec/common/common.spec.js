describe("Common", function(){

    var timeout = 1000;
    var delay = 500;
    var successData = "OK";
    var errorData = "Network error";
    var timeoutData = "Request timeout";

    var successCallback;
    var errorCallback;
    var cookie, method, URL, POSTdata;

    describe("callService", function(){

        describe("when success", function(){

            beforeEach(function(){
                successCallback = jasmine.createSpy("'successCallback'");
                errorCallback = jasmine.createSpy("'errorCallback'");

                spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, contentType, successCallback, errorCallback){
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

                spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, contentType, successCallback, errorCallback){
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
        method = "GET";

        describe("when success", function(){

            beforeEach(function(){
                spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, contentType, successCallback, errorCallback){
                    successCallback(successData);
                })

                spyOn(callback, "success").andCallFake(function(response){
                    data = response;
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
                spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, contentType, successCallback, errorCallback){
                    errorCallback(errorData);
                })

                spyOn(callback, "success");
                spyOn(callback, "error").andCallFake(function(response){
                    data = response;
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

            it("error message should be received", function(){
                expect(data).toEqual(errorData);
            })
        })

        describe("when request timeout", function(){

            beforeEach(function(){
                spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, contentType, successCallback, errorCallback){
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
                    data = response;
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

            it("timeout message should be received", function(){
                expect(data).toEqual(timeoutData);
            })
        })
    })

    describe("callServiceGet", function(){

        it("Method should be GET", function(){
            successCallback = jasmine.createSpy("'successCallback'");
            errorCallback = jasmine.createSpy("'errorCallback'");
            var success = jasmine.any;
            var error = jasmine.any;
            method = "GET";
            POSTdata = null;

            spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, contentType, contentType, success, error){
            })

            devtrac.common.callServiceGet(URL, successCallback, errorCallback);

            expect(navigator.network.XHR.mostRecentCall.args[1]).toEqual(method);
        })
    })

    describe("convertHash", function(){

        describe("when input is not JSON object", function(){
            it("should return unchanged input", function(){
                var input = "thisisastring";
                var paramStr = devtrac.common.convertHash(input);
                expect(paramStr).toEqual(input);
            })
        })

        describe("when input is JSON object", function(){
            it("should return parameter string", function(){
                var input = {a:1, b:2};
                var paramStr = devtrac.common.convertHash(input);
                expect(paramStr).toEqual("a=1&b=2&");
            })
        })
    })

    describe("initialTaxonomy", function(){
        it("should initial taxonomy correctly", function(){
            devtrac.questions =[{taxonomy:[{id:1}]}];
            devtrac.places = [{id: 1, name: "School"}];

            devtrac.common.initialTaxonomy();

            expect(devtrac.questions[0].taxonomy[0].name).toEqual("School");
        })
    })

    describe("getQuestionTypeById", function(){
        it("should return question type by question id", function(){
            devtrac.questions =[{id:"489", type:"number"}];

            var questionType = devtrac.common.getQuestionTypeById("489");

            expect(questionType).toEqual("number");
        })
    })
});