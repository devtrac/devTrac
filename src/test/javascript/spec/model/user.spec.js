describe('user',function(){
    describe('parseUserData',function(){
        it('should parse correct',function(){
            var user = new User();
            var response = {user:{name:'tester2',mail:'tester2@unicef.org',uid:'32'},sessid:'thisisasessionid'};
            user.parseUserData(response);

            expect(user.name).toEqual('tester2');
            expect(user.email).toEqual('tester2@unicef.org');
            expect(user.uid).toEqual('32');
            expect(user.session.id).toEqual('thisisasessionid');
        })
    })
})
