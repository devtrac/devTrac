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

    devtrac.actionItemController.displayActionItemsInCurrentSection(devtrac.currentSite.actionItems);
    actionItemGrid.show();

    navigator.log.debug("Displayed action items");
    screens.show("list_action_items");
    attachClickEvents(".action_item", showActionItemEditScreen);
}

ActionItemController.prototype.displayActionItemsInCurrentSection = function(actionItems){
    var container = $("#action_items_list");
    container.html("");
    $.each(actionItems, function(index, item){
        var name = devtrac.actionItemController._parseProfileName(item);
        var id = item.id;
        var html = "<div class='grid_row'><div id='" + id + "' class='col1 action_item link'>" + item.title + "</div><div class='col2'>" + name + "</div></div>";
        container.append(html);
    });
}

ActionItemController.prototype.displayActionItemsInHistorySection = function(actionItems){
    var container = $("#previous_action_items_list");
    container.html("");
    $.each(actionItems, function(index, item){
        var name = devtrac.actionItemController._parseProfileName(item);
        var id = item.id;
        var html = "<div class='grid_row'><div id='" + id + "' class='col1'>" + item.title + "</div><div class='col2'>" + name + "</div></div>";
        container.append(html);
    });
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
    devtrac.currentSite.actionItems.push(actionItem);

    devtrac.currentSite.uploaded = false;
    devtrac.dataStore.saveCurrentSite(function(){
        alert("Added action item.");
        navigator.log.debug("Saved action item. Will display list.");
        devtrac.actionItemController.show();
    });
}
