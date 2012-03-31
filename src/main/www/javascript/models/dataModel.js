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

Site.updateURL = function(site){
    return DT_D7.NODE_SAVE.replace('<NODE_ID>', site.id);
}

Site.packageData = function(site, user) {
    var data = "";
    data += "nid=" + site.id + "&";
    data += "title=" + site.name + "&";
    data += "uid=" + user.uid + "&";
    data += "name=" + user.name + "&";
    data += "type=" + DT_D7.NODE_TYPE.SITE + "&";
    data += "field_ftritem_narrative[und][0][value]=" + site.narrative + "&";
    data += "field_ftritem_summary[und][0][value]=" + site.narrative + "&";
    data += "field_ftritem_date_visited[und][0][value][date]=" + site.dateVisited + "&";
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
