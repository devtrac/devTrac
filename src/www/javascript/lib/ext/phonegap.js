/**
 * This represents the PhoneGap API itself, and provides a global namespace for accessing
 * information about the state of PhoneGap.
 * @class
 */
var PhoneGap = {
    queue: {
        ready: true,
        commands: [],
        timer: null
    }
};

/**
 * Adds a plugin object to window.plugins
 */
PhoneGap.addPlugin = function(name, obj) {
	if ( !window.plugins ) {
		window.plugins = {};
	}

	if ( !window.plugins[name] ) {
		window.plugins[name] = obj;
	}
}

PhoneGap.callbackId = 0;
/**
 * Every call to execAsync pushes a handler into the callbacks, keyed
 * on the class name + callbackId
 */
PhoneGap.callbacks = {};

/**
 * Execute a PhoneGap command in a queued fashion, to ensure commands do not
 * execute with any race conditions, and only run when PhoneGap is ready to
 * recieve them.
 * @param {String} command Command to be run in PhoneGap, e.g. "ClassName.method"
 * @param {String[]} [args] Zero or more arguments to pass to the method
 */
PhoneGap.exec = function() {
    var args = '', i, command;
	if (arguments.length === 1) {
		args = arguments[0];
	} else {
		for (i = 0; i < arguments.length; i++) {
			if (typeof(arguments[i]) === "string") {
				args += arguments[i] + '/';
			} else {
				if (typeof(arguments[i])==="object" && arguments[i].length > 1) {
					args += arguments[i].join('/') + '/';
				} else {
					args += arguments[i] + '/';
				}
			}
		}
		args = args.substr(0,args.length-1);
	}
	command = "PhoneGap=" + args;
	//alert(command);
	document.cookie = command;
};

/**
 * Executes native code asynchonously
 * @param {Function} success The function to be called when the async task 
 * completes successfully.
 * @param {Function} fail The function to be called when an error occurs in 
 * the async task.
 * @param {String} clazz The fully qualified class name of the class to call.
 * @param {String} action The the method to call on the class.
 * @param {Object} args The arguments to pass to
 *  the method.
 */
PhoneGap.execAsync = function(success, fail, clazz, action, args) {
    var callbackId = clazz + PhoneGap.callbackId++;
    PhoneGap.callbacks[callbackId] = {success:success, fail:fail};
    document.cookie = JSON.stringify( { 
        clazz:clazz, action:action, callbackId:callbackId, args:args, async:true 
    } );
};

PhoneGap.callbackSuccess = function(callbackId, args) {
    PhoneGap.callbacks[callbackId].success(args);
    delete PhoneGap.callbacks[callbackId];
};

PhoneGap.callbackError = function(callbackId, args) {
    PhoneGap.callbacks[callbackId].fail(args);
    delete PhoneGap.callbacks[callbackId];
};

/**
 * Custom pub-sub channel that can have functions subscribed to it
 */
PhoneGap.Channel = function(type)
{
    this.type = type;
    this.handlers = {};
    this.guid = 0;
    this.fired = false;
    this.enabled = true;
};

/**
 * Subscribes the given function to the channel. Any time that 
 * Channel.fire is called so too will the function.
 * Optionally specify an execution context for the function
 * and a guid that can be used to stop subscribing to the channel.
 * Returns the guid.
 */
PhoneGap.Channel.prototype.subscribe = function(f, c, g) {
    // need a function to call
    if (f == null) { return; }

    var func = f;
    if (typeof c == "object" && f instanceof Function) { func = PhoneGap.close(c, f); }

    g = g || func.observer_guid || f.observer_guid || this.guid++;
    func.observer_guid = g;
    f.observer_guid = g;
    this.handlers[g] = func;
    return g;
};

/**
 * Like subscribe but the function is only called once and then it
 * auto-unsubscribes itself.
 */
PhoneGap.Channel.prototype.subscribeOnce = function(f, c) {
    var g = null, that = this;
    var m = function() {
        f.apply(c || null, arguments);
        that.unsubscribe(g);
    }
    if (this.fired) {
	    if (typeof c == "object" && f instanceof Function) { f = PhoneGap.close(c, f); }
        f.apply(this, this.fireArgs);
    } else {
        g = this.subscribe(m);
    }
    return g;
};

/** 
 * Unsubscribes the function with the given guid from the channel.
 */
PhoneGap.Channel.prototype.unsubscribe = function(g) {
    if (g instanceof Function) { g = g.observer_guid; }
    this.handlers[g] = null;
    delete this.handlers[g];
};

/** 
 * Calls all functions subscribed to this channel.
 */
PhoneGap.Channel.prototype.fire = function(e) {
    var fail = false, item, handler, rv;
    if (this.enabled) {
        for (item in this.handlers) {
            handler = this.handlers[item];
            if (handler instanceof Function) {
                rv = (handler.apply(this, arguments)==false);
                fail = fail || rv;
            }
        }
        this.fired = true;
        this.fireArgs = arguments;
        return !fail;
    }
    return true;
};

/**
 * Calls the provided function only after all of the channels specified
 * have been fired.
 */
PhoneGap.Channel.join = function(h, c) {
    var i = c.length, j = 0, f = function() {
        if (!(--i)) h();
    }
    for ( ; j<i; j++) {
        (!c[j].fired?c[j].subscribeOnce(f):i--);
    }
    if (!i) h();
}


/**
 * onDOMContentLoaded channel is fired when the DOM content 
 * of the page has been parsed.
 */
PhoneGap.onDOMContentLoaded = new PhoneGap.Channel();

/**
 * onNativeReady channel is fired when the PhoneGap native code
 * has been initialized.
 */
PhoneGap.onNativeReady = new PhoneGap.Channel();

/**
 * onDeviceReady is fired only after both onDOMContentLoaded and 
 * onNativeReady have fired.
 */
PhoneGap.onDeviceReady = new PhoneGap.Channel();


// Compatibility stuff so that we can use addEventListener('deviceready')
// and addEventListener('touchstart')
PhoneGap.m_document_addEventListener = document.addEventListener;

document.addEventListener = function(evt, handler, capture) {
    if (evt === 'deviceready') {
        PhoneGap.onDeviceReady.subscribeOnce(handler);
    } else {
        PhoneGap.m_document_addEventListener.call(document, evt, handler, capture);
    }
};

PhoneGap.m_element_addEventListener = Element.prototype.addEventListener;

/**
 * For BlackBerry, the touchstart event does not work so we need to do click
 * events when touchstart events are attached.
 */
Element.prototype.addEventListener = function(evt, handler, capture) {
    if (evt === 'touchstart') {
        evt = 'click';
    }
    PhoneGap.m_element_addEventListener.call(this, evt, handler, capture);
};

// _nativeReady is global variable that the native side can set
// to signify that the native code is ready. It is a global since 
// it may be called before any PhoneGap JS is ready.
if (typeof _nativeReady !== 'undefined') { PhoneGap.onNativeReady.fire(); }

PhoneGap.Channel.join(function() {
    PhoneGap.onDeviceReady.fire();
}, [ PhoneGap.onDOMContentLoaded, PhoneGap.onNativeReady ]);


// Listen for DOMContentLoaded and notify our channel subscribers
document.addEventListener('DOMContentLoaded', function() {
    PhoneGap.onDOMContentLoaded.fire();
}, false);/**
 * This class contains acceleration information
 * @constructor
 * @param {Number} x The force applied by the device in the x-axis.
 * @param {Number} y The force applied by the device in the y-axis.
 * @param {Number} z The force applied by the device in the z-axis.
 */
function Acceleration(x, y, z) {
	/**
	 * The force applied by the device in the x-axis.
	 */
	this.x = x;
	/**
	 * The force applied by the device in the y-axis.
	 */
	this.y = y;
	/**
	 * The force applied by the device in the z-axis.
	 */
	this.z = z;
	/**
	 * The time that the acceleration was obtained.
	 */
	this.timestamp = new Date().getTime();
}

/**
 * This class specifies the options for requesting acceleration data.
 * @constructor
 */
function AccelerationOptions() {
	/**
	 * The timeout after which if acceleration data cannot be obtained the errorCallback
	 * is called.
	 */
	this.timeout = 10000;
}

/**
 * This class provides access to device accelerometer data.
 * @constructor
 */
function Accelerometer() {
	/**
	 * The last known acceleration.
	 */
	this.lastAcceleration = null;
}

/**
 * Asynchronously aquires the current acceleration.
 * @param {Function} successCallback The function to call when the acceleration
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the acceleration data.
 * @param {AccelerationOptions} options The options for getting the accelerometer data
 * such as timeout.

Accelerometer.prototype.getCurrentAcceleration = function(successCallback, errorCallback, options) {
	alert('Accelerometer not supported in PhoneGap BlackBerry - yet.');
};
*/

/**
 * Asynchronously aquires the acceleration repeatedly at a given interval.
 * @param {Function} successCallback The function to call each time the acceleration
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the acceleration data.
 * @param {AccelerationOptions} options The options for getting the accelerometer data
 * such as timeout.
 

Accelerometer.prototype.watchAcceleration = function(successCallback, errorCallback, options) {
	this.getCurrentAcceleration(successCallback, errorCallback, options);
	// TODO: add the interval id to a list so we can clear all watches
	var frequency = (options !== undefined)? options.frequency : 10000;
	return setInterval(function() {
		navigator.accelerometer.getCurrentAcceleration(successCallback, errorCallback, options);
	}, frequency);
}
*/

/**
 * Clears the specified accelerometer watch.
 * @param {String} watchId The ID of the watch returned from #watchAcceleration.
 
Accelerometer.prototype.clearWatch = function(watchId) {
	clearInterval(watchId);
}
*/
if (typeof navigator.accelerometer === "undefined") { navigator.accelerometer = new Accelerometer(); }
/**
 * This class provides access to the device camera.
 * @constructor
 */
function Camera() {
	this.onSuccess = null;
	this.onError = null;
}

/**
 * 
 * @param {Function} successCallback
 * @param {Function} errorCallback
 * @param {Object} options
 */
Camera.prototype.getPicture = function(successCallback, errorCallback, options) {
	if (device.hasCamera) {
		if (successCallback) { this.onSuccess = successCallback; }
		else { this.onSuccess = null; }
		if (errorCallback) { this.onError = errorCallback; }
		else { this.onError = null; }
		PhoneGap.exec("camera", ["picture"]);
	} else { errorCallback("[PhoneGap] Camera not supported on this device."); }
};

if (typeof navigator.camera === "undefined") { navigator.camera = new Camera(); }
/**
 * This class provides access to device Compass data.
 * @constructor
 */
function Compass() {
    /**
     * The last known Compass position.
     */
	this.lastHeading = null;
    this.lastError = null;
	this.callbacks = {
		onHeadingChanged: [],
        onError:           []
    };
}

/**
 * Asynchronously aquires the current heading.
 * @param {Function} successCallback The function to call when the heading
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the heading data.
 * @param {PositionOptions} options The options for getting the heading data
 * such as timeout.
 */
Compass.prototype.getCurrentHeading = function(successCallback, errorCallback, options) {
	if (this.lastHeading === null) {
		this.start(options);
	}
	else 
	if (typeof successCallback === "function") {
		successCallback(this.lastHeading);
	}
};

/**
 * Asynchronously aquires the heading repeatedly at a given interval.
 * @param {Function} successCallback The function to call each time the heading
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the heading data.
 * @param {HeadingOptions} options The options for getting the heading data
 * such as timeout and the frequency of the watch.
 */
Compass.prototype.watchHeading= function(successCallback, errorCallback, options) {
	// Invoke the appropriate callback with a new Position object every time the implementation 
	// determines that the position of the hosting device has changed. 
	var frequency = 100, self;
	
	this.getCurrentHeading(successCallback, errorCallback, options);
    if (typeof(options) === 'object' && options.frequency) {
        frequency = options.frequency;
	}

	return setInterval(function() {
		self.getCurrentHeading(successCallback, errorCallback, options);
	}, frequency);
};


/**
 * Clears the specified heading watch.
 * @param {String} watchId The ID of the watch returned from #watchHeading.
 */
Compass.prototype.clearWatch = function(watchId) {
	clearInterval(watchId);
};


/**
 * Called by the geolocation framework when the current heading is found.
 * @param {HeadingOptions} position The current heading.
 */
Compass.prototype.setHeading = function(heading) {
	var i = 0;
    this.lastHeading = heading;
    for (; i < this.callbacks.onHeadingChanged.length; i++) {
        this.callbacks.onHeadingChanged.shift()(heading);
    }
};

/**
 * Called by the geolocation framework when an error occurs while looking up the current position.
 * @param {String} message The text of the error message.
 */
Compass.prototype.setError = function(message) {
    var i = 0;
    this.lastError = message;
    for (; i < this.callbacks.onError.length; i++) {
        this.callbacks.onError.shift()(message);
    }
};

if (typeof navigator.compass === "undefined") { navigator.compass = new Compass(); }

Compass.prototype.start = function(args) {
    alert('Compass support not implemented - yet.');
};

Compass.prototype.stop = function() {
    alert('Compass support not implemented - yet.');
};
/**
 * This class provides access to the device contacts.
 * @constructor
 */

function Contact(jsonObject) {
    this.name = {
		formatted:''
	};
    this.phones = [];
    this.emails = [];
    this.id = "";
}

Contact.prototype.displayName = function() {
	return this.name.formatted;
};

function Contacts() {
	// Dummy object to hold array of contacts
	this.contacts = [];
	this.timestamp = new Date().getTime();
}

if (typeof navigator.contacts === "undefined") { navigator.contacts = new Contacts(); }

Contacts.prototype.formParams = function(options, startArray) {
	var params = [];
	if (startArray) { params = startArray; }
	if (options.limit && options.limit > 0) { params.push("pageSize:" + options.limit); }
	if (options.page) { params.push("pageNumber:" + options.page); }
	return params;	
};
Contacts.prototype.chooseContact = function(successCallback, options) {
	this.choose_onSuccess = successCallback;
	var params = ["choose"];
	params = this.formParams(options,params);
	PhoneGap.exec("contacts", params);
};
Contacts.prototype.find = function(filter, successCallback, errorCallback, options) {
	if (typeof(filter) !== 'object') {
		alert('[PhoneGap Error] filter parameter passed into navigator.contacts.find must be of type object.');
		return;
	}
	if (filter.name && filter.name.length > 0) {
		var params = ["search"];
		params.push('nameFilter:' + filter.name);
		params = this.formParams(options,params);
		this.search_onSuccess = successCallback;
		this.search_onError = errorCallback;
		PhoneGap.exec("contacts", params);
	} else {
		this.getAllContacts(successCallback,errorCallback,options);
	}
};
Contacts.prototype.getAllContacts = function(successCallback, errorCallback, options) {
	this.global_onSuccess = successCallback;
	this.global_onError = errorCallback;
	var params = ["getall"];
	params = this.formParams(options,params);
	PhoneGap.exec("contacts", params);
};/**
 * this represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
function Device() {
    this.available = false;
    this.platform = null;
    this.version  = null;
    this.name     = null;
    this.phonegap = null;
    this.uuid     = null;
}

navigator.device = window.device = new Device();

Device.prototype.poll = function() {
    var cookie = document.cookie;
    if (cookie != '') {
        eval(cookie);
        PhoneGap.available = (typeof device.name === "string");
        if (PhoneGap.available) {
            PhoneGap.onNativeReady.fire();
        }
    }
    setTimeout(function() {
        device.poll();
    },250);
};

Device.prototype.init = function() {
    this.isIPhone = false;
    this.isIPod = false;
    this.isBlackBerry = true;
    try {
        PhoneGap.exec("initialize");
        this.poll();
    } catch(e) {
        alert("[PhoneGap Error] Error initializing.");
    }
};

window.device.init();/**
 * This class provides generic read and write access to the mobile device file system.
 */

function Log() {
	this.logged = null;
}

if (typeof navigator.log === "undefined") { navigator.log = new Log(); }

Log.prototype.log = function(message, callback) {
	this.logged = callback;
	PhoneGap.exec("log",["log", message]);
};

Log.prototype.debug = function(message, callback) {
	this.logged = callback;
	PhoneGap.exec("log",["debug", message]);
};

Log.prototype.setDebug = function(debugModeOn, callback) {
	this.logged = callback;
	PhoneGap.exec("log",["set.debug", debugModeOn]);
};

Log.prototype.getDebug = function(callback) {
	this.logged = callback;
	PhoneGap.exec("log",["get.debug"]);
};

Log.prototype.show = function(callback) {
	this.logged = callback;
	PhoneGap.exec("log",["show"]);
};

/**
 *  This class provides generic file related utility functions e.g. read as base64.
 */
function File() {
	this.read_success = null;
	this.read_error = null;
}

if (typeof navigator.file === "undefined") { navigator.file = new File(); }

File.prototype.read = function(fileName, successCallback, errorCallback) {
	this.read_success = successCallback;
	this.read_error = errorCallback;
	PhoneGap.exec("file",["read", fileName]);
};

File.prototype.write = function(fileName, data) {
	alert('File I/O not implemented in PhoneGap BlackBerry - yet.');
};
 /**
 *  This class provides generic image file related utility functions e.g. resize.
 */
function Image() {
	this.resize_success = null;
	this.resize_error = null;
}

if (typeof navigator.image === "undefined") { navigator.image = new Image(); }

Image.prototype.resize = function(imagePath, desiredWidth, desiredHeight, successCallback, errorCallback) {
	this.resize_success = successCallback;
	this.resize_error = errorCallback;
	PhoneGap.exec("image",["resize", desiredWidth + 'x' + desiredHeight + '~' + imagePath]);
};


/**
 * This class provides access to device GPS data.
 * @constructor
 */
function Geolocation() {
    /**
     * The last known GPS position.
     */
	this.started = false;
    this.lastPosition = null;
    this.lastError = null;
    this.callbacks = {
        onLocationChanged: [],
        onError:           []
    };
}

/**
 * Asynchronously aquires the current position.
 * @param {Function} successCallback The function to call when the position
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the position data.
 * @param {PositionOptions} options The options for getting the position data
 * such as timeout.
 */
Geolocation.prototype.getCurrentPosition = function(successCallback, errorCallback, options) {
    var referenceTime = 0, timeout = 20000, interval = 500, delay = 0, dis = this, timer;
    if (this.lastPosition) {
        referenceTime = this.lastPosition.timeout;
    } else {
        this.start(options);
    }

    if (typeof(options) === 'object' && options.interval) {
        interval = options.interval;
    }

    if (typeof(successCallback) !== 'function') {
        successCallback = function() {};
    }
    if (typeof(errorCallback) !== 'function') {
        errorCallback = function() {};
    }

    timer = setInterval(function() {
        delay += interval;
        if (dis.lastPosition !== null && dis.lastPosition.timestamp > referenceTime) {
            successCallback(dis.lastPosition);
            clearInterval(timer);
        } else if (delay >= timeout) {
            errorCallback();
            clearInterval(timer);
        }
    }, interval);
};

/**
 * Asynchronously aquires the position repeatedly at a given interval.
 * @param {Function} successCallback The function to call each time the position
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the position data.
 * @param {PositionOptions} options The options for getting the position data
 * such as timeout and the frequency of the watch.
 */
Geolocation.prototype.watchPosition = function(successCallback, errorCallback, options) {
	// Invoke the appropriate callback with a new Position object every time the implementation 
	// determines that the position of the hosting device has changed. 
	var frequency = 10000, that = this;

	this.getCurrentPosition(successCallback, errorCallback, options);

    if (typeof(options) === 'object' && options.frequency) {
        frequency = options.frequency;
    }

	return setInterval(function() {
		that.getCurrentPosition(successCallback, errorCallback, options);
	}, frequency);
};


/**
 * Clears the specified position watch.
 * @param {String} watchId The ID of the watch returned from #watchPosition.
 */
Geolocation.prototype.clearWatch = function(watchId) {
	clearInterval(watchId);
};

/**
 * Called by the geolocation framework when the current location is found.
 * @param {PositionOptions} position The current position.
 */
Geolocation.prototype.setLocation = function(position) {
    var i = 0;
    this.lastPosition = position;
    for (; i < this.callbacks.onLocationChanged.length; i++) {
        this.callbacks.onLocationChanged.shift()(position);
    }
};

/**
 * Called by the geolocation framework when an error occurs while looking up the current position.
 * @param {String} message The text of the error message.
 */
Geolocation.prototype.setError = function(message) {
    var i = 0;
    this.lastError = message;
    for (; i < this.callbacks.onError.length; i++) {
        this.callbacks.onError.shift()(message);
    }
};

if (typeof navigator.geolocation === "undefined") { navigator.geolocation = new Geolocation(); }

/**
 * Starts the GPS of the device
 */
Geolocation.prototype.start = function() {
	if (this.started) {
		return;
	} else {
		PhoneGap.exec("location", ["start"]);
	}
};

/**
 * Stops the GPS of the device
 */
Geolocation.prototype.stop = function() {
	if (!this.started) {
		return;
	} else {
		PhoneGap.exec("location", ["stop"]);
	}
};

/**
 * Maps current location
 */
if (typeof navigator.map === "undefined") { navigator.map = {}; }

navigator.map.show = function() {
	if (navigator.geolocation.lastPosition === null) {
		alert("[PhoneGap] No position to map yet.");
		return;
	} else {
		PhoneGap.exec("location", ["map"]);
	}
};
/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
	call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
	getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
	lastIndex, length, parse, prototype, push, replace, slice, stringify,
	test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
	this.JSON = {};
}

(function () {

	function f(n) {
		// Format integers to have at least two digits.
		return n < 10 ? '0' + n : n;
	}

	if (typeof Date.prototype.toJSON !== 'function') {

		Date.prototype.toJSON = function (key) {

			return isFinite(this.valueOf()) ?
				   this.getUTCFullYear()   + '-' +
				 f(this.getUTCMonth() + 1) + '-' +
				 f(this.getUTCDate())      + 'T' +
				 f(this.getUTCHours())     + ':' +
				 f(this.getUTCMinutes())   + ':' +
				 f(this.getUTCSeconds())   + 'Z' : null;
		};

		String.prototype.toJSON =
		Number.prototype.toJSON =
		Boolean.prototype.toJSON = function (key) {
			return this.valueOf();
		};
	}

	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		gap,
		indent,
		meta = {    // table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		},
		rep;


	function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

		escapable.lastIndex = 0;
		return escapable.test(string) ?
			'"' + string.replace(escapable, function (a) {
				var c = meta[a];
				return typeof c === 'string' ? c :
					'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"' :
			'"' + string + '"';
	}


	function str(key, holder) {

// Produce a string from holder[key].

		var i,          // The loop counter.
			k,          // The member key.
			v,          // The member value.
			length,
			mind = gap,
			partial,
			value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

		if (value && typeof value === 'object' &&
				typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

		if (typeof rep === 'function') {
			value = rep.call(holder, key, value);
		}

// What happens next depends on the value's type.

		switch (typeof value) {
		case 'string':
			return quote(value);

		case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

			return isFinite(value) ? String(value) : 'null';

		case 'boolean':
		case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

			return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

		case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

			if (!value) {
				return 'null';
			}

// Make an array to hold the partial results of stringifying this object value.

			gap += indent;
			partial = [];

// Is the value an array?

			if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

				length = value.length;
				for (i = 0; i < length; i += 1) {
					partial[i] = str(i, value) || 'null';
				}

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

				v = partial.length === 0 ? '[]' :
					gap ? '[\n' + gap +
							partial.join(',\n' + gap) + '\n' +
								mind + ']' :
						  '[' + partial.join(',') + ']';
				gap = mind;
				return v;
			}

// If the replacer is an array, use it to select the members to be stringified.

			if (rep && typeof rep === 'object') {
				length = rep.length;
				for (i = 0; i < length; i += 1) {
					k = rep[i];
					if (typeof k === 'string') {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			} else {

// Otherwise, iterate through all of the keys in the object.

				for (k in value) {
					if (Object.hasOwnProperty.call(value, k)) {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			}

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

			v = partial.length === 0 ? '{}' :
				gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
						mind + '}' : '{' + partial.join(',') + '}';
			gap = mind;
			return v;
		}
	}

// If the JSON object does not yet have a stringify method, give it one.

	if (typeof JSON.stringify !== 'function') {
		JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

			var i;
			gap = '';
			indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

			if (typeof space === 'number') {
				for (i = 0; i < space; i += 1) {
					indent += ' ';
				}

// If the space parameter is a string, it will be used as the indent string.

			} else if (typeof space === 'string') {
				indent = space;
			}

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

			rep = replacer;
			if (replacer && typeof replacer !== 'function' &&
					(typeof replacer !== 'object' ||
					 typeof replacer.length !== 'number')) {
				throw new Error('JSON.stringify');
			}

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

			return str('', {'': value});
		};
	}


// If the JSON object does not yet have a parse method, give it one.

	if (typeof JSON.parse !== 'function') {
		JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

			var j;

			function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (k in value) {
						if (Object.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

			text = String(text);
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function (a) {
					return '\\u' +
						('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

			if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

				j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

				return typeof reviver === 'function' ?
					walk({'': j}, '') : j;
			}

// If the text is not JSON parseable, then a SyntaxError is thrown.

			throw new SyntaxError('JSON.parse');
		};
	}
}());/**
 * This class provides access to the device audio.
 * @constructor
 */
function Audio(src) {
	this.src = src;
	this.loop = false;
	this.error = null;
}

/**
 * This class contains information about any Media errors.
 * @constructor
 */
function MediaError() {
	this.code = null;
	this.message = "";
}

MediaError.MEDIA_ERR_ABORTED        = 1;
MediaError.MEDIA_ERR_NETWORK        = 2;
MediaError.MEDIA_ERR_DECODE         = 3;
MediaError.MEDIA_ERR_NONE_SUPPORTED = 4;

Audio.prototype.play = function(successCallback, errorCallback) {
	
	PhoneGap.exec("media",[this.src]);
};

Audio.prototype.pause = function() {
	alert('Media pausing not implemented - yet.');
};

Audio.prototype.stop = function() {
	alert('Media stopping not implemented - yet.');
};
/**
 * This class contains information about any NetworkStatus.
 * @constructor
 */
function NetworkStatus() {
	this.code = null;
	this.message = "";
}

NetworkStatus.NOT_REACHABLE = 0;
NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK = 1;
NetworkStatus.REACHABLE_VIA_WIFI_NETWORK = 2;

/**
 * This class provides access to device Network data (reachability).
 * @constructor
 */
function Network() {
    /**
     * The last known Network status.
	 * { hostName: string, ipAddress: string, 
		remoteHostStatus: int(0/1/2), internetConnectionStatus: int(0/1/2), localWiFiConnectionStatus: int (0/2) }
     */
	this.lastReachability = null;
}

/**
 * Called by the geolocation framework when the reachability status has changed.
 * @param {Reachibility} reachability The current reachability status.
 */
Network.prototype.updateReachability = function(reachability) {
    this.lastReachability = reachability;
};

if (typeof navigator.network === "undefined") { navigator.network = new Network(); }

Network.prototype.isReachable = function(hostName, successCallback, options) {
	this.isReachable_success = successCallback;
	PhoneGap.exec("network",["reach"]);
};
// Temporary implementation of XHR. Soon-to-be modeled as the w3c implementation.
Network.prototype.XHR = function(URL, POSTdata, successCallback, errorCallback) {
	var req = URL;
	if (POSTdata !== null) {
		req += "|" + POSTdata;
	}
	this.XHR_success = successCallback;
	if(errorCallback){
		this.XHR_error = errorCallback;
	} else {
		this.XHR_error = successCallback;
	}
	PhoneGap.exec("network",["xhr",req]);
};

Network.prototype.XHRUpload = function(URL, data, filepath, loggedinUser, targetPath, successCallback, errorCallback) {
	var req = URL;
	if (data !== null) {
		req += "|" + data;
	}
	if (filepath !== null) {
		req += "~" + JSON.stringify({
			'filePath': filepath,
			'user': loggedinUser,
			'targetPath': targetPath
		});
	}
	this.XHR_success = successCallback;
	if(errorCallback){
		this.XHR_error = errorCallback;
	} else {
		this.XHR_error = successCallback;
	}
	
	PhoneGap.exec("network",["xhrupload",req]);
};
/**
 * This class provides access to notifications on the device.
 */
function Notification() {
	
}

/**
 * Open a native alert dialog, with a customizable title and button text.
 * @param {String} message Message to print in the body of the alert
 * @param {String} [title="Alert"] Title of the alert dialog (default: Alert)
 * @param {String} [buttonLabel="OK"] Label of the close button (default: OK)
 */
Notification.prototype.alert = function(message, title, buttonLabel) {
    // Default is to use a browser alert; this will use "index.html" as the title though
    alert(message);
};

/**
 * Causes the device to blink a status LED.
 * @param {Integer} count The number of blinks.
 * @param {String} colour The colour of the light.
 */
Notification.prototype.blink = function(count, colour) {
	alert('Blink not implemented - yet.');
};

if (typeof navigator.notification === "undefined") { navigator.notification = new Notification(); }

Notification.prototype.vibrate = function(mills) {
	PhoneGap.exec("notification/vibrate",[mills]);
};
Notification.prototype.beep = function(count, volume) {
	PhoneGap.exec("notification/beep",[count]);
};
/**
 * This class provides access to the device orientation.
 * @constructor
 */
function Orientation() {
	/**
	 * The current orientation, or null if the orientation hasn't changed yet.
	 */
	this.currentOrientation = null;
}

/**
 * Set the current orientation of the phone.  This is called from the device automatically.
 * 
 * When the orientation is changed, the DOMEvent \c orientationChanged is dispatched against
 * the document element.  The event has the property \c orientation which can be used to retrieve
 * the device's current orientation, in addition to the \c Orientation.currentOrientation class property.
 *
 * @param {Number} orientation The orientation to be set
 
Orientation.prototype.setOrientation = function(orientation) {
	alert('Orientation not implemented - yet.');
    Orientation.currentOrientation = orientation;
    var e = document.createEvent('Events');
    e.initEvent('orientationChanged', 'false', 'false');
    e.orientation = orientation;
    document.dispatchEvent(e);
};
*/

/**
 * Asynchronously aquires the current orientation.
 * @param {Function} successCallback The function to call when the orientation
 * is known.
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the orientation.
 
Orientation.prototype.getCurrentOrientation = function(successCallback, errorCallback) {
	alert('Orientation not implemented - yet.');
	// If the position is available then call success
	// If the position is not available then call error
};
*/

/**
 * Asynchronously aquires the orientation repeatedly at a given interval.
 * @param {Function} successCallback The function to call each time the orientation
 * data is available.
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the orientation data.
 
Orientation.prototype.watchOrientation = function(successCallback, errorCallback) {
	// Invoke the appropriate callback with a new Position object every time the implementation 
	// determines that the position of the hosting device has changed. 
	this.getCurrentPosition(successCallback, errorCallback);
	return setInterval(function() {
		navigator.orientation.getCurrentOrientation(successCallback, errorCallback);
	}, 10000);
};
*/

/**
 * Clears the specified orientation watch.
 * @param {String} watchId The ID of the watch returned from #watchOrientation.
 
Orientation.prototype.clearWatch = function(watchId) {
	clearInterval(watchId);
};
*/

if (typeof navigator.orientation === "undefined") { navigator.orientation = new Orientation(); }

function Position(coords) {
	this.coords = coords;
    this.timestamp = new Date().getTime();
}

function Coordinates(lat, lng, alt, acc, head, vel, altAcc) {
	/**
	 * The latitude of the position.
	 */
	this.latitude = lat;
	/**
	 * The longitude of the position,
	 */
	this.longitude = lng;
	/**
	 * The accuracy of the position.
	 */
	this.accuracy = acc;
	/**
	 * The altitude of the position.
	 */
	this.altitude = alt;
	/**
	 * The direction the device is moving at the position.
	 */
	this.heading = head;
	/**
	 * The velocity with which the device is moving at the position.
	 */
	this.speed = vel;
	/**
	 * The altitude accuracy of the position.
	 */
	this.altitudeAccuracy = (altacc != 'undefined') ? altacc : null; 
}

/**
 * This class specifies the options for requesting position data.
 * @constructor
 */
function PositionOptions() {
	/**
	 * Specifies the desired position accuracy.
	 */
	this.enableHighAccuracy = true;
	/**
	 * The timeout after which if position data cannot be obtained the errorCallback
	 * is called.
	 */
	this.timeout = 10000;
}

/**
 * This class contains information about any GSP errors.
 * @constructor
 */
function PositionError() {
	this.code = null;
	this.message = "";
}

PositionError.UNKNOWN_ERROR = 0;
PositionError.PERMISSION_DENIED = 1;
PositionError.POSITION_UNAVAILABLE = 2;
PositionError.TIMEOUT = 3;
/**
 * This class provides access to the device SMS functionality.
 * @constructor
 */
function Sms() {
	this.success = null;
	this.error = null;
}

/**
 * Sends an SMS message.
 * @param {Integer} number The phone number to send the message to.
 * @param {String} message The contents of the SMS message to send.
 * @param {Function} successCallback The function to call when the SMS message is sent.
 * @param {Function} errorCallback The function to call when there is an error sending the SMS message.
 * @param {PositionOptions} options The options for accessing the GPS location such as timeout and accuracy.
 */
Sms.prototype.send = function(number, message, successCallback, errorCallback, options) {
	var params = [number];
	params.push(message);
	this.success = successCallback;
	this.error = errorCallback;
	PhoneGap.exec("send", params);
};

if (typeof navigator.sms === "undefined") { navigator.sms = new Sms(); }
function Store() {
	this.save_success = null;
	this.save_error = null;
	this.loadAll_success = null;
	this.loadAll_error = null;
	this.load_success = null;
	this.load_error = null;
	this.remove_success = null;
	this.remove_error = null;
	this.nuke_success = null;
	this.nuke_error = null;
}

Store.prototype.getAll = function(successCallback,errorCallback) {
	// Wrap the success callback with a little object parses that decodes the keys and composes into a new JSON obj.
	// We do this because we encode all keys as they go into offline storage, so we have to decode on the way back.
	this.loadAll_success = function(obj){
		var trueObj = {}, prop;
		for (prop in obj) {
		    if (obj.hasOwnProperty(prop)) {
			    trueObj[decodeURIComponent(prop)] = obj[prop];
			}
		}
		successCallback(trueObj);
	};
	this.loadAll_error = errorCallback;
	PhoneGap.exec("store",["loadAll"]);
};

Store.prototype.put = function(successCallback,errorCallback,key,data) {
	this.save_success = successCallback;
	this.save_error = errorCallback;
	PhoneGap.exec("store",["save",encodeURIComponent(key),data]);
};

Store.prototype.get = function(successCallback,errorCallback,key) {
	this.load_success = successCallback;
	this.load_error = errorCallback;
	PhoneGap.exec("store",["load",encodeURIComponent(key)]);
};

Store.prototype.remove = function(successCallback, errorCallback, key) {
	this.remove_success = successCallback;
	this.remove_error = errorCallback;
	PhoneGap.exec("store", ["remove",encodeURIComponent(key)]);
};

Store.prototype.nuke = function(successCallback, errorCallback) {
	this.nuke_success = successCallback;
	this.nuke_error = errorCallback;
	PhoneGap.exec("store", ["nuke"]);
};

if (typeof navigator.store === "undefined") { navigator.store = new Store(); }

/**
 * This class provides access to the telephony features of the device.
 * @constructor
 */
function Telephony() {
	
}

/**
 * Calls the specifed number.
 * @param {Integer} number The number to be called.
 */
Telephony.prototype.send = function(number) {
	this.number = number;
	PhoneGap.exec("call", [this.number]);
};

if (typeof navigator.telephony === "undefined") { navigator.telephony = new Telephony(); }
function Utility() { }

/**
 * Closes the application.
 */
Utility.prototype.exit = function() {
	var params = [];
	PhoneGap.exec("exit", params);
};

if (typeof navigator.utility === "undefined") { navigator.utility = new Utility(); }
