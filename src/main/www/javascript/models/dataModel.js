function FieldTrip(){
	this.id;
    this.title;
    this.sites = [];
}

function Site(){
    this.id = "";
    this.name = "";
	this.placeId = "";
	this.placeName = "";
	this.placeGeo = "";
	this.placeTaxonomy = [];
    this.type = DT_D7.NODE_TYPE.SITE;
    this.offline = false;
    this.complete = false;
	this.narrative = "";
    this.dateVisited = "";
    this.contactInfo = {
        name: "",
        phone: "",
        email: ""
    };
    this.submission = [];
    this.photos = {};
    this.actionItems = [];
    this.historyAssignedToMeActionItems = [];
    this.historyNotAssignedToMeActionItems = [];

    this.uploaded = true;
}

Site.prototype.updateURL = function(){
    return DT_D7.NODE_SAVE.replace('<NODE_ID>', this.id);
}

Site.prototype.package = function(user) {
    var data = "";
    data += "nid=" + this.id + "&";
    data += "title=" + this.name + "&";
    data += "uid=" + user.uid + "&";
    data += "name=" + user.name + "&";
    data += "type=" + this.type + "&";
    data += "field_ftritem_narrative[und][0][value]=" + this.narrative + "&";
    data += "field_ftritem_summary[und][0][value]=" + this.narrative + "&";
    data += "field_ftritem_date_visited[und][0][value][date]=" + this.dateVisited + "&";
    return data;
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
}

function UserProfile(){
	this.uid = "";
	this.username = "";
	this.name = "";
}
