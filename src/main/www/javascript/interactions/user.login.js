function authenticate(userName, password, successCallback, failedCallback){
    var timeout = 30000;

    var connectCallback = function(data){
        if (hasError(data)){
            failedCallback(data);
        }

        if (userLoggedIn(data)) {
            successCallback(data);
        }
        else {
            var postData = {
                username: userName,
                password: password
            };
            devtrac.common.callServicePost(DT_D7.USER_LOGIN, postData, successCallback, failedCallback, failedCallback);
        }
    };
    devtrac.common.callServicePost(DT_D7.SYSTEM_CONNECT, null, connectCallback, failedCallback, failedCallback);
}

function logout(successCallback, failedCallback){
    devtrac.common.callServicePost(DT_D7.USER_LOGOUT, {}, 10000, successCallback, failedCallback, failedCallback);
}

function userLoggedIn(response){
    return response[DT.USER_REF] &&
    response[DT.USER_REF][DT.NAME_REF] &&
    response[DT.USER_REF][DT.PASSWORD_REF];
}

function hasError(response){
    if (response["error"]){
        return true;
    }
    else {
        return false;
    }
}
