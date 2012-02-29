function LoginController(){
    // Login controller object
}

LoginController.prototype.show = function(){
	navigator.log.debug("In show of login controller.");
    if (devtrac.user && devtrac.fieldTrip) {
		navigator.log.debug("User is logged in and has a field trip. Showing trip reports.");
        fieldTripController.showTripReports();
        return;
    }
	navigator.log.debug("User is logged in but either information is not saved or doesn't have field trips. Showing login screen.");
    screens.show("login");
}

LoginController.prototype.login = function(){
    var userName = $("#username").val();
    var password = $("#password").val();
    
    if (!userName || !password) {
        alert("Please enter username and password.");
        return;
    }
    
    var renderView = function(){
        navigator.store.put(function(){
            devtrac.dataStore.getQuestions(function(){
                devtrac.dataStore.getPlaces(function(){
                    devtrac.dataStore.getProfiles(function(){
                        if (devtrac.questions && devtrac.places && devtrac.profiles) {
                            // Check if fieldtrip is locally available for current user
                            devtrac.dataStore.retrieveFieldTrip(function(){
                                if (devtrac.fieldTrip && devtrac.fieldTrip.id) {
                                    fieldTripController.showTripReports();
                                    return;
                                }
                                // No fieldtrip exist for user. Download the details.
                                devtrac.dataPull.tripDetails(fieldTripController.showTripReports);
                            });
                        }
                        else {
                            devtrac.dataPull.questions(function(){
                                // Check if fieldtrip is locally available for current user
                                devtrac.dataStore.retrieveFieldTrip(function(){
                                    if (devtrac.fieldTrip && devtrac.fieldTrip.id) {
                                        fieldTripController.showTripReports();
                                        return;
                                    }
                                    // No fieldtrip exist for user. Download the details.
                                    devtrac.dataPull.tripDetails(fieldTripController.showTripReports);
                                });
                            });
                        }
                    })
                });
            });
            
        }, function(){
            devtrac.common.logAndShowGenericError("Error in saving: " + devtrac.user.name);
        }, "user", JSON.stringify(devtrac.user));
    };
    
    var loginFailed = function(){
        screens.show("login");
    };
    screens.show("loading");
	devtrac.user.authenticate(userName, password, renderView, loginFailed);
};

LoginController.prototype.logout = function(){
	navigator.log.debug("Logging out user.");
    logout(function(){
		navigator.log.debug("Logged out remotely.");
        navigator.store.remove(function(){
			navigator.log.debug("Removed saved session.");
            devtrac.user.loggedIn = false;
            devtrac.user.name = "";
            devtrac.user.email = "";
            devtrac.user.uid = 0;
            devtrac.fieldTrip = new FieldTrip();
			navigator.log.debug("Showing login screen.");
            screens.show("login");
        }, function(){
            devtrac.common.logAndShowGenericError("Error occured in deleting user: " + devtrac.user.name);
            screens.show("login");
        }, "user");
    }, function(){
		navigator.log.debug("Couldn't do normal logout. Just displaying login screen.");
        screens.show("login");
    })
};
