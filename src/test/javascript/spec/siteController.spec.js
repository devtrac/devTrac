describe("SiteController", function(){
    beforeEach(function(){
        var fixture = '<div id="add_trip">' +
                    '<h2>Add New Site</h2>' +
                    '<p>' +
                        '<label>' +
                            'Site Name' +
                        '</label>' +
                        '<input type="text" name="site_title" id="site_title" class="input" value="" size="20" tabindex="10"/><span class="tip">(example: Toro health center, Acwera water point)</span>' +
                    '</p>' +
                    '<p>' +
                        '<label>' +
                            'Site Type' +
                        '</label>' +
                        '<select id="sitetypes" class="select" name="sitetypes">' +
                        '</select>' +
                    '</p>' +

                    '<p>' +
                       '<label>' +
                            'Visited Date(DD/MM/YYYY):' +
                       '</label>' +
                      '<input id="dateVisited" type="text"/>' +
                    '</p>' +
                    '<p>' +
                        '<fieldset>' +
                        '<legend> Location Info </legend>' +
                        '<p>' +
                            '<input type="button" name="capture" id="capture_gps_button" class="button" value="Capture GPS"/>' +
                            '<label id="latitude">' +
                                'Latitude: 30' +
                            '</label>' +
                            '<label id="longitude">' +
                                'Longitude: 110' +
                            '</label>' +
                        '</p>' +
                        '</fieldset>' +
                    '</p>' +
                    '<p class="submit">' +
                        '<input type="submit" name="type-submit" id="add_site_button" class="button" value="Add" tabindex="100"/>' +
                    '</p>' +
                '</div> ';

        setFixtures("<body>"+ fixture +"</body>");
        spyOn(window, "alert").andCallFake(function(){});
    });

    describe('create',function(){
        beforeEach(function(){
            devtrac.fieldTrip.startDate = "2012-02-13T00:00:00";
            devtrac.fieldTrip.endDate = "2012-02-15T00:00:00";
            spyOn(devtrac.fieldTrip.sites, "push").andCallThrough();
        })
        it("when datevisited has invalid format", function(){
            var inValidDate = "123";
            initSiteAttributes('title', inValidDate);

            siteController.create();

            expect(alert).toHaveBeenCalledWith('The date visited: ' + inValidDate + ' is invalid.');
            expect(devtrac.fieldTrip.sites.push).not.toHaveBeenCalled();
        })

        it("when datevisited has valid format", function(){
            var validDate = "14/02/2012";
            initSiteAttributes('title', validDate);

            siteController.create();

            expect(devtrac.fieldTrip.sites.push).toHaveBeenCalled();
        })

        it('when datevisited is outranged', function(){
            var outRangerdDate = "18/02/2012";
            initSiteAttributes('title', outRangerdDate);

            siteController.create();

            expect(alert).toHaveBeenCalledWith('The date visited should between: 13/02/2012 and 15/02/2012');
            expect(devtrac.fieldTrip.sites.push).not.toHaveBeenCalled();
        })

        it('should be invalid when title is empty', function(){
            initSiteAttributes('','14/02/2012');

            siteController.create();

            expect(alert).toHaveBeenCalledWith('The title can not be empty.');
            expect(devtrac.fieldTrip.sites.push).not.toHaveBeenCalled();
        })

        it('should be invalid when title is blank', function(){
            initSiteAttributes('    ','14/02/2012');

            siteController.create();

            expect(alert).toHaveBeenCalledWith('The title can not be empty.');
            expect(devtrac.fieldTrip.sites.push).not.toHaveBeenCalled();
        })

    })

    describe("Create a new site", function(){
        it("position data should be saved to site", function(){
            spyOn(navigator.store, "put").andCallThrough();
            initSiteAttributes('title', '14/02/2012');
            $("#latitude").text("Latitude: 45");
            $("#longitude").text("Longitude: 108");
            siteController.create();
            var site = devtrac.fieldTrip.sites.pop();
            expect(site.placeGeo).toEqual("POINT (45 108)");
        })
    })

    function initSiteAttributes(title, date){
        $("#site_title").val(title);
        $("#sitetypes").val("school");
        $("#dateVisited").val(date);
    }
})
