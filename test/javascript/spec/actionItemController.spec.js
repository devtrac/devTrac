describe("Action Item Controller", function(){
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

		userProfiles = [{username:"Bob", name:"Bob"}, {username:"Charlie", name:"Charlie"}];
	});
	
	it("display action items in current section", function(){
		var actionItems = [{title:"test action", assignedTo:"Bob"},{title:"test action 2", assignedTo:"Dick"}];
		
		actionItemController.displayActionItem(actionItems, userProfiles, $('#action_items_list'));
		
		expect($('#action_items_list div.col1:first')).toHaveText( actionItems[0].title);
		expect($('#action_items_list div.col1:eq(1)')).toHaveText( actionItems[1].title);
		
		expect($('#action_items_list div.col2:eq(0)')).toHaveText( actionItems[0].assignedTo);
		expect($('#action_items_list div.col2:eq(1)')).toHaveText( "N/A");
	});
	
	it("display fake action items in history section", function(){
		var fakeActionItems = [{title:"test fake", assignedTo:"Bob"},{title:"test fake 2", assignedTo:"Dick"}];
		
		
		actionItemController.displayActionItem(fakeActionItems, userProfiles, $('#previous_action_items_list'));
		
		expect($('#previous_action_items_list div.col1:first')).toHaveText( fakeActionItems[0].title);
		expect($('#previous_action_items_list div.col1:eq(1)')).toHaveText( fakeActionItems[1].title);
		
		expect($('#previous_action_items_list div.col2:eq(0)')).toHaveText( fakeActionItems[0].assignedTo);
		expect($('#previous_action_items_list div.col2:eq(1)')).toHaveText( "N/A");
	});
})
