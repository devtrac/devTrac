describe("ActionItem", function() {

    describe("packageData", function() {

        describe("given new action item", function() {
            var item;
            var title = "Test packaging action item";
            var siteID = 6666;
            var placeID = 1276;
            var task = "task for test";
            var dueDate = devtrac.common.getOneMonthLaterDate();
            var data;
            var username = "tester2";
            var userid = 32;

            beforeEach(function() {
                devtrac.profiles = [];

                var profile = new UserProfile();
                profile.uid = userid;
                profile.username = username;
                profile.name = 'Test Account 2';
                devtrac.profiles.push(profile);

                item = new ActionItem();
                item.title = title;
                item.assignedTo = username;
                item.task = task;
                data = devtrac.common.convertHash(ActionItem.packageData(item, siteID, placeID));
            })

            it("node type should be 'actionitem'", function() {
                expect(data).toMatch(new RegExp("type=actionitem&"));
            })

            it("contains title", function() {
                expect(data).toMatch(new RegExp("title=" + title + "&"));
            })

            it("should be linked to a site", function() {
                expect(data).toMatch(new RegExp("field_actionitem_ftreportitem\\[und\\]\\[0\\]\\[target_id\\]=" + siteID + "&"));
            })

            it("should be linked to a place", function() {
                expect(data).toMatch(new RegExp("field_actionitem_resp_place\\[und\\]\\[0\\]\\[target_id\\]=" + placeID + "&"));
            })

            it("contains a due date", function() {
                expect(data).toMatch(new RegExp("field_actionitem_due_date\\[und\\]\\[0\\]\\[value\\]\\[date\\]=" + dueDate + "&"));
            })

            it("contains an assigned string", function() {
                expect(data).toMatch(new RegExp("field_actionitem_responsible\\[und\\]\\[0\\]\\[target_id\\]=" + username + " \\(" + userid + "\\)" + "&"));
            })

            it("contains a followuptask", function() {
                expect(data).toMatch(new RegExp("field_actionitem_followuptask\\[und\\]\\[0\\]\\[value\\]=" + task + "&"));
            })


            it("language should be undefined (und)", function() {
                expect(data).toMatch(new RegExp("language=und&"));
            })
        })
    })
})
