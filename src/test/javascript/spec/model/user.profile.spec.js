describe("UserProfile", function() {

    describe("getUserIDbyUserName", function() {

        it("return user id", function() {
            devtrac.profiles = [];

            var profile = new UserProfile();
            profile.uid = 32;
            profile.username = 'tester2';
            profile.name = 'Test Account 2';
            devtrac.profiles.push(profile);

            profile = new UserProfile();
            profile.uid = 8;
            profile.username = 'tester1';
            profile.name = 'Test Account 1';
            devtrac.profiles.push(profile);

            expect(UserProfile.getUserIDbyUserName('tester2')).toEqual(32);
        })
    })
})
