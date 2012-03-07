describe("user.login", function(){

    describe("authenticate", function(){

        var successCallback;
        var failedCallback;

        describe("When success", function(){

            beforeEach(function(){
                successCallback = jasmine.createSpy();
                failedCallback = jasmine.createSpy();

                spyOn(devtrac.common, "callService").andCallFake(function(data, callback, errorCallback){
                    callback({
                        "#data": {
                            "sessid": 0
                        }
                    });
                })

                authenticate("username", "password", successCallback, failedCallback);
            })

            it("'successCallback' should be invoked", function(){
                expect(successCallback).toHaveBeenCalled();
            })

            it("'failedCallback' should NOT be invoked", function(){
                expect(failedCallback).not.toHaveBeenCalled();
            })
        })

        describe("When failed", function(){

            beforeEach(function(){
                successCallback = jasmine.createSpy();
                failedCallback = jasmine.createSpy();

                spyOn(devtrac.common, "callService").andCallFake(function(data, callback, errorCallback){
                    errorCallback();
                })

                authenticate("username", "password", successCallback, failedCallback);
            })

            it("'successCallback' should NOT be invoked", function(){
                expect(successCallback).not.toHaveBeenCalled();
            })

            it("'failedCallback' should be invoked", function(){
                expect(failedCallback).toHaveBeenCalled();
            })
        })
    })
})
