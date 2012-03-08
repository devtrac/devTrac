describe("Common", function(){

    var successCallback;
    var errorCallback;

    describe("callService", function(){

        describe("when success", function(){
            var successData;

            beforeEach(function(){
                successCallback = jasmine.createSpy("'successCallback'");
                errorCallback = jasmine.createSpy("'errorCallback'");
                successData = {'#data': 'data_string'};

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
    });
});

