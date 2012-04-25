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
				  
     beforeEach(function(){
        var fixture = '<div class="content">' +
                           '<form>' +
                               '<div class="question-content">' +
                               '</div>' +
                           '</form>' +
                       '</div>';

        setFixtures("<body>"+ fixture +"</body>");

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
        expect($("input[name=402]").eq(0)).toHaveAttr("value", 'Protected spring');
        expect($("input[name=402]").eq(1)).toHaveAttr("value", 'Piped water scheme');
        expect($("input[name=402]").eq(2)).toHaveAttr("value", 'Hand pump');
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
