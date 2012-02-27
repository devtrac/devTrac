var screens = new Object();

screens.list = {
    "loading": "#spinner",
    "login": "#login_screen",
    "sites_to_visit": "#sites_to_visit",
    "add_new_site": "#add_new_site",
    "site_details": "#site_details_screen",
    "questions_form": "#questions_form",
    "site_narrative": "#site_narrative_screen",
    "contact_info": "#contact_info_screen",
    "contact_info_edit": "#contact_info_edit_screen",
    "photo": "#photo_screen",
    "pull_status": "#pull_status",
    "list_action_items": "#list_action_item_screen",
    "add_action_item": "#add_action_item_screen",
    "action_item_edit": "#action_item_edit_screen",
    "settings": "#settings",
    "delete_confirm": "#delete_confirm",
    "upload_progress": "#upload_progress"
};

screens.show = function(name){
    for (var screen in screens.list) {
        if (screen == name) {
            var element = $(screens.list[screen]);
            if (element) {
                element.show();
            }
        }
        else {
            var element = $(screens.list[screen]);
            if (element) {
                element.hide();
            }
        }
    }
};

