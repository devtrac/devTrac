function User() {
    this.loggedIn = false;
    this.name = "";
    this.session = {};
    this.email = "";
    this.uid = "";
    this.cookie = "";
}

User.prototype.authenticate = function(userName, password, successCallback, failedCallback){
    var success = function(response){
        devtrac.user.parseUserData(response);
        successCallback();
    };

    var failed = function(response){
        if(response["httpcode"]==401){
            devtrac.common.logAndShowGenericError("Wrong username or password.");
        }
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
    this.cookie = response[DT.SESSION_NAME_REF] + '='
            + response[DT.SESSION_ID_REF];
};
