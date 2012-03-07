describe("user.login", function(){

    describe("authenticate", function(){

        describe("When authenticate success", function(){

            var successCallback;
            var failedCallback;

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
    })
})
