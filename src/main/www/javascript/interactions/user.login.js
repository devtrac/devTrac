function authenticate(userName, password, successCallback, failedCallback){
    var timeout = 30000;

    var loginCallback = function(response){
        if(response["error"]){
            failedCallback(response);
        }
        else{
            successCallback(response);
        }
    };

    var connectCallback = function(data){
        if (userLoggedIn(data)) {
            successCallback(data);
        }
        else {
            var postData = {
                username: userName,
                password: password
            };
            devtrac.common.callServicePost(DT_D7.USER_LOGIN, postData, loginCallback, failedCallback);
        }
    };
    devtrac.common.callServicePost(DT_D7.SYSTEM_CONNECT, null, connectCallback, failedCallback);
}

function logout(successCallback, failedCallback){
    devtrac.common.callServicePost(DT_D7.USER_LOGOUT, {}, successCallback, failedCallback);
}

function userLoggedIn(response){
    return response[DT.USER_REF] &&
    response[DT.USER_REF][DT.NAME_REF] &&
    response[DT.USER_REF][DT.PASSWORD_REF];
}
