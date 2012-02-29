function QuestionsController(){
    this.questions = [];
    this.answers = [];
}

QuestionsController.prototype.show = function(){
    navigator.log.debug("Showing questions.");
	screens.show("loading");
	var container = $('.question-content');
    container.html("");
    devtrac.questionsController.answers = [];
    devtrac.questionsController.questions = $.map(devtrac.questions, function(q){
        var taxonomyName = q.taxonomy[0].name;
        if (devtrac.currentSite.type == taxonomyName) {
            return q;
        }
    });
    $.each(devtrac.questionsController.questions, function(index, q){
        var questionHtml = "";
        switch (q.type) {
            case "0":
                questionHtml = devtrac.questionsController.listQuestion(q);
                break;
            case "1":
                questionHtml = devtrac.questionsController.checkboxQuestion(q);
                break;
            case "2":
                questionHtml = devtrac.questionsController.objectiveQuestion(q);
                break;
            case "3":
                questionHtml = devtrac.questionsController.numericQuestion(q);
                break;
            default:
                devtrac.common.logAndShowGenericError("Unknown Question Type: " + q.type);
        }
        container.append(questionHtml);
    });
    devtrac.questionsController.attachValidations();
    devtrac.questionsController.populateResponse();
    screens.show("questions_form");
	navigator.log.debug("Displayed questions.");
}

QuestionsController.prototype.listQuestion = function(q){
    var html = "<div class='question'><label id='" + q.id + "'>" + q.title + "</label><select name='" + q.id + "' class='" + q.id + " select'>";
    var options = q.options.split("\r\n");
    $.each(options, function(index){
        var item = options[index];
        html += "<option value='" + item + "'>" + item + "</option>";
    });
    html += "</select></div>";
    return html;
}

QuestionsController.prototype.checkboxQuestion = function(q){
    var html = "<div class='question'><label>" + q.title + "</label>";
    var options = q.options.split("\r\n");
    $.each(options, function(index, item){
        html += "<input type='checkbox' id=" + q.id + "_" + index + " name=" + q.id + " value='" + escape(item) + "'/><label>" + item + "</label>";
    });
    html += "</div>";
    return html;
}

QuestionsController.prototype.objectiveQuestion = function(q){
    var html = "<div class='question'><label id='" + q.id + "'>" + q.title + "</label>";
    var options = q.options.split("\r\n");
    $.each(options, function(index){
        var item = options[index];
        html += "<input type='radio' name='" + q.id + "' value='" + item + "'>" + item + "</input>";
    });
    html += "</div>";
    return html;
}

QuestionsController.prototype.numericQuestion = function(q){
    var html = "<div class='question'><label id='" + q.id + "'>" + q.title + "</label>";
    html += "<input type='text' name='" + q.id + "' value='' class='" + q.id + " input numeric'></input>";
    html += "</div>";
    return html;
}

QuestionsController.prototype.save = function(){
    devtrac.questionsController.collectListAnswers();
    devtrac.questionsController.collectCheckboxAnswers();
    devtrac.questionsController.collectRadioAnswers();
    devtrac.questionsController.collectTextAnswers();
    devtrac.currentSite.submission = devtrac.questionsController.answers;
    devtrac.questionsController.markProgress();

    devtrac.currentSite.uploaded = false;
    devtrac.dataStore.saveCurrentSite(function(){
        alert("Your response is saved.");
        devtrac.siteDetailController.show();
    });
}
QuestionsController.prototype.markProgress = function(){
    if (devtrac.questionsController.questions.length == devtrac.questionsController.answers.length) {
        devtrac.currentSite.complete = true;
        return;
    }
    devtrac.currentSite.complete = false;
}

QuestionsController.prototype.collectListAnswers = function(){
    $("form :selected").each(function(){
        var answer = new SubmissionItem();
        answer.id = $(this).parent().attr("name");
        answer.response = $(this).val();
        devtrac.questionsController.answers.push(answer);
    });
}

QuestionsController.prototype.collectCheckboxAnswers = function(){
    var items = {};
    $("form input:checkbox").each(function(){
        var itemId = $(this).attr("name");
        var itemCollection = items[itemId];
        if (!itemCollection) {
            itemCollection = [];
        }
        if ($(this).attr("checked")) {
            itemCollection.push($(this).val());
            items[itemId] = itemCollection;
        }
        
    });
    $.each(items, function(index, item){
        var answer = new SubmissionItem();
        answer.id = index;
        answer.response = item.join("~");
        devtrac.questionsController.answers.push(answer);
    });
}


QuestionsController.prototype.collectRadioAnswers = function(){
    $("form :radio").each(function(){
        var answer = new SubmissionItem();
        answer.id = $(this).attr("name");
        answer.response = $(this).val();
        if ($(this).attr("checked")) {
            devtrac.questionsController.answers.push(answer);
        }
    });
}

QuestionsController.prototype.collectTextAnswers = function(){
    $("form input:text").each(function(){
        var answer = new SubmissionItem();
        answer.id = $(this).attr("name");
        answer.response = $(this).val();
        if (answer.response) {
            devtrac.questionsController.answers.push(answer);
        }
    });
}

QuestionsController.prototype.responseFor = function(id){
    for (var index in devtrac.currentSite.submission) {
        var answer = devtrac.currentSite.submission[index];
        if (answer.id == id) {
            return answer.response;
        }
    }
    return;
}

QuestionsController.prototype.populateResponse = function(){
    for (var index in devtrac.currentSite.submission) {
        var answer = devtrac.currentSite.submission[index];
        var textboxes = $(":text[name='" + answer.id + "']");
        if (textboxes.length > 0) {
            textboxes.val(answer.response);
        }
        var radios = $(":radio[name='" + answer.id + "']");
        if (radios.length > 0) {
            radios.val([answer.response]);
        }
        var checkboxes = $(":checkbox[name='" + answer.id + "']");
        if (checkboxes.length > 0) {
			checkboxes.val(answer.response.split("~"));
        }
        var elements = $("select[name='" + answer.id + "']");
        if (elements.length == 1) {
            var options = elements.children();
            options.each(function(i){
                var option = $(options[i]);
                if (option.attr("value") == answer.response) {
                    option.attr("selected", "selected");
                }
            });
        }
    }
}

QuestionsController.prototype.attachValidations = function(){
    $(".numeric").change(function(){
        var numbers = /^\d*$/;
        var element = $(this);
        if (numbers.test(element.val())) {
            return;
        }
        alert("Only numeric values are accepted.");
        element.val("");
    });
}
