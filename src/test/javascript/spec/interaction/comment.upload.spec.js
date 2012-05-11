describe("CommentUpload",function(){
    var progressCallback;
    var successCallback;
    var errorCallback;
    var actionItem;
    var comments;
    describe("uploadMultiple",function(){
        beforeEach(function(){
            progressCallback = jasmine.createSpy('progressCallback');
            successCallback = jasmine.createSpy('successCallback');
            errorCallback = jasmine.createSpy('errorCallback');

            actionItem = {id:101, status:"1"};
            comments = [{subject:"subject1"}, {subject:"subject2"}];
        })

        it("should use POST to upload", function() {
            spyOn(devtrac.common, "callServicePost").andCallFake(function(url, postData, callback, errorCallback) {
                callback({});
            });

            devtrac.commentUpload.uploadMultiple(comments, actionItem, progressCallback, successCallback, errorCallback);

            expect(devtrac.common.callServicePost.callCount).toEqual(2);
        })

        it("should send correct data", function() {
            spyOn(navigator.network, "XHR").andCallFake(function(cookie, method, URL, POSTdata, contentType, successCallback, errorCallback) {
                successCallback({});
            });

            devtrac.commentUpload.uploadMultiple(comments, actionItem, progressCallback, successCallback, errorCallback);

            var expectedPostData = 'node_type=comment_node_actionitem&nid=101'
                + '&language=und&comment_body[und][0][format]=1'
                + '&comment_body[und][0][value]=subject2&taxonomy_vocabulary_8[und][0]=221'
                + '&field_actionitem_status[und][0]=1&';

            expect(navigator.network.XHR.mostRecentCall.args[3]).toEqual(expectedPostData);
        })
    })

    describe("update the 'uploaded' attribute", function(){
        beforeEach(function() {
            progressCallback = jasmine.createSpy('progressCallback');
            successCallback = jasmine.createSpy('successCallback');
            errorCallback = jasmine.createSpy('errorCallback');

            actionItem = {id:101, status:"1"};
            comments = [{subject:"subject1"}, {subject:"subject2"}];
        })

        it("to 'true' when uploaded successfully", function(){
            spyOn(navigator.network, "XHR").andCallFake(function(cookie, method, URL, POSTdata, contentType, successCallback, errorCallback) {
                successCallback({});
            });

            devtrac.commentUpload.uploadMultiple(comments, actionItem, progressCallback, successCallback, errorCallback);

            expect(comments[0].uploaded).toBeTruthy();
        })

        it("to 'false' when uploaded failed", function(){
            spyOn(navigator.network, "XHR").andCallFake(function(cookie, method, URL, POSTdata, contentType,successCallback, errorCallback) {
                errorCallback({error:true,message:'Bad server response.',httpcode:406});
            });

            devtrac.commentUpload.uploadMultiple(comments, actionItem, progressCallback, successCallback, errorCallback);

            expect(comments[0].uploaded).toBeFalsy();
        })
    })

})
