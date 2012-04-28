describe("user.login", function(){

    describe("authenticate", function(){

        var successCallback;
        var failedCallback;
		var cookie, method, URL;

        describe("When success", function(){

            beforeEach(function(){
                successCallback = jasmine.createSpy();
                failedCallback = jasmine.createSpy();
                method = "POST";

				spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata, contentType, successCallback, errorCallback){
                    successCallback({
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

              method = 'POST';

                spyOn(navigator.network, 'XHR').andCallFake(function(cookie, method, URL, POSTdata,  contentType, successCallback, failedCallback){
                    failedCallback("Network error.");
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

    describe('userLoggedIn', function(){
        it('should return parsed data', function(){
            var response = {user:{name:'tester', pass:'tester'}};
            var result = userLoggedIn(response);

            expect(result).toBeTruthy();
        })
    })
})
