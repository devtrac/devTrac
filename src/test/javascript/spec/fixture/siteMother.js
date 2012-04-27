function SiteMother(){

}

SiteMother.createActionItem = function(title, uploaded, status){
    var actionItem = new ActionItem();

    actionItem.title = title;
    actionItem.uploaded = uploaded;
    actionItem.id = 0;
    actionItem.task = 'Action Task';
    actionItem.assignedTo = 'tester';
    actionItem.uid = "32";
    actionItem.status = status? status : actionItem.status;

    return actionItem;
}

SiteMother.createSite = function(name, uploaded, offline){
    var site = new Site();
    site.name = name;
    site.uploaded = uploaded;
    site.offline = offline;
    site.contactInfo.uploaded = true;
    return site;
}

SiteMother.createSiteWithActionItems = function(name, uploaded){
    var site = this.createSite(name, uploaded, false);
    site.actionItems.push(this.createActionItem('testActionItem', false));
    return site;
}

SiteMother.createContactInfo = function(name, uploaded){
    var contactInfo = {
        name: name,
        phone: "1234",
        email: "test@gmail.com",
        uploaded: uploaded
    }

    return contactInfo;
}

SiteMother.createSiteWithContactInfo = function(siteName, uploaded, placeId, contactName, uploadedOfContactInfo){
    var site =  this.createSite(siteName, uploaded, false);
	site.placeId = placeId;
    site.contactInfo = this.createContactInfo(contactName, uploadedOfContactInfo);

    return site;
}

