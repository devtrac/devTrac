describe("questionController", function(){
       var questionSamples = [{
                    id:401,
                    title:"Do both the community and school have access to the water source at the health facility?",
                    type:"radios",
                    options:[{"format":null,"safe_value":"Yes","value":"Yes"},{"format":null,"safe_value":"No","value":"No"}],
                    taxonomy:[{"id":"203","name":"School"}]
                  },
                  {
                    id:"402",
                    title:"Type of water point?",
                    type:"checkboxes",
                    options:[{"format":null,"safe_value":"Protected spring","value":"Protected spring"},{"format":null,"safe_value":"Piped water scheme","value":"Piped water scheme"},{"format":null,"safe_value":"Hand pump","value":"Hand pump"}],
                    taxonomy:[{"id": "58","name": "Office"}]
                  },
                  {
                    id:"403",
                    title:"When was the last repair carried out?",
                    type:"select",
                    options:[{"value":"Less than 1 month ago","format":null,"safe_value":"Less than 1 month ago"},{"value":"1-6 months ago","format":null,"safe_value":"1-6 months ago"},{"value":"More than 6 months ago","format":null,"safe_value":"More than 6 months ago"}],
                    taxonomy:[{"id": "203","name": "School"}]
                  },
                  {
                    id:"404",
                    title:"Type of water point?",
                    type:"number",
                    taxonomy:[{"id": "1","name": "School"}]
                  }];
    describe("question display",function(){

        beforeEach(function(){
            var fixture = '<div class="content">' +
                           '<form>' +
                               '<div class="question-content">' +
                               '</div>' +
                           '</form>' +
                       '</div>';

            setFixtures("<body>"+ fixture +"</body>");
            devtrac.currentSite = SiteMother.createSite("siteForQuestion", false, false);
            var container = $('.question-content');
            container.html("");
        })

        it("only question type of current site should be attached", function(){
            spyOn(devtrac.questionsController,"checkboxQuestion").andCallFake(function(){});
            spyOn(devtrac.questionsController,"objectiveQuestion").andCallFake(function(){});
            devtrac.currentSite.type = "School";
            devtrac.questions = [];
            var question1 = questionSamples[0];
            var question2 = questionSamples[1];
            devtrac.questions.push(question1);
            devtrac.questions.push(question2);

            var container = $('.question-content');
            container.html("");
            devtrac.questionsController.show();

            expect(devtrac.questionsController.objectiveQuestion).toHaveBeenCalled();
            expect(devtrac.questionsController.checkboxQuestion).not.toHaveBeenCalled();
        })


        it("questionnaire of number type should be attaached correctly", function(){
            devtrac.currentSite.type = "School";
            devtrac.questions = [];
            var question = questionSamples[3];
            devtrac.questions.push(question);

            devtrac.questionsController.show();

            var qid = question.id;
            expect($("#"+qid)).toHaveText(question.title);
            expect($("input[type=text]").attr("class")).toEqual("" + question.id + " input numeric");
        })

        it("questionnaire of radios type should be attaached correctly", function(){
            devtrac.currentSite.type = "School";
            devtrac.questions = [];
            var question = questionSamples[0];
            devtrac.questions.push(question);

            devtrac.questionsController.show();

            var qid = question.id;
            expect($("#"+qid)).toHaveText(question.title);

            expect($("input[type=radio]").eq(0)).toHaveAttr("value", 'Yes');
            expect($("input[type=radio]").eq(1)).toHaveAttr("value", 'No');
        })

        it("questionnaire of checkboxs type should be attaached correctly", function(){
            devtrac.currentSite.type = "Office";
            devtrac.questions = [];
            var question = questionSamples[1];
            devtrac.questions.push(question);

            devtrac.questionsController.show();

            var qid = question.id;
            expect($("#"+qid)).toHaveText(question.title);
            expect($("input[name=402]").eq(0)).toHaveAttr("value", 'Protected%20spring');
            expect($("input[name=402]").eq(1)).toHaveAttr("value", 'Piped%20water%20scheme');
            expect($("input[name=402]").eq(2)).toHaveAttr("value", 'Hand%20pump');
        })

        it("questionnaire of select type should be attaached correctly", function(){
            devtrac.currentSite.type = "School";
            devtrac.questions = [];
            var question = questionSamples[2];
            devtrac.questions.push(question);

            devtrac.questionsController.show();

            var qid = question.id;
            expect($("#"+qid)).toHaveText(question.title);
            expect($("option").eq(0)).toHaveAttr("value", 'Less than 1 month ago');
            expect($("option").eq(1)).toHaveAttr("value", '1-6 months ago');
            expect($("option").eq(2)).toHaveAttr("value", 'More than 6 months ago');
        })
	})

    describe("submission saving", function(){

        beforeEach(function(){
            var fixture = '<div class="content">' +
                           '<form>' +
                               '<div class="question-content">' +
                                 '<div class="question"><label id="404">Number of schools?</label>' +
                                    '<input type="text" name="404" value="" class="404 input numeric"></input></div>'+
                                 '<div class="question"><label id="401">Do both school have access to the water sourcet?</label>' +
                                    '<input type="radio" name="401" value="Yes">Yes</input>' +
                                    '<input type="radio" name="401" value="No">No</input></div>' +
                                 '<div class="question"><label id="402">What food I like?</label>' +
                                    '<input type="checkbox" name="402" value="Noodle">Noodle</input><br />' +
                                    '<input type="checkbox" name="402" value="Chicken">Chicken</input><br />' +
                                    '<input type="checkbox" name="402" value="Rice">Rice</input><br /></div>' +
                                 '<div class="question"><label id="403">When was last repair carried out?</label>' +
                                    '<select name="403" class="403 select">' +
                                    '<option value="Less than 1 month ago">Less than 1 month ago</option>' +
                                    '<option value="1-6 months ago">1-6 months ago</option>' +
                                    '<option value="More than 6 months ago">More than 6 months ago</option></select></div>' +
                               '</div>' +
                           '</form>' +
                       '</div>';

            setFixtures("<body>"+ fixture +"</body>");

            $("input[type=text]").val("3");
            $("input[type=radio]").eq(0).attr("checked", "checked");
            $("input[name=402]").eq(1).attr("checked", "checked");
            $("input[name=402]").eq(2).attr("checked", "checked");
            $("select").selectedIndex = 1;
            devtrac.currentSite = SiteMother.createSite("siteForQuestion", false, false);
            devtrac.questionsController.save();

        })

        it("number of submission should be correct",function(){
            expect(devtrac.currentSite.submission.submissionItems.length).toEqual(4);
        })

        it("submission to number question should be saved correctly", function(){
            expect(devtrac.currentSite.submission.submissionItems[3]).toEqual({id: "404",response: "3"});
        })

        it("submission to radio question should be saved correctly", function(){
            expect(devtrac.currentSite.submission.submissionItems[2]).toEqual({id: "401",response: "Yes"});
        })

        it("submission to select question should be saved correctly", function(){
            expect(devtrac.currentSite.submission.submissionItems[0]).toEqual({id: "403",response: "Less than 1 month ago"});
        })

        it("submission to checkbox question should be saved correctly", function(){
            expect(devtrac.currentSite.submission.submissionItems[1]).toEqual({id: "402",response: "Chicken~Rice"});
        })
    })

    describe("questionFilter", function(){
        beforeEach(function(){
            offlineQuestions = [{id:101, status: "1"}, {id:102, status: "1"}];
            downloadedQuestions = [{id:102, status: "0"}, {id:103, status: "1"}];
        })

        it("questions should be filtered correctly",function(){
            var allQuestions = [];
            allQuestions = devtrac.questionsController.questionFilter(offlineQuestions, downloadedQuestions);
            expect(allQuestions).toEqual([ { id : 101, status : '1' }, { id : 103, status : '1' } ] );
        })
    })
})
