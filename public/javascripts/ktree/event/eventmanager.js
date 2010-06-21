goog.provide('ktree.event.EventManager');

goog.require('ktree.config');

goog.require('goog.string');
goog.require('goog.structs.Map');
goog.require('goog.events');
goog.require('goog.net.EventType');
goog.require('goog.net.XhrIoPool');
goog.require('goog.net.XhrIo');

/**
*	@constructor
*/
ktree.event.EventManager = function() {
	this.xhrPool_ = new goog.net.XhrIoPool();
	
	this.behaviorDelegate_ = null;
		
	this.behaviorMap_ = new goog.structs.Map();
	this.triggerMap_ = new goog.structs.Map();
}

ktree.event.EventManager.prototype.addDelegate = function(delegateObject) {
	this.behaviorDelegate_ = delegateObject;
}

ktree.event.EventManager.prototype.getHandlerForObject = function(objectName) {
	var objectLocator = this.locatorForName(objectName);
	var behavior = this.behaviorMap_.get(objectLocator);
	if (!behavior) {
		this.behaviorMap_.set(objectLocator, this.getDefaultBehavior_());
		
		// Now we need to issue an XHR to ask for a non-default behavior
		var xhrCallback = goog.bind(this.xhrStateListener, this, objectLocator);
		this.xhrPool_.getObject(function(xhr) {
			goog.events.listen(xhr, goog.net.EventType.READY_STATE_CHANGE, xhrCallback);
			xhr.send(ktree.config.URL_BASE + ktree.config.URL_COMPONENT_FEATURE_BEHAVIOR + objectLocator + ".json", "GET");
		});
	}
}

/**
*	TODO: There's gotta be a better way to handle the apostrophes...
*	(Non-apostrophe) regexp code is from http://bit.ly/b7yGy8
*	Converts object names into URL-friendly locator strings
*	Example: Sam's Mom -> sams-mom
*	@public
*/
ktree.event.EventManager.prototype.locatorForName = function(name) {
	name = name.toLowerCase();
	// Replace any runs of non-alphanumeric characters with a dash
	name = name.replace(/[^a-z0-9]+/g, '-');
	// Replace any resulting -s- patterns (resulting from apostrophes) with a single s-
	// Thus, a string like sam-s-mom will become sams-mom
	name = name.replace(/-s-/, 's-');
	// Trim off any initial or trailing dashes
	name = name.replace(/^-|-$/g, '');
	return name;
}


ktree.event.EventManager.prototype.updateHandler = function(objectLocator, newHandlerFunction) {
	this.behaviorMap_.set(objectLocator, newHandlerFunction);
}

/**
*	TODO: Calling locatorName every time is inefficient. Need to standardize name/locator conventions
*	Note we are storing behaviors by locator rather than name
*	@public
*/
ktree.event.EventManager.prototype.handleEvent = function(objectName, verb) {
	var locatorName = this.locatorForName(objectName);
	var verbResponseMap = this.behaviorMap_.get(locatorName);
	var verbTriggerMap = this.triggerMap_.get(locatorName);
	
	if(verbTriggerMap) {
		var verbTriggerString = verbTriggerMap.get(verb);
		if (verbTriggerString) {
			try {
				var trigger = goog.json.parse(verbTriggerString);
			}
			catch (error) {
				ktree.debug.logError("EventManager reports that an error was thrown trying to parse a trigger map entry to JSON." +
								 	"Offending string was: <" + verbTriggerMap.get(verb) + ">");
			}
		}
		if(trigger) {
			this.processTriggerActions_(trigger);
		}
	} 
	
	return verbResponseMap.get(verb);
}


ktree.event.EventManager.prototype.processTriggerActions_ = function(json) {
	if (json.add_inventory) {
		this.addToInventory(json.add_inventory);
	}
	if (json.remove_feature) {
		this.removeFeature(json.remove_feature);
	}
	if (json.bind_behavior) {
		this.bindBehavior(json.bind_behavior);
	}
	if (json.to_scene) {
		this.requestScene(json.to_scene, json.to_subscene);
	}
}

ktree.event.EventManager.prototype.addToInventory = function(itemLocator) {
	// Send an XHR to add an item to the inventory
	// TODO Need an event listener for this.
	this.xhrPool_.getObject(function(xhr) {
		// Note we send the key-value pair in the headers rather than the body because headers are easily
		// accessed as a hash map on the Rails side
		xhr.send(ktree.config.URL_BASE + ktree.config.URL_COMPONENT_ADD_TO_INVENTORY, "PUT", null, {"locator": itemLocator});
	});
}

/**
*	TODO: We need to implement a universal addressing scheme rather than using a mix of names/locators
*	TODO: There is a circular dependency between GoogleEarth and EventManager at the moment. Need to clean this up
*		  using an interface or a mediating class.
*	@param {string} featureName		The *name* (note: not locator) of the feature to remove
*/
ktree.event.EventManager.prototype.removeFeature = function(featureName) {
	if (this.behaviorDelegate_) {
		this.behaviorDelegate_.removeKmlFeature(featureName);
		//this.behaviorDelegate_.changeFeatureVisibility(featureName, false);
	}
}

ktree.event.EventManager.prototype.bindBehavior = function(jsonBinding) {
	var xhrCallback = goog.bind(this.xhrStateListener, this, jsonBinding.feature_locator);
	this.xhrPool_.getObject(function(xhr) {
		goog.events.listen(xhr, goog.net.EventType.READY_STATE_CHANGE, xhrCallback);
		xhr.send(ktree.config.URL_BASE + ktree.config.URL_COMPONENT_BIND_BEHAVIOR, "PUT", null, jsonBinding);
	});
}

ktree.event.EventManager.prototype.requestScene = function(scene, subscene) {
	var xhrCallback = goog.bind(this.evaluateResponseScript, this);
	this.xhrPool_.getObject(function(xhr) {
		goog.events.listen(xhr, goog.net.EventType.SUCCESS, xhrCallback)
		xhr.send(ktree.config.URL_BASE + ktree.config.URL_COMPONENT_REQUEST_SCENE, "PUT", null, {"scene": scene, "subscene": subscene});
	});
}

ktree.event.EventManager.prototype.evaluateResponseScript = function(event) {
	var xhr = event.target;
	var script = xhr.getResponseText();
	eval(script);
}


ktree.event.EventManager.prototype.xhrStateListener = function(objectLocator, event) {
	var xhr = event.target;
	if (xhr.isComplete()) {
		if (xhr.isSuccess()) {
			
			// Some features may not have behaviors defined, which would result in an
			// empty response.
			var response = xhr.getResponseJson();
			if (response) {
				// Note that the xhr.getResponseJson method uses goog.json.parse() to do
				// safe parsing. If not a security risk, it would be faster to get the 
				// response text instead and use goog.json.unsafeParse()
				this.storeBehaviorJson_(objectLocator, xhr.getResponseJson());
			}
		}
		else {
			alert('An XHR Request did not complete successfully.');
		}
		this.xhrPool_.releaseObject(xhr);
	}
}

/**
*	TODO Should implement "blend" functionality so that new behaviors only have to override verbs
*	that they have new data for
*	@param {Object} json	A JSON encoded object
*/
ktree.event.EventManager.prototype.storeBehaviorJson_ = function(objectLocator, json) {	
	// FIXME These string.isEmpty tests are needed because the JSON object comes
	// back with empty strings for undefined fields (rather than simply omitting them).
	// Can we get Rails to omit undefined fields?
	
	var verbResponseMap;
	if (!goog.string.isEmpty(json.behavior.look_response)) {
		verbResponseMap = new goog.structs.Map();
		verbResponseMap.set("look", json.behavior.look_response);
	}
	if (!goog.string.isEmpty(json.behavior.interact_response)) {
		if (!verbResponseMap) verbResponseMap = new goog.structs.Map();
		verbResponseMap.set("interact", json.behavior.interact_response);
	}
	if (verbResponseMap) this.behaviorMap_.set(objectLocator, verbResponseMap);
	
	var verbTriggerMap;
	if (!goog.string.isEmpty(json.behavior.look_trigger)) {
		verbTriggerMap = new goog.structs.Map();
		verbTriggerMap.set("look", json.behavior.look_trigger);
	}
	if (!goog.string.isEmpty(json.behavior.interact_trigger)) {
		if (!verbTriggerMap) verbTriggerMap = new goog.structs.Map();
		verbTriggerMap.set("interact", json.behavior.interact_trigger);
	}
	if (verbTriggerMap) this.triggerMap_.set(objectLocator, verbTriggerMap);
}


ktree.event.EventManager.prototype.getDefaultBehavior_ = function() {
	var response = "<h2>Oops!</h2>\n<p>The server is taking an unusually long time to respond. Please try this action again in a moment...</p>";
	var verbMap = new goog.structs.Map();
	verbMap.set("look", response);
	verbMap.set("interact", response);
	return verbMap;
}