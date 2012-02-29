function User(){
    this.loggedIn = false;
    this.name = "";
    this.session = {};
    this.email = "";
    this.uid = "";
}

User.prototype.authenticate = function(userName, password, successCallback, failedCallback){
    var success = function(response){
		if (devtrac.common.hasError(response)) {
            alert(devtrac.common.getErrorMessage(response));
            failedCallback();
        }
        else {
            devtrac.user.parseUserData(response);
            successCallback();
        }
    };
    
    var failed = function(response, textStatus){
        devtrac.common.logAndShowGenericError("Error occured in authenticating. Details: [" + textStatus + "], " + JSON.stringify(response));
    };
	authenticate(userName, password, success, failed);
};

User.prototype.parseUserData = function(response){
    this.loggedIn = true;
    this.name = response[DT.DATA_REF][DT.USER_REF][DT.NAME_REF];
    this.email = response[DT.DATA_REF][DT.USER_REF]['mail'];
    this.uid = response[DT.DATA_REF][DT.USER_REF]['uid'];
    this.session.id = response[DT.DATA_REF][DT.SESSION_ID_REF];
};
