describe("DataPull", function(){

    describe("placeTypes", function(){
        var callback;

        describe("when success", function(){
            var placeTypes;
            beforeEach(function() {
                callback = jasmine.createSpy("Callback");
                placeTypes = [{
                                      "taxonomy_term_data_taxonomy_term_hierarchy_name": "Water Points",
                                      "taxonomy_term_data_taxonomy_term_hierarchy_vid": "1",
                                      "taxonomy_term_data_taxonomy_term_hierarchy_tid": "23",
                                      "taxonomy_term_data_taxonomy_term_hierarchy__taxonomy_vocabul": "vocabulary_1",
                                      "taxonomy_term_data_name": "Borehole",
                                      "taxonomy_term_data_vid": "1",
                                      "tid": "204",
                                      "taxonomy_vocabulary_machine_name": "vocabulary_1"
                                  },
                                  {
                                      "taxonomy_term_data_taxonomy_term_hierarchy_name": "Other Locations",
                                      "taxonomy_term_data_taxonomy_term_hierarchy_vid": "1",
                                      "taxonomy_term_data_taxonomy_term_hierarchy_tid": "49",
                                      "taxonomy_term_data_taxonomy_term_hierarchy__taxonomy_vocabul": "vocabulary_1",
                                      "taxonomy_term_data_name": "Government Office",
                                      "taxonomy_term_data_vid": "1",
                                      "tid": "3",
                                      "taxonomy_vocabulary_machine_name": "vocabulary_1"
                                  },
                                  {
                                      "taxonomy_term_data_taxonomy_term_hierarchy_name": "Health Facilities",
                                      "taxonomy_term_data_taxonomy_term_hierarchy_vid": "1",
                                      "taxonomy_term_data_taxonomy_term_hierarchy_tid": "2",
                                      "taxonomy_term_data_taxonomy_term_hierarchy__taxonomy_vocabul": "vocabulary_1",
                                      "taxonomy_term_data_name": "Health Centre",
                                      "taxonomy_term_data_vid": "1",
                                      "tid": "197",
                                      "taxonomy_vocabulary_machine_name": "vocabulary_1"
                                  }];

                spyOn(devtrac.remoteView, "get").andCallFake(function(url, successCallback, failedCallback) {
                    successCallback(placeTypes);
                });
                spyOn(devtrac.common, "logAndShowGenericError");
                spyOn(navigator.store, "put");

                devtrac.dataPull.placeTypes(callback);
            });

            it("should call new method to get remote views with correct URL", function() {
                expect(devtrac.remoteView.get.mostRecentCall.args[0]).toEqual('http://geo.devtrac.org/api/views/api_vocabularies.json?display_id=placetypes');
            });

            it("response should be wrapped in '#data' to ensure forward compatibility", function() {
                expect(devtrac.common.logAndShowGenericError).not.toHaveBeenCalled();
            });

            it("parse place types correctly", function() {
                expect(navigator.store.put.mostRecentCall.args[3]).toEqual(
                    '[{"id":"204","name":"Borehole","parentId":"23"},' +
                    '{"id":"3","name":"Government Office","parentId":"49"},' +
                    '{"id":"197","name":"Health Centre","parentId":"2"}]'
                );
            });
        });
    });

    describe("UserProfiles", function(){
        var callback;

        describe("when success", function(){
            var userProfiles;

            beforeEach(function() {
                callback = jasmine.createSpy("Callback");
                userProfiles = [{
                                    "users_name": "thoughwks",
                                    "uid": "146",
                                    "users_status": "0",
                                    "realname_realname": "thoughwks",
                                    "realname_uid": "146",
                                    "users_created": "1328167329"
                                },
                                {
                                    "users_name": "tester1",
                                    "uid": "29",
                                    "users_status": "0",
                                    "realname_realname": "tester1",
                                    "realname_uid": "29",
                                    "users_created": "1295869437"
                                },
                                {
                                    "users_name": "",
                                    "uid": "0",
                                    "users_status": "0",
                                    "realname_realname": "%1 %2",
                                    "realname_uid": "0",
                                    "users_created": "0"
                                }];

                spyOn(devtrac.remoteView, "get").andCallFake(function(url, successCallback, failedCallback) {
                    successCallback(userProfiles);
                });
                spyOn(devtrac.common, "logAndShowGenericError");
                spyOn(navigator.store, "put");

                devtrac.dataPull.userProfiles(callback);
            });

            it("should call new method to get remote views with correct URL", function(){
                expect(devtrac.remoteView.get.mostRecentCall.args[0]).toEqual('http://geo.devtrac.org/api/views/api_user.json?display_id=users');
            })

            it("response should be wrapped in '#data' to ensure forward compatibility", function() {
                expect(devtrac.common.logAndShowGenericError).not.toHaveBeenCalled();
            });

            it("parse user profiles correctly", function() {
                expect(navigator.store.put.mostRecentCall.args[3]).toEqual(
                    '[{"uid":"146","username":"thoughwks","name":"thoughwks"},' +
                    '{"uid":"29","username":"tester1","name":"tester1"},' +
                    '{"uid":"0","username":"","name":"%1 %2"}]'
                );
            });
        })
    })
});
