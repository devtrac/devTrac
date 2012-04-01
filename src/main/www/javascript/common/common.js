function Common(){
    this.callServiceWithTimeout = function(data, timeout, successCallback, failedCallback, timeoutCallback){
        var method = data ? "POST" : "GET";
        this.callServiceWithTimeoutAndUrl(method, DT.SERVICE_ENDPOINT, data, timeout, successCallback, failedCallback, timeoutCallback);
    }

    this.callServiceWithTimeoutAndUrl= function(method, url, data, timeout, successCallback, failedCallback, timeoutCallback){
        var responsed = false;
        var start = new Date().getTime();

        var success = function(response) {
            if (responsed) {
                return;
            }
            clearTimeout(timer);
            responsed = true;
            successCallback(response);
        };

        var error = function(response) {
            if (responsed) {
                return;
            }
            clearTimeout(timer);
            responsed = true;
            failedCallback(response);
        };

        var timer = setTimeout(function() {
            responsed = true;
            timeoutCallback("Request timeout");
        }, timeout);

        navigator.network.XHR(devtrac.user.cookie, method, url, devtrac.common.convertHash(data), success, error);
    }

    this.callService = function(data, callback, errorCallback){
        this.callServiceWithUrl(DT.SERVICE_ENDPOINT, data, callback, errorCallback);
    }

    this.callServiceWithUrl = function(url, data, callback, errorCallback){
        var method = data ? "POST" : "GET";

        navigator.log.log("Network call with data: " + JSON.stringify(data));
        navigator.network.XHR(devtrac.user.cookie, method, url, devtrac.common.convertHash(data), callback, errorCallback);
    }

    this.callServiceGet = function(url, callback, errorCallback){
        this.callServiceWithTimeoutAndUrl("GET", url, null , DT_D7.TIME_OUT, callback, errorCallback, errorCallback);
    }

    this.callServicePost= function(url, postData, callback, errorCallback){
        this.callServiceWithTimeoutAndUrl("POST", url, postData, DT_D7.TIME_OUT, callback, errorCallback, errorCallback);
    }

    this.callServicePut= function(url, postData, callback, errorCallback){
        this.callServiceWithTimeoutAndUrl("PUT", url, postData, DT_D7.TIME_OUT, callback, errorCallback, errorCallback);
    }

    this.callServiceUpload = function(url, filePath, userId, fileUploadPath, successCallback, errorCallback){
        navigator.network.XHRUpload(devtrac.user.cookie, "POST", url, null, filePath, userId, fileUploadPath, function(response){
            successCallback(response["fid"]);
      }, errorCallback);
    }

    this.convertHash = function(hash){
        if (!(hash instanceof Object)) return hash;

        var paramStr = "";
        for (param in hash) {
            paramStr += param;
            paramStr += '=';
            paramStr += hash[param];
            paramStr += "&";
        }
        return paramStr;
    }

    this.generateHash = function(method, timestamp){
        return Crypto.HMAC(Crypto.SHA256, timestamp + ";" + DT.DOMAIN + ";" + timestamp + ";" + method, DT.API_KEY)
    }

    this.hasError = function(response){
        if (response["#error"]) {
            return true;
        }
        else {
            if (response["#data"]) {
                var data = response["#data"];
                if (data["#error"] || data["error"]) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
    }
    
    this.getErrorMessage = function(response){
        if (response["#error"]) {
            if (response["#message"]) {
                return response["#message"];
            }
            else {
                if (response["#data"]) {
                    return response["#data"];
                }
                else {
                    return "Unknown error occured. Please try again.";
                }
            }
        }
        else {
            if (response["#data"]) {
                var data = response["#data"];
                if (data["#error"]) {
                    return data["#message"];
                }
                else {
                    return "Unknown error.";
                }
            }
            else {
                return "Unexpected #data format.";
            }
        }
    }
    
    this.getOneMonthLaterDate = function(){
        var now = new Date();
        var oneMonthLater = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        var day = (oneMonthLater.getDate() < 9) ? '0' + oneMonthLater.getDate() : '' + oneMonthLater.getDate();
        var month = (oneMonthLater.getMonth() < 9) ? '0' + oneMonthLater.getMonth() : '' + oneMonthLater.getMonth();
        var year = '' + oneMonthLater.getFullYear();
        return day + '/' + month + '/' + year;
    }
    
    this.errorHandler = function(errMsg, url, lineNum){
        alert(errMsg);
        var errorMessage = 'UnCaughtException: ' + errMsg;
        if (url) 
            errorMessage += ' for page: ' + url;
        if (lineNum) 
            errorMessage += ' on Line# ' + lineNum;
        alert(errorMessage);
        navigator.log.log(errorMessage);
        return false;
    }
    
    this.logAndShowGenericError = function(message){
        navigator.log.log(message);
        alert(message);
    }
    
    this.validateAssignedTo = function(assignedValue){
        for (var index in devtrac.profiles) {
            var profile = devtrac.profiles[index];
            if (profile.uid === assignedValue || profile.username === assignedValue) {
                return profile.username;
            }
        }
        return devtrac.user.name;
    }
    
    this.findPlaceType = function(site){
        if (site.offline) {
            for (var index in devtrac.places) {
                var place = devtrac.places[index];
                if (site.type == place.name) {
                    return place.id;
                }
            }
        }
        return site.placeTaxonomy && site.placeTaxonomy.length > 0 && site.placeTaxonomy[0] && site.placeTaxonomy[0].id;
    }
}
