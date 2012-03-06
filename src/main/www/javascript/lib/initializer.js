function initializeApplicationEvents(){
    attachLoginButtons();
    attachSiteButtons();
    attachCommonEvents();
    attachNarrativeButtons();
    attachContactInfoButtons();
    attachQuestionsButtons();
    attachPhotoButtons();
    attachActionItemButtons();
    attachSettingsButton();
	attachGlobalErrorHandler();
    
    function attachCommonEvents(){
        $(".back_to_site_list").click(fieldTripController.showTripReports);
        $(".site_details_sub_screen").click(devtrac.siteDetailController.show);
    }
    
    function attachContactInfoButtons(){
        $("#site_detail_contact_info").click(devtrac.contactInfoController.edit);
        $("#edit_contact").click(devtrac.contactInfoController.edit);
        $("#contact_save").click(devtrac.contactInfoController.save);
    }
    
    function attachQuestionsButtons(){
        $("#site_detail_questions").click(devtrac.questionsController.show);
        $("#questions-submit").click(devtrac.questionsController.save);
    }
    
    function attachPhotoButtons(){
        $("#site_detail_photo").click(devtrac.photoController.show);
        $("#attach_photo").click(devtrac.photoController.attach);
    }
    
    function attachActionItemButtons(){
        $("#site_detail_action_item").click(devtrac.actionItemController.show);
        $(".back_to_action_item_list").click(devtrac.actionItemController.show);
        $("#add_action_item_button").click(devtrac.actionItemController.add);
        $("#action_item_edit").click(devtrac.actionItemController.editSave);
        $("#save_action_item").click(devtrac.actionItemController.save);
    }
    
    function attachSettingsButton(){
        $("#settings_button").click(devtrac.settingsController.show);
        $("#upload_data").click(devtrac.settingsController.uploadData);
        $("#update_question_places").click(devtrac.settingsController.updateQuestionsPlaces);
        $("#wipe_out_data").click(devtrac.settingsController.wipeout);
        $("#show_log").click(devtrac.settingsController.showLog);
        $("#delete_proceed").click(devtrac.settingsController.performWipeout);
        $("#delete_cancel").click(devtrac.settingsController.show);
        $("#log_debug_mode").click(devtrac.settingsController.setDebugMode);
    }
    
    function attachNarrativeButtons(){
        $("#site_detail_narrative").click(devtrac.siteDetailController.narrative);
        $("#narrative-save").click(devtrac.siteDetailController.updateNarrative);
    }
    
    function attachSiteButtons(){
        $("#add_new_site_button").click(siteController.add);
        $("#sites_to_visit_button").click(fieldTripController.showTripReports);
        $("#add_site_button").click(siteController.create);
        $("#site_details_back_button").click(fieldTripController.showTripReports);
    }
    
    function attachLoginButtons(){
        $("#login").click(devtrac.loginController.login);
        $("#logout").click(devtrac.loginController.logout);
        $("#login_settings_button").click(devtrac.settingsController.show);
    }
    
    function attachGlobalErrorHandler(){
        //$(window).error(devtrac.common.errorHandler);
		//window.onerror = devtrac.common.errorHandler;
    }
}




