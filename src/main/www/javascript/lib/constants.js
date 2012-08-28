/*
DT = {
	DOMAIN: 'devtrac.ug',
	SERVICE_ENDPOINT: 'http://www.devtrac.ug/services/json',
	API_KEY: '6825f0e79c87f6c930d8b252694ef1cf',
	DATA_REF: '#data',
	SESSION_ID_REF: 'sessid',
	USER_REF: 'user',
	NAME_REF: 'name',
	PASSWORD_REF: 'pass',
	SYSTEM_CONNECT: 'system.connect',
	USER_LOGIN: 'user.login',
	USER_LOGOUT: 'user.logout',
	VIEWS_GET: 'views.get',
    FILE_SAVE: 'file.save',
	PULL_INTERVAL: 86400000,
	NODE_SAVE: 'node.save',
	QUESTIONS_SAVE: 'questionnaire.submit',		
	FILE_UPLOAD_PATH: 'sites/default/files/blackberry/<UID>/'
}
*/
DT = {
    DOMAIN: 'devtrac.org',
    SERVICE_ENDPOINT: 'http://test.devtrac.org/services/json',
    API_KEY: 'ed189296f0507fde20b1b9863c6fc21a',
    DATA_REF: '#data',
    SESSION_ID_REF: 'sessid',
    SESSION_NAME_REF: 'session_name',
    USER_REF: 'user',
    NAME_REF: 'name',
    PASSWORD_REF: 'pass',
    SYSTEM_CONNECT: 'system.connect',
    USER_LOGIN: 'user.login',
    USER_LOGOUT: 'user.logout',
    VIEWS_GET: 'views.get',
    FILE_SAVE: 'file.save',
    PULL_INTERVAL: 86400000,
	NODE_SAVE: 'node.save',
	QUESTIONS_SAVE: 'questionnaire.submit',		
	FILE_UPLOAD_PATH: 'sites/default/files/blackberry/<UID>/'
};

DT_SERVER_ENDPOINT = {
	HOST: 'http://test1.devtrac.org'
};

DT_D7 = {
        TIME_OUT: 90000,
        OPENED_STATUS: "1",
        CLOSED_STATUS: "3",
        NODE_TYPE: {
            SITE: 'ftritem',
            ACTIONITEM: 'actionitem'
        },
        SERVICE_ENDPOINT: DT_SERVER_ENDPOINT.HOST+ '/api/',
        SYSTEM_CONNECT: DT_SERVER_ENDPOINT.HOST+'/api/system/connect.json',
        USER_LOGIN: DT_SERVER_ENDPOINT.HOST+'/api/user/login.json',
        USER_LOGOUT: DT_SERVER_ENDPOINT.HOST+'/api/user/logout.json',
        CURRENT_TRIP: DT_SERVER_ENDPOINT.HOST+'/api/views/api_fieldtrips.json?display_id=current_trip',
        PLACE_TYPES: DT_SERVER_ENDPOINT.HOST+'/api/views/api_vocabularies.json?display_id=placetypes',
        USER_PROFILES: DT_SERVER_ENDPOINT.HOST+'/api/views/api_user.json?display_id=users&offset=0&limit=0&filters[active]=1',
        ACTION_ITEMS: DT_SERVER_ENDPOINT.HOST+'/api/views/api_fieldtrips.json?display_id=actionitems&args[nid]=<FIELD_TRIP_NID>&filters[field_actionitem_status_value]=1&filters[field_actionitem_status_value]=3&args[field_actionitem_ftreportitem_target_id]=<SITE_NID>',
        SITE_PLACES: DT_SERVER_ENDPOINT.HOST+'/api/views/api_fieldtrips.json?display_id=place&filters[nid]=<SITE_NID>',
        SITE_DETAILS: DT_SERVER_ENDPOINT.HOST+'/api/views/api_fieldtrips.json?display_id=sitevisits&filters[field_ftritem_field_trip_target_id]=<FIELD_TRIP_NID>&offset=0&limit=20',
        NODE_SAVE: DT_SERVER_ENDPOINT.HOST+'/api/node/<NODE_ID>.json',
        NODE_CREATE: DT_SERVER_ENDPOINT.HOST+'/api/node.json',
        QUESTIONS: DT_SERVER_ENDPOINT.HOST+'/api/views/api_questions.json?filters[active]=1',
        QUESTIONS_FILTER: DT_SERVER_ENDPOINT.HOST+'/api/views/api_questions.json?offset=0&limit=0&filters[changed]=<SYNC_TIME>',
        SUBMISSION: DT_SERVER_ENDPOINT.HOST+'/api/questionnaire/submit',
        COMMENT: DT_SERVER_ENDPOINT.HOST+'/api/comment.json',
        FILE_SAVE: DT_SERVER_ENDPOINT.HOST+'/api/file'
    };

