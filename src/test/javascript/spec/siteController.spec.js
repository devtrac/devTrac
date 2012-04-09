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
        spyOn(devtrac.fieldTrip.sites, "push").andCallFake(function(){});

    });

    describe('create',function(){
      it("when datevisited is invalid", function(){
         var inValidDate = "123";
         initSiteAttributes('title', inValidDate);

         siteController.create();

         expect(alert).toHaveBeenCalledWith('The date visited: ' + inValidDate + ' is invalid.');
         expect(devtrac.fieldTrip.sites.push).not.toHaveBeenCalled();
       })

      it("when datevisited is valid", function(){
         var validDate = "04/05/2012";
         initSiteAttributes('title', validDate);

         siteController.create();

         expect(devtrac.fieldTrip.sites.push).toHaveBeenCalled();
       })

       it('should be invalid when title is empty', function(){
           initSiteAttributes('','03/02/2012');

           siteController.create();

           expect(alert).toHaveBeenCalledWith('The title can not be empty.');
           expect(devtrac.fieldTrip.sites.push).not.toHaveBeenCalled();
       })

       it('should be invalid when title is black', function(){
          initSiteAttributes('    ','03/02/2012');

          siteController.create();

          expect(alert).toHaveBeenCalledWith('The title can not be empty.');
          expect(devtrac.fieldTrip.sites.push).not.toHaveBeenCalled();
       })

    it("position data should be saved to site", function(){
        spyOn(navigator.store, "put").andCallThrough();
        $("#latitude").text("Latitude: 45");
        $("#longitude").text("Longitude: 108");
        siteController.create();
        var site = devtrac.fieldTrip.sites.pop();
        expect(site.latitude).toEqual("45");
        expect(site.longitude).toEqual("108");
    })
  })

function initSiteAttributes(title, date){
    $("#site_title").val(title);
    $("#sitetypes").val("school");
    $("#dateVisited").val(date);
    }
})
