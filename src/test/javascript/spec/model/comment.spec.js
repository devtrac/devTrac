describe("Comment", function(){
    describe("packageCommentData", function(){
            var item, data, comment;

            beforeEach(function(){
                item = {id:6950, status:1};
                comment = {subject:"subject for package test"};

                data = devtrac.common.convertHash(Comment.packageData(item, comment));
            })

            it("should contain node_type", function(){
                expect(data).toMatch(new RegExp("node_type=comment_node_actionitem"));
            })

            it("should contain nid", function(){
                expect(data).toMatch(new RegExp("nid=" + item.id));
            })

            it("should contain language", function(){
                expect(data).toMatch(new RegExp("language=und"));
            })

            it("should contain comment_body[und][0][format]", function(){
                expect(data).toMatch(new RegExp("comment_body\\[und]\\[0]\\[format]=1"));
            })

            it("should contain comment_body[und][0][value]", function(){
                expect(data).toMatch(new RegExp("comment_body\\[und]\\[0]\\[value]=" + comment.subject));
            })

            it("taxonomy_vocabulary_8[und][0]", function(){
                expect(data).toMatch(new RegExp("taxonomy_vocabulary_8\\[und]\\[0]=" + "221"));
            })

            it("should contain field_actionitem_status[und][0]", function(){
                expect(data).toMatch(new RegExp("field_actionitem_status\\[und]\\[0]=" + item.status));
            })
    })
})