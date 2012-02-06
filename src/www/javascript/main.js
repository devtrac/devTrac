var devtrac = {
    loginController: new LoginController(),
    user: new User(),
    common: new Common(),
    fieldTrip: new FieldTrip(),
    dataPull: new DataPull(),
    dataPush: new DataPush(),
    dataStore: new DataStore(),
    siteDetailController: new SiteDetailController(),
    questionsController: new QuestionsController(),
    contactInfoController: new ContactInfoController(),
    actionItemController: new ActionItemController(),
    settingsController: new SettingsController(),
    photoController: new PhotoController(),
    remoteView: new RemoteView(),
    photoUpload: new PhotoUpload(),
    currentSite: "",
    places: "",
    questions: "",
    profiles: ""
}

function onLoad(){
    // BlackBerry OS 4 browser does not support events.
    // So, manually wait until PhoneGap is available.
    //
    var intervalID = window.setInterval(function(){
        if (PhoneGap.available) {
            window.clearInterval(intervalID);
            init();
        }
    }, 500);
}

function init(){
	navigator.log.debug("Initializing app.");
    initializeApplicationEvents();
	navigator.log.debug("Initialized application events.");
    devtrac.dataStore.init(devtrac.loginController.show);
	navigator.log.debug("Datastore initialized.");
}
