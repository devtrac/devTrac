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

        describe("When timeout", function(){

            var successCallback;
            var failedCallback;

            beforeEach(function(){
                successCallback = jasmine.createSpy("'successCallback:Timeout'");
                failedCallback = jasmine.createSpy("'failedCallback:Timeout'");
            })

            it("'successCallback' should NOT be invoked", function(){
                spyOn(devtrac.common, "callService").andCallFake(function(data, successCallback, errorCallback){
                    var timeoutHandler = function(){
                        successCallback({
                            "#data": {
                                "sessid": 0
                            }
                        });
                    }
                    setTimeout(timeoutHandler, 1000);
                })

                runs(function(){
                    authenticate("username", "password", successCallback, failedCallback);
                });

                waits(1500);
                runs(function(){
                    expect(successCallback).not.toHaveBeenCalled();
                })
            })

            it("'failedCallback' should be invoked", function(){
                  spyOn(devtrac.common, "callService").andCallFake(function(data, successCallback, errorCallback){})

                  runs(function(){
                      authenticate("username", "password", successCallback, failedCallback)
                  });

                  waits(1000);
                  runs(function(){
                      expect(failedCallback).toHaveBeenCalled();
                  });
            })
        })
    })
})
