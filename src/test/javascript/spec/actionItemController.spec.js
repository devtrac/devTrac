describe("ActionItemController", function() {

    describe("Rendering action item view", function(){
        var actionItemController = new ActionItemController();
        var userProfiles;

        beforeEach(function(){
            var fixture = "<div id='list_action_item_screen' style='display: none'>" +
                "<div class='toolbar'>"+
                    "<h1>Action Item</h1>"+
                    "<span class='back site_details_sub_screen'>Back</span>"+
                "</div>"+
                "<div class='content'>"+
                    "<div class='right'>"+
                        "<span id='add_action_item_button' class='link'>Add New Action Item</span>"+
                    "</div>"+
                    "<div id='no_action_items' style='display: none'>"+
                        "No action items"+
                    "</div>"+

                    "<div class='grid action_item_grid' style='display: none'>"+
                        "<div class='grid_heading'>"+
                            "<div class='col1'>"+
                                "Action Item"+
                            "</div>"+
                            "<div class='col2'>"+
                                "Assigned To"+
                            "</div>"+
                        "</div>"+
                        "<div id='action_items_list'>"+
                        "</div>"+

                        "<h4>History</h4>"+

                        "<div id='previous_action_items_list'>"+
                        "</div>"+
                    "</div>"+

                "</div>"+
            "</div>" ;

            setFixtures("<body>"+ fixture +"</body>");

            devtrac.profiles = [{username:"Bob", name:"Bob"}, {username:"Charlie", name:"Charlie"}];
        });


        it("display action items in current section", function(){
            var actionItems = [{title:"test action", assignedTo:"Bob"},{title:"test action 2", assignedTo:"Dick"}];


            actionItemController.displayActionItemsInCurrentSection(actionItems);


            expect($('#action_items_list div.col1:first')).toHaveText( actionItems[0].title);
            expect($('#action_items_list div.col1:eq(1)')).toHaveText( actionItems[1].title);


            expect($('#action_items_list div.col2:eq(0)')).toHaveText( actionItems[0].assignedTo);
            expect($('#action_items_list div.col2:eq(1)')).toHaveText( "N/A");
        });


        it("display fake action items in history section", function(){
            var fakeActionItems = [{title:"test fake", assignedTo:"Bob"},{title:"test fake 2", assignedTo:"Dick"}];


            actionItemController.displayActionItemsInHistorySection(fakeActionItems);


            expect($('#previous_action_items_list div.col1:eq(0)')).toHaveText( fakeActionItems[0].title);
            expect($('#previous_action_items_list div.col1:eq(1)')).toHaveText( fakeActionItems[1].title);


            expect($('#previous_action_items_list div.col2:eq(0)')).toHaveText( fakeActionItems[0].assignedTo);
            expect($('#previous_action_items_list div.col2:eq(1)')).toHaveText( "N/A");
        });
    })

    describe("Editing action item", function(){
        var actionItemController = new ActionItemController();
        var userProfiles;
        var actionItem;

        beforeEach(function(){
            var fixture =
                '<body><div id="action_item_edit_screen" style="display: none">'+
                    '<div class="toolbar">'+
                        '<h1>Action Item</h1>'+
                        "<span class='back back_to_action_item_list'>Back</span>"+
                    "</div>"+
                    '<div class="content">'+
                        "<p>"+
                            "<label id='action_title'>"+
                                "Title"+
                            "</label>"+
                            '<input type="text" id="action_item_title_edit" class="input" value=""/>'+
                        "</p>"+
                        "<p>"+
                            "<label id='action_task'>"+
                                "Task"+
                            "</label>"+
                            "<input type='text' id='action_item_task_edit' class='input' value=''/>"+
                        "</p>"+
                        "<p>"+
                            "<label id='action_assign'>"+
                                "Assign To"+
                            "</label>"+
                            "<select id='action_item_assigned_to_edit' class='select' name='users'>"+
                            "</select>"+
                        "</p>"+
                        "<p class='submit'>"+
                            "<input type='submit' id='action_item_edit' class='button' value='Save'/>"+
                        "</p>"+
                    '</div>'+
                '</div></body>';
            setFixtures(fixture);
            actionItem = {id:0, title:"test action", task:"test 1", assignedTo:"Bob"};
            var user1 = "Terra Weikel";
            devtrac.profiles = [{name:user1},{name:"Rebecca Kwagala"}];
        })

        it("show correct info when edit an exist action item", function(){
            actionItemController.edit(actionItem);

            expect($('#action_item_title_edit')).toHaveValue("test action");
            expect($('#action_item_task_edit')).toHaveValue("test 1");
        })

        it("change action item after saved", function(){
            devtrac.currentSite = {id:1, name: "test site" ,actionItems: [actionItem]};
            actionItemController.edit(actionItem);
            var newTitle = "test changed";
            var newTask = "task changed";



            $("#action_item_title_edit").val(newTitle);
            $("#action_item_task_edit").val(newTask);

            actionItemController.editSave();

            expect(devtrac.currentSite.actionItems[0].uploaded).toBeFalsy();
            actionItemController.edit(devtrac.currentSite.actionItems[0]);
            expect($('#action_item_title_edit')).toHaveValue(newTitle);
            expect($('#action_item_task_edit')).toHaveValue(newTask);
        })
    })

    describe("Create action item", function(){
        var actionItemController = new ActionItemController();
        var UserProfile;
        var actionit;
        var user1 = "Terra Weikel";

        var title = "A new action itemz";
        var task = "Test creating task";
        var assignedTo = user1;

        beforeEach(function(){
            var fixture = '<body>' +
                '<div id="add_action_item_screen" style="display: none">' +
                    '<div class="toolbar">' +
                        '<h1>Add New Action Item</h1>' +
                        '<span class="back back_to_action_item_list">Back</span>' +
                    '</div>' +
                    '<div class="content">' +
                        '<p>' +
                            '<label id="action_title">' +
                                'Title' +
                            '</label>' +
                            '<input type="text" id="action_item_title" class="input" value=""/>' +
                        '</p>' +
                        '<p>' +
                            '<label id="action_task">' +
                                'Task' +
                            '</label>' +
                            '<input type="text" id="action_item_task" class="input" value=""/>' +
                        '</p>' +
                        '<p>' +
                            '<label id="action_assign">' +
                                'Assign To' +
                            '</label>' +
                            '<select id="action_item_assigned_to" class="select" name="users">' +
                            '</select>' +
                        '</p>' +
                        '<p class="submit">' +
                            '<input type="submit" id="save_action_item" class="button" value="Add"/>' +
                        '</p>' +
                    '</div>' +
                '</div>' +
            '</body>';

            setFixtures(fixture);

            $("#action_item_title").val(title);
            $("#action_item_task").val(task);
            $("#action_item_assigned_to").append("<option value='" + assignedTo + "'>" + assignedTo + "</option>");

            devtrac.currentSite = {id: 1, name: "test site", actionItems: []};
            devtrac.profiles = [{name:user1},{name:"Rebecca Kwagala"}];

            actionItemController.save();
        })

        it("Count of action items of current site should be 1", function(){
            expect(devtrac.currentSite.actionItems.length).toEqual(1);
        })

        it("Field value should be correct", function(){
            var expectedItem = SiteMother.createActionItem(title, false);
            expectedItem.task = task;
            expectedItem.assignedTo = assignedTo;
            expect(devtrac.currentSite.actionItems[0]).toEqual(expectedItem);
        })
    })
})
