function DataPull(){
    this.fieldTrip = new FieldTrip();
    this.sites = [];
    this.sitesForActionItems = [];
}

DataPull.prototype.questions = function(callback, byFilter){
    $("#status").html("");
    navigator.log.debug("Requesting question download.");
    var questionSuccess = function(questionResponse){
        var questionResponse = {"#data": questionResponse};
        if (devtrac.common.hasError(questionResponse)) {
            devtrac.common.logAndShowGenericError(devtrac.common.getErrorMessage(questionResponse));
            callback();
        }
        else {
            navigator.log.debug("Received questions response.");
            var questions = $.map(questionResponse['#data'], function(item){
                var question = new Question();
                question.id = item.nid;
                question.title = item.title;
                question.type = item.questionnaire_question_type["und"][0]["value"];
                question.options = item.questionnaire_question_options["und"];
                for (var index in item.taxonomy_vocabulary_1["und"]) {
                    var questionTaxonomy = new QuestionTaxonomy();
                    var placeTypeId = item.taxonomy_vocabulary_1["und"][index]['tid'];
                    questionTaxonomy.id = placeTypeId;
                    questionTaxonomy.name = devtrac.dataPull.getPlaceTypeNameBy(placeTypeId);
                    question.taxonomy.push(questionTaxonomy);
                }
                navigator.log.debug("Processed question with id: " + question.id);
                return question;
            });

            var allQuestions = [];
            if(byFilter){
                    allQuestions = devtrac.questions.concat(questions);
            }else{
                allQuestions = questions;
            }

            navigator.store.put(function(){
                devtrac.dataPull.updateStatus("Downloaded " + questions.length + " questions from server.");
                devtrac.dataPull.updateStatus("Retrieved " + devtrac.questions.length + " questions locally.");
                devtrac.dataPull.updateStatus("Totally saved " + allQuestions.length + " questions successfully.");
                devtrac.questions = allQuestions;
                var now = new Date();
                var lastSyncTime = Validator.dateToStringWithFormat(now, "yyyy-mm-dd");
                devtrac.dataStore.saveLastSyncTime(lastSyncTime);
                if(!byFilter){
                    devtrac.dataPull.placeTypes(callback);
                }else{
                    callback();
                }
            }, function(){
                devtrac.dataPull.updateStatus("Error in saving questions");
                navigator.log.log("Error in saving questions");
                callback();
            }, "questions", JSON.stringify(allQuestions));
        }
    };

    var questionFailed = function(){
        navigator.log.debug("Downloading of questions failed.");
        callback();
    };

    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving questions from devtrac.");
    if(byFilter){
        var syncTimeCallBack = function(){
            devtrac.remoteView.get(DT_D7.QUESTIONS_FILTER.replace('<SYNC_TIME>', devtrac.lastSyncTime), questionSuccess, questionFailed);
        }
        devtrac.dataStore.getLastSyncTime(syncTimeCallBack);
    }else{
        devtrac.remoteView.get(DT_D7.QUESTIONS, questionSuccess, questionFailed);
    }
}

DataPull.prototype.placeTypes = function(callback){
    navigator.log.debug("Requesting places to download.");
    var placesSuccess = function(placesResponse){
        placesResponse = {"#data": placesResponse};
        if (devtrac.common.hasError(placesResponse)) {
            devtrac.common.logAndShowGenericError(devtrac.common.getErrorMessage(placesResponse));
            callback();
        }
        else {
            navigator.log.debug("Received places response");
            var places = $.map(placesResponse['#data'], function(item){
                var placeType = new PlaceType();
                placeType.id = item.tid;
                placeType.name = item.taxonomy_term_data_name;
                placeType.parentId = item.taxonomy_term_data_taxonomy_term_hierarchy_tid ? item.taxonomy_term_data_taxonomy_term_hierarchy_tid : item.tid;
                navigator.log.debug("Processed place with id: " + placeType.id);
                return placeType;
            });

            navigator.store.put(function(){
                devtrac.dataPull.updateStatusAndLog("Saved " + places.length + " place types successfully.", navigator.log.debug);
                devtrac.places = places;
                devtrac.common.initialTaxonomy();
                navigator.store.put(function(){
                     navigator.log.log("Saved questionnaire types successfully.");
                },function(){
                     navigator.log.log("Error occured in saving questionnaire types.");
                },"questions", JSON.stringify(devtrac.questions));
                devtrac.dataPull.userProfiles(callback);
            }, function(){
                devtrac.dataPull.updateStatusAndLog("Error in saving place types", navigator.log.log);
                callback();
            }, "placeTypes", JSON.stringify(places));

        }
    };

    var placesFailed = function(){
        navigator.log.log("Error occured in places download.");
        callback();
    };

    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving place types.");
    devtrac.remoteView.get(DT_D7.PLACE_TYPES, placesSuccess, placesFailed);
}


DataPull.prototype.userProfiles = function(callback){
    navigator.log.debug("Requesting user profiles download.");
    var profilesSuccess = function(profilesResponse){
        profilesResponse = {"#data": profilesResponse};
        if (devtrac.common.hasError(profilesResponse)) {
            devtrac.common.logAndShowGenericError(devtrac.common.getErrorMessage(profilesResponse));
            callback();
        }
        else {
            navigator.log.debug("Received user profiles response.");
            var profiles = $.map(profilesResponse['#data'], function(item){
                var profile = new UserProfile();
                profile.uid = item.uid;
                profile.name = item.realname_realname;
                profile.username = item.users_name;
                navigator.log.debug("Processed user profile with id: " + profile.id);
                return profile;
            });

            navigator.store.put(function(){
                devtrac.dataPull.updateStatus("Saved " + profiles.length + " user profiles successfully.");
                navigator.log.debug("Saved " + profiles.length + " user profiles successfully.");
                devtrac.profiles = profiles;
                callback();
            }, function(){
                devtrac.dataPull.updateStatus("Error in saving user profiles");
                navigator.log.log("Error in saving user profiles");
                callback();
            }, "profiles", JSON.stringify(profiles));

        }
    };

    var profilesFailed = function(){
        navigator.log.log("Error occured in downloading user profiles.");
        // Failed. Continue with callback function.
        callback();
    };

    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving user profiles types.");
    devtrac.remoteView.get(DT_D7.USER_PROFILES, profilesSuccess, profilesFailed);
}

DataPull.prototype.tripDetails = function(callback){
    $("#status").html("");
    navigator.log.debug("Requesting trip details.");
    var tripSuccess = function(tripResponse){
        navigator.log.debug("Received trip details response.");
        if (tripResponse.length > 0) {
            devtrac.dataPull.fieldTrip.id = tripResponse[0]["nid"];
            devtrac.dataPull.fieldTrip.title = tripResponse[0]["title"];
            devtrac.dataPull.fieldTrip.startDate = tripResponse[0]["field_fieldtrip_start_end_date"]["und"][0]["value"];
            devtrac.dataPull.fieldTrip.endDate = tripResponse[0]["field_fieldtrip_start_end_date"]["und"][0]["value2"];
            devtrac.dataPull.saveFieldtrip(null, "");
            devtrac.dataPull.tripSiteDetails(callback);
            navigator.log.debug("Processed trip with id: " + devtrac.dataPull.fieldTrip.id);
            return;
        }
        alert("You don't have any active field trip. Please create a field trip.");
        devtrac.loginController.logout();
    };

    var tripFailed = function(){
        navigator.log.log("Error occured in downloading trip details.");
        // Failed. Continue with callback function.
        callback()();
    };

    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving field trip information.");
    devtrac.remoteView.get(DT_D7.CURRENT_TRIP, tripSuccess, tripFailed);

}

DataPull.prototype.tripSiteDetails = function(callback){
    navigator.log.debug("Requesting trip site details.");
    var siteSuccess = function(siteResponse){
        siteResponse = {"#data": siteResponse};
        if (devtrac.common.hasError(siteResponse)) {
            devtrac.common.logAndShowGenericError(devtrac.common.getErrorMessage(siteResponse));
            callback();
        }
        else {
            navigator.log.debug("Received trip site details response.");
            var sites = $.map(siteResponse['#data'], function(item){
                var site = new Site();
                site.id = item.nid;
                site.name = item.title;

                var places = devtrac.dataPull.undNode(item, "field_ftritem_place", []);
                site.placeId = devtrac.dataPull.getFieldFromJsonArray(places, "target_id", site.placeId);

                var narrative = devtrac.dataPull.undNode(item, "field_ftritem_narrative", []);
                site.narrative = devtrac.dataPull.getFieldFromJsonArray(narrative, "value", site.narrative);

                var dateVisited = devtrac.dataPull.undNode(item, "field_ftritem_date_visited", []);
                Site.setDateVisited(site, devtrac.dataPull.getFieldFromJsonArray(dateVisited, "value", site.dateVisited));

                var lat_long = devtrac.dataPull.undNode(item, "field_ftritem_lat_long", []);
                site.placeGeo = devtrac.dataPull.getFieldFromJsonArray(lat_long, "wkt", site.placeGeo);

                navigator.log.debug("Processed site with id: " + site.id);
                devtrac.dataPull.sites.push(site);
                return site;
            });
            devtrac.dataPull.fieldTrip.sites = sites;
            if (sites.length == 0) {
                return;
            }
            devtrac.dataPull.saveFieldtrip(null, "with sites");
            navigator.log.debug("Requesting details of place for sites.");
            devtrac.dataPull.placeDetailsForSite(callback);
        }
    };

    var siteFailed = function(){
        navigator.log.log("Error occured in downloading site details.");
        // Failed. Continue with callback function.
        callback();
    };

    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving sites for '" + devtrac.dataPull.fieldTrip.title + "'.");
    devtrac.remoteView.get(DT_D7.SITE_DETAILS.replace('<FIELD_TRIP_NID>', devtrac.dataPull.fieldTrip.id), siteSuccess, siteFailed);
}

DataPull.prototype.placeDetailsForSite = function(callback){
    if (devtrac.dataPull.sites.length == 0) {
        navigator.log.debug("No sites to process. Resuming.");
        callback();
        return;
    }

    var site = devtrac.dataPull.sites.pop();
    navigator.log.debug("Requesting place details for site: " + site.id);
    var placeSuccess = function(placeResponse){
        placeResponse = {"#data": placeResponse};
        if (devtrac.common.hasError(placeResponse)) {
            devtrac.common.logAndShowGenericError(devtrac.common.getErrorMessage(placeResponse));
            callback();
        }
        else {
            navigator.log.debug("Received place details for site: " + site.id);
            if (placeResponse["#data"].length > 0) {
                var placeDetails = placeResponse["#data"][0];
                site.placeId = placeDetails.nid;
                site.placeName = placeDetails.title;

                var persons = devtrac.dataPull.undNode(placeDetails, "field_place_responsible_person", []);
                site.contactInfo.name = devtrac.dataPull.getFieldFromJsonArray(persons, "value", site.contactInfo.name);

                var phones = devtrac.dataPull.undNode(placeDetails, "field_place_phone", []);
                site.contactInfo.phone = devtrac.dataPull.getFieldFromJsonArray(phones, "value", site.contactInfo.phone);

                var emails = devtrac.dataPull.undNode(placeDetails, "field_place_email", []);
                site.contactInfo.email = devtrac.dataPull.getFieldFromJsonArray(emails, "email", site.contactInfo.email);

                site.placeTaxonomy = [];
                var taxonomies = devtrac.dataPull.undNode(placeDetails, "taxonomy_vocabulary_1", []);
                for (var index in taxonomies) {
                    var item = taxonomies[index];
                    var placeType = devtrac.dataPull.getPlaceTypeFor(item.tid);
                    if (placeType) {
                        var placeTaxonomy = new PlaceTaxonomy();
                        placeTaxonomy.id = item.tid;
                        placeTaxonomy.name = item.name;
                        site.type = placeType.name;
                        site.placeTaxonomy.push(placeTaxonomy);
                        break;
                    }
                }
            }

            $.each(devtrac.dataPull.fieldTrip.sites, function(index, siteFromCollection){
                if (siteFromCollection.id == site.id) {
                    devtrac.dataPull.fieldTrip.sites[index] = site;
                    devtrac.dataPull.sitesForActionItems.push(site);
                    if (devtrac.dataPull.sites.length > 0) {
                        navigator.log.debug("Requesting place details for next site.");
                        devtrac.dataPull.placeDetailsForSite(callback);
                    }
                    else {
                        navigator.log.debug("Retrieved place details for all sites. Moving on to action item details.");
                        devtrac.dataPull.actionItemDetailsForSite(callback);
                    }
                }
            });
        }
    };

    var placeFailed = function(){
        navigator.log.log("Error occured in downloading place details for site.");
        // Failed. Continue with callback function.
        callback();
    };

    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving site details for '" + site.name + "'.");
    devtrac.remoteView.get(DT_D7.SITE_PLACES.replace('<SITE_NID>', site.id), placeSuccess, placeFailed);
}


DataPull.prototype.actionItemDetailsForSite = function(callback){
    if (devtrac.dataPull.sitesForActionItems.length == 0) {
        navigator.log.debug("No sites to process for action items. Resuming.");
        callback();
        return;
    }
    var site = devtrac.dataPull.sitesForActionItems.pop();
    navigator.log.debug("Requesting action item details for site: " + site.id);
    var actionItemSuccess = function(actionItemResponse){
        actionItemResponse = {"#data": actionItemResponse};
        if (devtrac.common.hasError(actionItemResponse)) {
            devtrac.common.logAndShowGenericError(devtrac.common.getErrorMessage(actionItemResponse));
            callback();
        }
        else {
            var actionItems = $.map(actionItemResponse['#data'], function(item){
                var actionItem = new ActionItem();
                actionItem.title = item.title;
                actionItem.id = item.nid;

                var status = devtrac.dataPull.undNode(item, "field_actionitem_status", []);
                actionItem.status = devtrac.dataPull.getFieldFromJsonArray(status, "value", actionItem.status);

                var tasks = devtrac.dataPull.undNode(item, "field_actionitem_followuptask", []);
                actionItem.task = devtrac.dataPull.getFieldFromJsonArray(tasks, "value", actionItem.task);

                actionItem.assignedTo = $.map(devtrac.dataPull.undNode(item, "field_actionitem_responsible", []), function(user){
                    return user.target_id;
                }).join(", ");
                actionItem.uploaded = true;
                actionItem.uid = item.uid;
                navigator.log.debug("Processed action item: " + actionItem.title);
                return actionItem;
            });
            site.actionItems = actionItems;
            $.each(devtrac.dataPull.fieldTrip.sites, function(index, siteFromCollection){
                if (siteFromCollection.id == site.id) {
                    devtrac.dataPull.fieldTrip.sites[index] = site;
                    if (devtrac.dataPull.sitesForActionItems.length > 0) {
                        navigator.log.debug("More sites available. Continuing to fetch action items.");
                        devtrac.dataPull.actionItemDetailsForSite(callback);
                    }
                    else {
                        navigator.log.debug("Finished downloading action items. Saving fieldtrip.");
                        devtrac.dataPull.saveFieldtrip(callback, "with actionItems");
                    }
                }
            });
        }
    };

    var actionItemFailed = function(){
        navigator.log.debug("Error occured while downloading action items.");
        // Failed. Continue with callback function.
        callback();
    };

    screens.show("pull_status");
    devtrac.dataPull.updateStatus("Retrieving action item details for '" + site.name + "'.");
    var url = DT_D7.ACTION_ITEMS.replace('<SITE_NID>', site.id);
    url = url.replace('<FIELD_TRIP_NID>', devtrac.dataPull.fieldTrip.id);
    devtrac.remoteView.get(url, actionItemSuccess, actionItemFailed);
}

DataPull.prototype.undNode = function(node, field, defaultValue) {
    return (node && node[field] && node[field]["und"]) ? node[field]["und"] : defaultValue;
}

DataPull.prototype.getFieldFromJsonArray = function(array, field, defaultValue){
    return((array.length > 0) && array[0][field]) ? array[0][field] : defaultValue;
}

DataPull.prototype.updateStatusAndLog = function(message, logCallback){
    devtrac.dataPull.updateStatus(message);
    logCallback(message);
}

DataPull.prototype.updateStatus = function(message){
    var status = $("#status");
    status.append(message);
    status.append("<br/>");
    navigator.log.log(message);
}

DataPull.prototype.getPlaceTypeFor = function(id){
    for (var index in devtrac.places) {
        var place = devtrac.places[index];
        if (id == place.id) {
            return place;
        }
    }
}

DataPull.prototype.getPlaceTypeNameBy = function(id){
    for (var index in devtrac.places) {
        var place = devtrac.places[index];
        if (id == place.id) {
            return place && place.name;
        }
    }
    return "undefined name";
}

DataPull.prototype.saveFieldtrip = function(callback, submsg){
    navigator.store.put(function(){
        devtrac.dataPull.updateStatus("Saved field trip '" + devtrac.dataPull.fieldTrip.title + "' " + submsg + " successfully.");
        if(callback) {
            callback();
        }
    }, function(){
        devtrac.dataPull.updateStatus("Error in saving field trip.");
        if(callback){
          callback();
        }
    }, devtrac.user.name, JSON.stringify(devtrac.dataPull.fieldTrip));
}

var QuestionTypes = function(questions){
    this.questions = questions;
    var that = this;

    this.locationTypes = function(){
        var types = $.map(that.questions, function(q){
             if( q.taxonomy[0].name.indexOf("undefined name")==-1)
                return q.taxonomy[0].name;
        });
        return $.unique(types);
    }
}
