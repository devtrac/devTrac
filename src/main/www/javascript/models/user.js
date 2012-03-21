function User(){
    this.loggedIn = false;
    this.name = "";
    this.session = {};
    this.email = "";
    this.uid = "";
}

User.prototype.authenticate = function(userName, password, successCallback, failedCallback){
    var success = function(response){
        devtrac.user.parseUserData(response);
        successCallback();
    };

    var failed = function(response){
        devtrac.common.logAndShowGenericError("Error in authenticating. Details: " + JSON.stringify(response));
        failedCallback();
    };
    authenticate(userName, password, success, failed);
};

User.prototype.parseUserData = function(response){
    this.loggedIn = true;
    this.name = response[DT.USER_REF][DT.NAME_REF];
    this.email = response[DT.USER_REF]['mail'];
    this.uid = response[DT.USER_REF]['uid'];
    this.session.id = response[DT.SESSION_ID_REF];
    this.session.name = response[DT.SESSION_NAME_REF];
};
