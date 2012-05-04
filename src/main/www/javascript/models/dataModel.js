function FieldTrip(){
	this.id;
    this.title;
    this.sites = [];
    this.startDate = "";
    this.endDate = "";
}

function Site(){
    this.id = "";
    this.name = "";
	this.placeId = "";
	this.placeName = "";
	this.placeGeo = "";
	this.placeTaxonomy = [];
    this.type = "";
    this.placeNid = "";
    this.offline = false;
    this.complete = false;
	this.narrative = "";
    this.dateVisited = "";
    this.contactInfo = {
        name: "",
        phone: "",
        email: "",
        uploaded: true
    };
    this.submission = {
        submissionItems:[],
        uploaded: true
    };
    this.photos = {};
    this.actionItems = [];
    this.historyAssignedToMeActionItems = [];
    this.historyNotAssignedToMeActionItems = [];

    this.uploaded = true;
}

Site.updateURL = function(site){
    return DT_D7.NODE_SAVE.replace('<NODE_ID>', site.id);
}

Site.createURL = function(){
    return DT_D7.NODE_CREATE;
}

Site.setDateVisited = function(site, dateString){
    var year = dateString.substring(0,4);
    var month = dateString.substring(5,7);
    var day = dateString.substring(8,10);
    site.dateVisited = day+ "/" + month + "/" + year;
}

Site.packageData = function(site, fieldTripId) {
    var data = {
        "title": site.name,
        "type": DT_D7.NODE_TYPE.SITE,
        "field_ftritem_narrative[und][0][value]" : site.narrative,
        "field_ftritem_public_summary[und][0][value]" : site.narrative,
        "field_ftritem_date_visited[und][0][value][date]" : site.dateVisited,
        "field_ftritem_place[und][0][target_id]": site.placeNid,
        "language": "und"
    };
    if (site.offline) {
        if (site.placeGeo != "") {
            data["field_ftritem_lat_long[und][0][wkt]"] = site.placeGeo;
        }
        data["field_ftritem_field_trip[und][0][target_id]"] = fieldTripId;
    }
    return data;
}

Site.packageContactInfoData = function(site){
    var placeId = site.offline ? 0 : site.placeId;
    var contactInfo = site.contactInfo;
    var data = {
        'title': site.name,
        'type': 'place',
        'nid': placeId,
        'field_place_responsible_person[und][0][value]': contactInfo.name,
        'field_place_phone[und][0][value]': contactInfo.phone,
        'field_place_email[und][0][email]': contactInfo.email,
        'taxonomy_vocabulary_1[und][0]': devtrac.common.findPlaceType(site),
        'taxonomy_vocabulary_6[und][0]': 92
    }
    return data;
}


Site.packageSubmission = function(siteId, placeId, submissionItems){

    var generateAnswerItems = function(submissionItems){
        var answersData ="{"
        for (var index in submissionItems) {
            var answerData = "";
            var item = submissionItems[index];
            var type = devtrac.common.getQuestionTypeById(item.id);
            if(type =="undefined")return;
            if (type == "checkboxes") {
                var response = item.response.split("~");
                answerData += '"' + item.id + '":{';
                for (var i in response) {
                    answerData += '"' + unescape(response[i]) + '":"' + unescape(response[i]) + '",'
                }
                answerData = answerData.substring(0, answerData.length - 1);
                answerData += "},";
            }
            else {
                var answerKey = type == "number" ? item.response : '"' + item.response + '"';
                answerData += '"' + item.id + '"'+ ":" + answerKey + ',';
            }
        answersData+=answerData;
        }
        answersData = answersData.substring(0, answersData.length-1)
        answersData += "}";
        return answersData;
    }

    var dataString = '{'
                     + '"qnid":' + siteId + ','
                     + '"contextnid":' + placeId + ','
                     + '"answers":' + generateAnswerItems(submissionItems)
                     + '}'
    return dataString;
}

function PlaceTaxonomy(){
	this.id = "";
	this.name = "";
}

function SubmissionItem(){
	this.id = "";
	this.response = "";
}

function PlaceType(){
	this.id = "";
	this.name = "";
	this.parentId = "";
}

function Question(){
    this.id = "";
    this.title = "";
    this.type = "";
    this.options = "";
	this.taxonomy = [];
}

function QuestionTaxonomy(){
	this.id = "";
    this.name = "";
}

function ActionItem(){
	this.id = "";
    this.title = "";
	this.task = "";
    this.assignedTo = "";
    this.status = "1";
    this.uploaded = false;
    this.uid = "";
}

ActionItem.packageData = function(item, siteID, placeID){
	var data = {
		"title": item.title,
		"type": DT_D7.NODE_TYPE.ACTIONITEM,
		"field_actionitem_ftreportitem[und][0][target_id]": siteID,
		"field_actionitem_resp_place[und][0][target_id]": placeID,
		"field_actionitem_due_date[und][0][value][date]": devtrac.common.getOneMonthLaterDate(),
		"field_actionitem_responsible[und][0][target_id]": item.assignedTo + " (" + UserProfile.getUserIDbyUserName(item.assignedTo) + ")",
		"field_actionitem_followuptask[und][0][value]": item.task,
		"language": "und"
	}
	return data;
}

function UserProfile(){
	this.uid = "";
	this.username = "";
	this.name = "";
}

UserProfile.getUserIDbyUserName = function(username) {
    for(var i in devtrac.profiles){
        if(devtrac.profiles[i].username == username)
          return devtrac.profiles[i].uid;
    }
    return 0;
}
