describe("SettingsController", function(){

    describe("show", function(){

        beforeEach(function(){
            setFixtures(
                '<body>' +
                    '<p>' +
                        '<input type="button" id="update_question_places" class="button" value="Download Database"/>' +
                    '</p>' +
                    '<p>' +
                        '<input type="button" id="wipe_out_data" class="button" value="DELETE Data"/>' +
                    '</p>' +
                    '<p>' +
                        '<input type="button" id="show_log" class="button" value="Show Log"/>' +
                    '</p>' +
                    '<p>' +
                        '<input type="checkbox" value="on" id="log_debug_mode" /><span>Debug Mode</span>' +
                    '</p>' +
                    '<p id="config_endpoint">' +
                        '<input type="text" name="end_point" id="end_point" class="input" value="" size="20" tabindex="10"/>' +
                        '<input type="submit" name="type-submit" id="set_endpoint" class="button" value="Set" tabindex="100"/>' +
                    '</p>'+
                '</body>'
            );
        })

        describe("When user logged in", function(){
 +
            beforeEach(function(){
                devtrac.user.loggedIn = true;
                devtrac.settingsController.show();
            })

            it("'Download Database' should be shown", function(){
                expect($('#update_question_places')).toBeVisible();
            })

            it("'DELETE Data' should be shown", function(){
                expect($('#wipe_out_data')).toBeVisible();
            })

            it("'Show Log' should be shown", function(){
                expect($('#show_log')).toBeVisible();
            })

            it("'Debug Mode' should be shown", function(){
                expect($('#log_debug_mode')).toBeVisible();
            })

            it("'Config end point' should be hidden", function(){
                expect($('#config_endpoint')).toBeHidden();
            })
        })

        describe("When user NOT logged in", function(){

            beforeEach(function(){
                devtrac.user.loggedIn = false;
                devtrac.settingsController.show();
            })

            it("'Download Database' should be hidden", function(){
                expect($('#update_question_places')).toBeHidden();
            })

            it("'DELETE Data' should be hidden", function(){
                expect($('#wipe_out_data')).toBeHidden();
            })

            it("'Show Log' should be shown", function(){
                expect($('#show_log')).toBeVisible();
            })

            it("'Debug Mode' should be shown", function(){
                expect($('#log_debug_mode')).toBeVisible();
            })

            it("'Config end point' should be shown", function(){
                expect($('#config_endpoint')).toBeVisible();
            })
        })

        describe("When user logged in AGAIN", function(){

            beforeEach(function(){
                devtrac.user.loggedIn = false;
                devtrac.settingsController.show();
                devtrac.user.loggedIn = true;
                devtrac.settingsController.show();
            })

            it("'Download Database' should be shown AGAIN", function(){
                expect($('#update_question_places')).toBeVisible();
            })

            it("'DELETE Data' should be shown AGAIN", function(){
                expect($('#wipe_out_data')).toBeVisible();
            })
        })

        describe("when user want to change endpoint", function(){

            it("set end point", function(){
                $("#end_point").val("test1.com");
                devtrac.settingsController.setEndPoint();
                expect(DT_SERVER_ENDPOINT.HOST).toEqual("test1.com");
            })
        })
    })
})

