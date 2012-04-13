function ActionItemController(){
    var currentActionItem;
}

ActionItemController.prototype.edit = function(actionItem){
    currentActionItem = actionItem;
    navigator.log.debug("Editing action item");
    screens.show("loading");
    $("#action_item_title_edit").val(actionItem.title);
    $("#action_item_task_edit").val(actionItem.task);
    var users = $("#action_item_assigned_to_edit");
    users.html("");
    $(devtrac.profiles).each(function(index, profile){
        users.append("<option value='" + profile.uid + "'>" + profile.name + "</option>");
    });
    var name = devtrac.actionItemController._parseProfileName(actionItem);
    $("#action_item_assigned_to_edit option[text=" + name + "]").attr("selected", "selected");

    screens.show("action_item_edit");
    navigator.log.debug("Displayed action item screen");
}

ActionItemController.prototype.editSave = function(){
    navigator.log.debug("Saving action item");
    var title = $("#action_item_title_edit").val();
    var task = $("#action_item_task_edit").val();
    var assignedTo = $("#action_item_assigned_to_edit").val();

    if (!title || !task || !assignedTo) {
        alert("Please enter title, task and assigned to values.");
        return;
    }

    for (var id in devtrac.currentSite.actionItems) {
        var actionItem = devtrac.currentSite.actionItems[id];
        if (currentActionItem.id == actionItem.id) {
            devtrac.currentSite.actionItems[id].title = title;
            devtrac.currentSite.actionItems[id].task = task;
            devtrac.currentSite.actionItems[id].assignedTo = assignedTo;
            devtrac.currentSite.actionItems[id].uploaded = false;
        }
    }

    devtrac.currentSite.uploaded = false;
    devtrac.dataStore.saveCurrentSite(function(){
        alert("Edited action item.");
        navigator.log.debug("Edited action item. Will display list.");
        devtrac.actionItemController.show();
    });
}

ActionItemController.prototype.show = function(){
    navigator.log.debug("Showing action items");
    screens.show("loading");
    var actionItemGrid = $(".action_item_grid");

    if (devtrac.currentSite.actionItems.length == 0) {
        $("#no_action_items").show();
        actionItemGrid.hide();
        screens.show("list_action_items");
        return;
    }

    $("#no_action_items").hide();

    $("#action_items_list").html("");
    $("#previous_action_items_list").html("");

    $.each(devtrac.currentSite.actionItems, function(index, item){
         if(item.status === DT_D7.OPENED_STATUS || DT_D7.CLOSED_STATUS ){
            var container = item.status === DT_D7.OPENED_STATUS ? $("#action_items_list"):$("#previous_action_items_list");
            var html = devtrac.actionItemController.getDisplayHtml(item);
            container.append(html);
        }
    });

    actionItemGrid.show();

    navigator.log.debug("Displayed action items");
    screens.show("list_action_items");
    $(".editable_action_item").click(showActionItemEditScreen);
}

ActionItemController.prototype.getDisplayHtml = function(item){
    var name = devtrac.actionItemController._parseProfileName(item);

    var htmlClass = "' class='col1 uneditable_action_item link'>";
    if(item.status === DT_D7.OPENED_STATUS){
        if(item.uid === devtrac.user.uid || name === devtrac.user.name)
             htmlClass = "' class='col1 editable_action_item link'>";
    }
    var html = "<div class='grid_row'><div id='" + item.id + htmlClass + item.title + "</div><div class='col2'>" + name + "</div></div>";
    return html;
}

ActionItemController.prototype._parseProfileName = function(actionItem){
    var profiles = $.grep(devtrac.profiles, function(profile){
        return actionItem.assignedTo == profile.uid || actionItem.assignedTo == profile.username;
    });
    return profiles.length > 0 ? profiles[0].name : "N/A";
}

ActionItemController.prototype.add = function(){
    navigator.log.debug("Adding action item");
    $("#action_item_title").val("");
    $("#action_item_task").val("");
    var users = $("#action_item_assigned_to");
    users.html("");
    $(devtrac.profiles).each(function(index, profile){
        users.append("<option value='" + profile.username + "'>" + profile.name + "</option>");
    });
    screens.show("add_action_item");
    navigator.log.debug("Displayed add action item screen");
}

ActionItemController.prototype.save = function(){
    navigator.log.debug("Saving action item");
    var title = $("#action_item_title").val();
    var task = $("#action_item_task").val();
    var assignedTo = $("#action_item_assigned_to").val();

    if (!title || !task || !assignedTo) {
        alert("Please enter title, task and assigned to values.");
        return;
    }

    var actionItem = new ActionItem();
    actionItem.id = 0;
    actionItem.title = title;
    actionItem.task = task;
    actionItem.assignedTo = assignedTo;
    actionItem.uploaded = false;
    actionItem.uid = UserProfile.getUserIDbyUserName(devtrac.user.name);
    devtrac.currentSite.actionItems.push(actionItem);

    devtrac.currentSite.uploaded = false;
    devtrac.dataStore.saveCurrentSite(function(){
        alert("Added action item.");
        navigator.log.debug("Saved action item. Will display list.");
        devtrac.actionItemController.show();
    });
}
