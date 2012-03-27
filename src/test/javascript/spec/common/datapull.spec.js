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

    describe("actionItemDetailsForSite", function(){
        var callback;

        describe("when success", function(){
            var actionItems = [];
            var siteID = 0;

            beforeEach(function() {
                actionItems = [{
                                "vid": "590",
                                "uid": "11",
                                "title": "Improve Supervision and Support",
                                "log": "",
                                "status": "1",
                                "comment": "2",
                                "promote": "0",
                                "sticky": "0",
                                "nid": "590",
                                "type": "actionitem",
                                "language": "und",
                                "created": "1300949564",
                                "changed": "1300949564",
                                "tnid": "0",
                                "translate": "0",
                                "revision_timestamp": "1300949564",
                                "revision_uid": "11",
                                "taxonomy_vocabulary_8": [
                                ],
                                "field_actionitem_due_date": {
                                  "und": [
                                    {
                                      "value": "2011-03-24T00:00:00",
                                      "timezone": "Africa\/Kampala",
                                      "timezone_db": "Africa\/Kampala",
                                      "date_type": "date"
                                    }
                                  ]
                                },
                                "field_actionitem_followuptask": {
                                  "und": [
                                    {
                                      "value": "Follow up with in-charge to make sure OTP is better managed.  Follow up with DHT to ensure better supervision.",
                                      "format": null
                                    }
                                  ]
                                },
                                "field_actionitem_severity": {
                                  "und": [
                                    {
                                      "value": "2"
                                    }
                                  ]
                                },
                                "field_actionitem_status": {
                                  "und": [
                                    {
                                      "value": "1"
                                    }
                                  ]
                                },
                                "field_actionitem_ftreportitem": {
                                  "und": [
                                    {
                                      "target_id": "587",
                                      "target_type": "node"
                                    }
                                  ]
                                },
                                "field_actionitem_resp_place": {
                                  "und": [
                                    {
                                      "target_id": "586",
                                      "target_type": "node"
                                    }
                                  ]
                                },
                                "field_actionitem_responsible": {
                                  "und": [
                                    {
                                      "target_id": "72",
                                      "target_type": "user"
                                    }
                                  ]
                                },
                                "cid": "0",
                                "last_comment_timestamp": "1300973910",
                                "last_comment_name": "",
                                "last_comment_uid": "72",
                                "comment_count": "1",
                                "name": "Sean Blaschke",
                                "picture": "0",
                                "data": "a:6:{s:13:\"form_build_id\";s:37:\"form-59e71a1b413fb05d207e8ed5c1db4c31\";s:7:\"contact\";i:1;s:14:\"picture_delete\";i:0;s:14:\"picture_upload\";s:0:\"\";s:5:\"piwik\";a:1:{s:16:\"piwik_token_auth\";s:9:\"anonymous\";}s:29:\"taxonomy_image_disable_images\";i:0;}"
                              },
                              {
                                "vid": "591",
                                "uid": "8",
                                "title": "Check the site for solar power possibilities",
                                "log": "",
                                "status": "1",
                                "comment": "2",
                                "promote": "0",
                                "sticky": "0",
                                "nid": "591",
                                "type": "actionitem",
                                "language": "und",
                                "created": "1300949669",
                                "changed": "1307436711",
                                "tnid": "0",
                                "translate": "0",
                                "revision_timestamp": "1307436711",
                                "revision_uid": "8",
                                "taxonomy_vocabulary_8": [],
                                "field_actionitem_due_date": {
                                  "und": [
                                    {
                                      "value": "2011-07-01T00:00:00",
                                      "timezone": "Africa\/Kampala",
                                      "timezone_db": "Africa\/Kampala",
                                      "date_type": "date"
                                    }
                                  ]
                                },
                                "field_actionitem_followuptask": {
                                  "und": [
                                    {
                                      "value": "Ask Seth to visit site and assess",
                                      "format": "1",
                                      "safe_value": "<p>Ask Seth to visit site and assess<\/p>\n"
                                    }
                                  ]
                                },
                                "field_actionitem_severity": {
                                  "und": [
                                    {
                                      "value": "3"
                                    }
                                  ]
                                },
                                "field_actionitem_status": {
                                  "und": [
                                    {
                                      "value": "3"
                                    }
                                  ]
                                },
                                "field_actionitem_ftreportitem": {
                                  "und": [
                                    {
                                      "target_id": "582",
                                      "target_type": "node"
                                    }
                                  ]
                                },
                                "field_actionitem_resp_place": {
                                  "und": [
                                    {
                                      "target_id": "581",
                                      "target_type": "node"
                                    }
                                  ]
                                },
                                "field_actionitem_responsible": {
                                  "und": [
                                    {
                                      "target_id": "8",
                                      "target_type": "user"
                                    },
                                    {
                                      "target_id": "11",
                                      "target_type": "user"
                                    }
                                  ]
                                },
                                "cid": "0",
                                "last_comment_timestamp": "1300973359",
                                "last_comment_name": "",
                                "last_comment_uid": "58",
                                "comment_count": "1",
                                "name": "terraw",
                                "picture": "0",
                                "data": "a:5:{s:13:\"form_build_id\";s:37:\"form-1050f68a726df9c11f0702f838f43047\";s:14:\"picture_delete\";s:0:\"\";s:14:\"picture_upload\";s:0:\"\";s:29:\"taxonomy_image_disable_images\";i:0;s:7:\"contact\";i:1;}"
                              }];

                siteID = 582;
                devtrac.dataPull.sitesForActionItems = [{"id" : siteID}];
                devtrac.dataPull.fieldTrip.sites = [{"id" : siteID}];

                callback = jasmine.createSpy("Callback");
                spyOn(devtrac.remoteView, "get").andCallFake(function(url, successCallback, failedCallback) {
                    successCallback(actionItems);
                });
                spyOn(devtrac.common, "logAndShowGenericError");

                devtrac.dataPull.actionItemDetailsForSite(callback);
            });

            it("should call new method to get remote views with correct URL", function(){
                expect(devtrac.remoteView.get.mostRecentCall.args[0]).toEqual('http://geo.devtrac.org/api/views/api_fieldtrips.json?display_id=actionitems&args[nid]=' + siteID);
            })

            it("response should be wrapped in '#data' to ensure forward compatibility", function() {
                expect(devtrac.common.logAndShowGenericError).not.toHaveBeenCalled();
            });

            it("parse action items for site correctly", function() {
                expect(devtrac.dataPull.fieldTrip.sites[0].actionItems).toEqual(
                    [{
                        "id": "590",
                        "title": "Improve Supervision and Support",
                        "task": "Follow up with in-charge to make sure OTP is better managed.  Follow up with DHT to ensure better supervision.",
                        "assignedTo": "72"
                     },
                     {
                        "id": "591",
                        "title": "Check the site for solar power possibilities",
                        "task": "Ask Seth to visit site and assess",
                        "assignedTo": "8, 11"
                     }]
                )
            })
        })
    })
});
