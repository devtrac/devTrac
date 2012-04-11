function SiteMother(){

}

SiteMother.createActionItem = function(title, uploaded){
    var actionItem = new ActionItem();

    actionItem.title = title;
    actionItem.uploaded = uploaded;
    actionItem.id = 0;
    actionItem.task = 'Action Task';
    actionItem.assignedTo = 'tester';

    return actionItem;
}

SiteMother.createSite = function(name, uploaded, offline){
    var site = new Site();
    site.name = name;
    site.uploaded = uploaded;
    site.offline = offline;
    return site;
}