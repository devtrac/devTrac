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

    });
})
