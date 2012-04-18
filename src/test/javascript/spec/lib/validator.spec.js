describe('validator', function(){
    describe('isValidDate', function(){
        describe('should pass validation', function(){
            it('date dd/mm/yyyy should be valid', function(){
                expect(Validator.isValidDate('04/06/2012')).toBe(true);
            })

            it('date 29/02/2012 should be valid', function(){
                expect(Validator.isValidDate('29/02/2012')).toBe(true);
            })

        })
        describe('should not pass validation', function(){
            it('date dd-mm-yyyy should be invalid', function(){
                expect(Validator.isValidDate('04-06-2012')).toBe(false);
            })

            it('date 29/02/2011 should be invalid', function(){
                expect(Validator.isValidDate('29/02/2011')).toBe(false);
            })
        })
    })

    describe('return string for a date', function(){
        it("date should be transformed to dd/mm/yyyy", function(){
            expect(Validator.dateToString(new Date(2012, 1, 7))).toEqual("07/02/2012");
        })
    })
})
