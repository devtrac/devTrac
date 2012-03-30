describe("Site", function() {

    describe("packageData", function() {

        describe("given an existing site without image", function() {
            var site;
            var user;
            var siteId = 303;
            var siteTitle = "Visit to Jasmine";
            var siteNarrative = "This is testing site.";
            var siteDateVisited = "2011-03-24T00:00:00";

            beforeEach(function() {
                site = new Site();
                site.id = siteId;
                site.name = siteTitle;
                site.narrative = siteNarrative;
                site.dateVisited = siteDateVisited;

                user = new User();
                user.uid = 32;
                user.name = "tester2";
            })

            it("site id should be packaged as nid=xxx&", function() {
                expect(site.package(user)).toMatch(new RegExp("nid=" + siteId + "&"));
            })

            it("site title should be packaged as title=xxx&", function() {
                expect(site.package(user)).toMatch(new RegExp("title=" + siteTitle + "&"));
            })

            it("user id should be packaged as uid=xxx&", function() {
                expect(site.package(user)).toMatch(new RegExp("uid=" + user.uid + "&"));
            })

            it("user name should be packaged as name=xxx&", function() {
                expect(site.package(user)).toMatch(new RegExp("name=" + user.name + "&"));
            })

            it("type should be packaged as type=ftritem&", function() {
                expect(site.package(user)).toMatch(new RegExp("type=" + DT_D7.NODE_TYPE.SITE + "&"));
            })

            it("narrative should be packaged as field_ftritem_narrative[und][0][value]=xxx&", function() {
                expect(site.package(user)).toMatch(new RegExp("field_ftritem_narrative\\[und\\]\\[0\\]\\[value\\]=" + siteNarrative + "&"));
            })

            it("summary should be packaged as field_ftritem_public_summary[und][0][value]=xxx&", function() {
                expect(site.package(user)).toMatch(new RegExp("field_ftritem_summary\\[und\\]\\[0\\]\\[value\\]=" + siteNarrative + "&"));
                expect(site.package(user)).toMatch(new RegExp("field_ftritem_summary\\[und\\]\\[0\\]\\[value\\]=" + siteNarrative + "&"));
            })

            it("date visited should be packaged as field_ftritem_date_visited[und][0][value][date]=xxx&", function() {
                expect(site.package(user)).toMatch(new RegExp("field_ftritem_date_visited\\[und\\]\\[0\\]\\[value\\]\\[date\\]=" + siteDateVisited + "&"));
            })

        })
    })

    describe("updateURL", function() {
        it("should contain its own site ID", function() {
            var site = new Site();
            site.id = 303;
            expect(site.updateURL()).toEqual('http://devtracd7.mountbatten.net/api/node/303.json');
        })
    })
})
