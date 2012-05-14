function ActionItemController(){
    var currentActionItem;
}

ActionItemController.prototype.edit = function(actionItem){
    currentActionItem = actionItem;
    navigator.log.debug("Editing action item");
    screens.show("loading");
	
    $("#action_item_title_edit").text(actionItem.title);
    $("#action_item_task_edit").text(actionItem.task);
    var assignedTo= devtrac.actionItemController._parseProfileName(actionItem);
    $("#action_item_assigned_to_edit").text(assignedTo);

    screens.show("action_item_edit");
    navigator.log.debug("Displayed action item screen");
}

ActionItemController.prototype.addComment = function(){
    navigator.log.debug("Showing add comment");
    screens.show("loading");

    $(".comment-content").html("");
    if(currentActionItem.comments){
        for(var i in currentActionItem.comments){
           var html = '<li class="comment_item">' + currentActionItem.comments[i].subject + '</li>';
           $(".comment-content").append(html);
        }
    }
    screens.show("add_comment");
    navigator.log.debug("Displayed comment adding screen");
}

ActionItemController.prototype.saveComment = function(){
    var comment = new Comment();
    comment.subject = $("#comment_edit").val();

    for (var id in devtrac.currentSite.actionItems) {
        var actionItem = devtrac.currentSite.actionItems[id];
		var isSameActionItem = (currentActionItem.id ==0 && actionItem.id ==0)? currentActionItem.title ==actionItem.title : currentActionItem.id == actionItem.id;
        if (isSameActionItem) {
            devtrac.currentSite.actionItems[id].comments.push(comment);
            devtrac.currentSite.actionItems[id].uploaded = false;
        }
    }
    devtrac.currentSite.uploaded = false;

    var container = $(".comment-content");
    var html = '<li class="comment_item">' + comment.subject + '</li>';
    container.append(html);
    $("#comment_edit").val("");
    alert("Comment saved successfully");

    devtrac.dataStore.saveCurrentSite(function(){
        navigator.log.debug("Edited action item. Will display list.");
    });
}

ActionItemController.prototype.info = function(actionItem){
    navigator.log.debug("Showing action item info");
    screens.show("loading");
    $("#action_item_title_value").text(actionItem.title);
    $("#action_item_task_value").text(actionItem.task);
    var assignedTo= devtrac.actionItemController._parseProfileName(actionItem);
    $("#action_item_assign_value").text(assignedTo);

    screens.show("action_item_info");
    navigator.log.debug("Displayed action item info screen");
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
         if(item.status === DT_D7.OPENED_STATUS || item.status === DT_D7.CLOSED_STATUS ){
            var container = item.status === DT_D7.OPENED_STATUS ? $("#action_items_list"):$("#previous_action_items_list");
            var html = devtrac.actionItemController.getDisplayHtml(item);
            container.append(html);
        }
    });

    actionItemGrid.show();

    navigator.log.debug("Displayed action items");
    screens.show("list_action_items");
    $(".editable_action_item").click(showActionItemEditScreen);
    $(".uneditable_action_item").click(showActionItemInfoScreen);
}

ActionItemController.prototype.getDisplayHtml = function(item){
    var htmlClass = " class='col1 uneditable_action_item link'>";
    if(item.status === DT_D7.OPENED_STATUS){
        if(item.uid === devtrac.user.uid || item.assignedTo === devtrac.user.name)
             htmlClass = "' class='col1 editable_action_item link'>";
    }

    var displayName = devtrac.actionItemController._parseProfileName(item);
	var actionItemId = item.id ==0? item.title : item.id;
    var html = "<div class='grid_row'><div id='" + actionItemId + "'" + htmlClass + item.title + "</div><div class='col2'>" + displayName + "</div></div>";
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
    actionItem.uid = devtrac.user.uid;
    devtrac.currentSite.actionItems.push(actionItem);

    devtrac.currentSite.uploaded = false;
    devtrac.dataStore.saveCurrentSite(function(){
        alert("Added action item.");
        navigator.log.debug("Saved action item. Will display list.");
        devtrac.actionItemController.show();
    });
}
