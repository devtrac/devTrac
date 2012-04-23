describe("ContactInfo", function(){

    describe("packageContactInfoData", function(){

        describe("given new contact information", function(){
            var site, data, contactInfo;

            beforeEach(function(){
                site = SiteMother.createSiteWithContactInfo("test", false, "1234", "tester", false);
                contactInfo = site.contactInfo;

                data = devtrac.common.convertHash(Site.packageContactInfoData(site));
            })

            it("should contain title", function(){
                expect(data).toMatch(new RegExp("title=" + site.name));
            })

            it("should contain type", function(){
                expect(data).toMatch(new RegExp("type=place"));
            })

            it("should contain field_place_responsible_person[und][0][value]", function(){
                expect(data).toMatch(new RegExp("field_place_responsible_person\\[und]\\[0]\\[value]=" + contactInfo.name));
            })

            it("should contain field_place_phone[und][0][value]", function(){
                expect(data).toMatch(new RegExp("field_place_phone\\[und]\\[0]\\[value]=" + contactInfo.phone));
            })

            it("should contain field_place_email[und][0][email]", function(){
                expect(data).toMatch(new RegExp("field_place_email\\[und]\\[0]\\[email]=" + contactInfo.email));
            })

            it("should contain taxonomy_vocabulary_1[und][0][tid]", function(){
                expect(data).toMatch(new RegExp("taxonomy_vocabulary_1\\[und]\\[0]=195"))
            })

            it("taxonomy_vocabulary_6[und][0][tid]", function(){
                expect(data).toMatch(new RegExp("taxonomy_vocabulary_6\\[und]\\[0]=92"))
            })
        })
    })
})
