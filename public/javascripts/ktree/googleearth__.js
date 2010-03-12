goog.provide('ktree.GoogleEarth');

goog.require('ktree.debug');
goog.require('ktree.earth.Gamepad');
goog.require('ktree.earth.LatLon');
goog.require('ktree.event.EventManager');
goog.require('ktree.event.BehaviorDelegate');
goog.require('ktree.kml.constants');
goog.require('ktree.kml.KtxCache');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.structs.Map');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.net.XhrIo');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Button');


/**
*	@fileoverview
*	Implements the bridge between KarunaTree and the Google Earth API.
*	This is the only place in the system where direct calls to the
*	Earth API should be issued.
*
*	Last version update: 02.26.10
*
*	@version 0.4
*	@author Derek Lyons
*/

/**
*	Create a new GoogleEarth object, attached to an initialized instance
*	of the GoogleEarth API.
*
*	@constructor
*/
ktree.GoogleEarth = function(identifier) {
		
	/**
	*	A string to uniquely identify this GoogleEarth object
	*	@private
	*	@type {string}
	*/
	this.identifier_ = identifier;
	
	/**
	*	The Google Earth API instance associated with this object.
	*	@private
	*/
	this.ge_;
		
	/**
	*	Flag indicating whether or not the Google Earth API instance is
	*	initialized and ready for commands
	*	@private
	*	@type {boolean}
	*/
	this.geReady_ = false;
	
	/**
	*	Object used to send XHR requests back to the KarunaTree server
	*	@private
	*	@type {goog.net.XhrIo}
	*/
	
	this.xhr_ = new goog.net.XhrIo();
	
	this.eventManager_ = new ktree.event.EventManager();
	this.eventManager_.addDelegate(this);
	
	this.gamepad_ = null;
	
	// Keep track of Sam's position
	this.LAT_KEY = "latitude";
	this.LON_KEY = "longitude";
	this.ALT_KEY = "altitude"
	this.samPosition_ = new goog.structs.Map();
	this.samPosition_.set(this.LAT_KEY, -109.7641368831581);
	this.samPosition_.set(this.LON_KEY, 38.68527824559933);
	this.samPosition_.set(this.ALT_KEY, 0);
	
	/**
	*	A temporary reference to this *particular* GoogleEarth object needed to 
	*	allow the initialization callback chain to reach this object again.
	*	@private
	*/
	var target_ = this;
		
	/**
	*	Callback to begin initialization of the Google Earth API instance,
	*	providing further callbacks for success and failure
	*	@private	
	*/
	var initializeAPI_ = function() {
		ktree.debug.logFine('GoogleEarth <' + target_.identifier_ + '> received its google.OnLoadCallback.');
		google.earth.createInstance('earth', apiInitSuccess_, apiInitFailure_);
	}
	
	/**
	*	If the API initializes successfully, set up its basic parameters
	*	@private
	*	@param instance The initialized earth API instance
	*/
	var apiInitSuccess_ = function(instance) {
		ktree.debug.logFine('GoogleEarth <' + target_.identifier_ + '> reports successful Earth API initialization.');
		target_.ge_ = instance;
		target_.geReady_ = true;
		target_.ge_.getWindow().setVisibility(true);
		target_.ge_.getSun().setVisibility(false);
		target_.ge_.getOptions().setAtmosphereVisibility(true);
		target_.ge_.getNavigationControl().getScreenXY().setXUnits(target_.ge_.UNITS_PIXELS);
		target_.ge_.getNavigationControl().getScreenXY().setYUnits(target_.ge_.UNITS_PIXELS);
		target_.ge_.getNavigationControl().setVisibility(target_.ge_.VISIBILITY_AUTO);
		target_.gamepad_ = new ktree.earth.Gamepad(target_.ge_);
	};

	/**
	*	If the API fails to initialize, provide an error message
	*	@private
	*	@param errorCode An error message from the Earth API
	*/
	var apiInitFailure_ = function(errorCode) {
		ktree.debug.logError('GoogleEarth <' + target_.identifier_ + '> reports that Earth API initialization failed.');
		ktree.debug.logError('API error code as follows:' + errorCode);
	};
	
	// Finally! Start the process of setting up the Earth API
	google.load("earth", "1");
	google.setOnLoadCallback(initializeAPI_);
}


/**
*	Returns whether or not the Google Earth API is initialized and ready for commands
*	@public
*	@return {boolean}
*/
ktree.GoogleEarth.prototype.apiReady = function() {
	return this.geReady_;
}


/**
*	Installs a KTX cache for the World. Should only be called by the KmlManager.
*	@public
*	@params {ktree.kml.KtxCache}	The KtxCache to install
*/
ktree.GoogleEarth.prototype.installKtxCache = function(ktxCache) {
	this.ktxCache_ = ktxCache;
}


/**
*	TODO This method should be removed to enforce encapsulation
*
*	Returns a pointer to the GoogleEarth plugin
*	@public
*/
ktree.GoogleEarth.prototype.getPlugin = function() {
	return this.ge_;
}

ktree.GoogleEarth.prototype.getCurrentVerb = function() {
	return "interact";
}


/**
*	TODO Need to remove hard-coded reference to Chapter 1
*
*	Adds the contents of a KML string to a specified parent KmlContainer within
*	the GE plugin. If no parent is specified, the KML is added to the top-level
*	of the plugin itself. Note that if the KML string defines a Camera or a LookAt, 
*	the plugin's current view is set accordingly.
*	@public
*	@param {string} kmlString		A string of valid KML
*	@param {string} parentName		Optional. The name of a KmlContainer to which the new KML should be parented
*/
ktree.GoogleEarth.prototype.addKml = function(kmlString, parentName) {
	var kmlObject = this.kmlStringToObject_(kmlString);
	
	var parentContainer;
	if (parentName) {
		parentContainer = this.tryRetrievingKmlFeature_(parentName);
		if (!parentContainer) {
			parentContainer = this.createKmlFolder_("Chapter 1");
		}
	}
	else {
		// If no parent container is specified, parent the new KML to the top-level of the plugin
		parentContainer = this.ge_;
	}
	
	parentContainer.getFeatures().appendChild(kmlObject);
	
	this.runKtxCommandsForObject_(kmlObject, true);
	var objectView = kmlObject.getAbstractView();
	if (objectView) {
		this.updateView_(objectView);
	}
	
	if (ktree.config.ENABLE_SERIALIZATION) this.serializeKmlToServer_();
}

ktree.GoogleEarth.prototype.removeKmlFeature = function(featureName) {
	var feature = this.tryRetrievingKmlFeature_(featureName);
	if (feature) {
		var parent = feature.getParentNode();
		// This will only work if parent is a KmlContainer
		if (this.typeIsContainer_(parent.getType())) {
			parent.getFeatures().removeChild(feature);
		}
		else {
			ktree.debug.logError("Can't remove a feature from parent object of type <" + parent.getType() + ">.\n" +
									"Feature to be removed was <" + featureName + ">, with parent <" + parent.getName() + ">");
		}
	}
}


/**
*	Set the camera's fly-to speed
*	@public
*	@param {float} speed	The desired fly-to speed. Accepts a float from 0.0 to 5.0, inclusive.
*/
ktree.GoogleEarth.prototype.setFlyToSpeed = function(speed) {
	if (!ktree.config.ENABLE_FLY_TO_SPEED) {
		return;
	}
	if (speed == ktree.kml.constants.SPEED_TELEPORT) {
		speed = this.ge_.SPEED_TELEPORT;
	}
	if (speed < 0.0 || speed > 5.0) {
		ktree.debug.logWarning("GoogleEarth received an invalied flyToSpeed request of <" + speed + ">. Camera speed is limited to 0.0 to 5.0, inclusive.");
		return;
	}
	this.ge_.getOptions().setFlyToSpeed(speed);
}


/**
*	TODO First pass. this is currently inefficient because it passes all of the plugin's KML
*	repeatedly to the server.
*
*	Uses an XHR request to asynchronously post the plugin's KML state back to the KarunaTree server
*	@private
*/
ktree.GoogleEarth.prototype.serializeKmlToServer_ = function() {
	var kmlString = this.retrieveKmlFeature_("Chapter 1").getKml();
	this.xhr_.send("http://localhost:3000/play/save", "POST", "kml=" + kmlString);
	
	//TODO This can be used to send the KML as XML rather than as a string.
	//Could we save this to the database using a RESTful controller?
	//var headers = new goog.structs.Map();
	//headers.set(goog.net.XhrIo.CONTENT_TYPE_HEADER, "text/xml");
	//this.xhr_.send("http://localhost:3000/play/save", "POST", kmlString, headers);
}


/**
*	Recurrent function parses through a KmlObject and all of its children, running any KTX commands
*	that have been cached for any of the nodes. Optionally uses the abstract view associated
*	with the argument KmlObject to update the current view.
*	@private
*	@param {KmlObject} kmlObject		The KmlObject to process
*	@param {boolean} shouldUpdateView	If true, attempts to use the abstract view associated with
*										kmlObject to update the plugin's view
*/
ktree.GoogleEarth.prototype.runKtxCommandsForObject_ = function(kmlObject, shouldUpdateView) {
	var objectType = kmlObject.getType();
	
	// The contents of containers (KmlFolders and KmlDocuments) need to be recursively post-processed
	if (this.typeIsContainer_(objectType)) {
		var childObjectList = kmlObject.getFeatures().getChildNodes();
		var numChildren = childObjectList.getLength();
		for (var i = 0; i < numChildren; i++) {
			this.runKtxCommandsForObject_(childObjectList.item(i), shouldUpdateView);
		}
	}
	
	// Placemarks need to have click handlers installed
	else if (this.typeIsClickable_(objectType)) {
		//var illustrationName = this.ktxCache_.illustrationForPlacemark(kmlObject.getName());
		//this.createIllustrationClickHandler_(kmlObject, illustrationName);
		//this.createClickHandler_(kmlObject, illustrationName);
		this.installEventHandler_(kmlObject);
	}
}


/**
*	Retrieve a KmlFeature object from the plugin. Raises an error if the requested feature cannot
*	be found. For situations where this error is undesirable, use the alternative method 
*	tryRetrievingKmlFeature_().
*	@see {ktree.GoogleEarth#tryRetrievingKmlFeature_}
*	@private
*	@param {string} featureName				The name (ID) of the KmlFeature to retrieve
*	@param {KmlContainer} rootContainer		Optional. The KmlContainer to use as the root of the search. If no argument is specified, the plugin root is used.
*	@returns {KmlFeature}					The named KmlFeature. Guaranteed not be null.
*/
ktree.GoogleEarth.prototype.retrieveKmlFeature_ = function(featureName, rootContainer) {
	var kmlFeature = this.tryRetrievingKmlFeature_(featureName, rootContainer);
	if (!kmlFeature) {
		ktree.debug.logError("GoogleEarth couldn't retrieve the KmlFeature <" + featureName +"> when it was expected to exist.");
	}
	return kmlFeature;
}


/**
*	Attempt to retrieve a KmlFeature object from the plugin. May return a null result if the feature
*	cannot be found. For situations where a null result would be undesirable, use the alternative method
*	retrieveKmlFeature_().
*	@see {ktree.GoogleEarth#retrieveKmlFeature_}
*	@private
*	@param {string} featureName				The name (ID) of the KmlFeature to retrieve
*	@param {KmlContainer} rootContainer		Optional. The KmlContainer to use as the root of the search. If no argument is 
*											specified, the plugin root is used.
*	@return {KmlFeature}					The named KmlFeature. May be null if no matching feature can be found.
*/
ktree.GoogleEarth.prototype.tryRetrievingKmlFeature_ = function(featureName, rootContainer) {
	
	ktree.debug.logFine("Searching for KmlFeature <" + featureName + ">...");
	if (!rootContainer) {
		rootContainer = this.ge_;
		ktree.debug.logFine("...in <Plugin Root>.");
	}
	else {
		ktree.debug.logFine("...in <" + rootContainer.getId() + ">");
	}
	
	var kmlObjectList = rootContainer.getFeatures().getChildNodes();
	ktree.debug.logFine("...<" + kmlObjectList.getLength() + "> child nodes to search...");
	
	for (var i = 0; i < kmlObjectList.getLength(); i++) {
		var kmlObject = kmlObjectList.item(i);
		
		if (kmlObject.getId() == featureName || kmlObject.getName() == featureName) {
			ktree.debug.logFine("...Found KmlFeature <" + featureName + ">.");
			return kmlObject;
		}
		
		if (this.typeIsContainer_(kmlObject.getType())) {
			ktree.debug.logFine("...Recurring into KmlContainer <" + kmlObject.getId() + ">");
			
			// Check the children of this container
			var foo = this.tryRetrievingKmlFeature_(featureName, kmlObject);
			
			// If one of the children had the target, we're done
			if (foo) {
				return foo;
			}
			
			// else, go back to the for loop to look at remaining siblings
		}
	}
	
	ktree.debug.logFine("...Couldn't find KmlFeature <" + featureName + "> in this branch. Returning to parent.")
	return null;
}

ktree.GoogleEarth.prototype.sceneIsLoading = function(sceneName, subscene) {
	ktree.debug.logInfo("GoogleEarth is preapring to load Scene <" + sceneName + ">, Subscene <" + subscene + ">");
	var featuresToAppear = this.ktxCache_.featuresToAppearForScene(sceneName, subscene);
	var featuresToHide = this.ktxCache_.featuresToHideForScene(sceneName, subscene);
	
	if (featuresToAppear) {
		goog.array.forEach(featuresToAppear, function(featureName, index, array) {
			this.changeFeatureVisibility(featureName, true);
		},
		this);
	}
	
	if (featuresToHide) {
		goog.array.forEach(featuresToHide, function(featureName, index, array) {
			this.changeFeatureVisibility(featureName, false);
		},
		this);
	}
}

ktree.GoogleEarth.prototype.changeFeatureVisibility = function(featureName, shouldShowFeature) {
	var feature = this.retrieveKmlFeature_(featureName);
	feature.setVisibility(shouldShowFeature);
}

/**
*	Attempts to load KML data for the specified scene by retrieving it from the plugin's
*	internal cache. If successful, will also update the plugin's view using the retrieved
*	KML.
*	@private
*	@param {string} sceneName		The name of the scene to try and load
*	@returns {boolean}				Could KML for the specified scene be retrieved from the plugin?
*/
ktree.GoogleEarth.prototype.tryLoadingKmlForScene = function(sceneName) {
	var sceneDocument = this.tryRetrievingKmlFeature_(sceneName);
	if (!sceneDocument) {
		return false;
	}
	
	var sceneView = sceneDocument.getAbstractView();
	if (sceneView) {
		this.updateView_(sceneView);
		return true;
	}
}


/**
*	Installs a new click handler that will display a specified illustration when a clickable
*	KmlObject is clicked on.
*	@private
*	@param {KmlObject} kmlObject		The clickable KmlObject to install the handler for
*	@param {string} illustrationName	The name of the illustration to display when clicked	
*/
ktree.GoogleEarth.prototype.createIllustrationClickHandler_ = function(kmlObject, illustrationName) {
	var target = this;
	google.earth.addEventListener(kmlObject, 'click', function(event) {
		event.preventDefault();
		var balloon = target.ge_.createHtmlStringBalloon('');
		var contentString = '<img width="768px" height="576px" src="images/illustrations/' + illustrationName + '.jpg>';
		balloon.setContentString(contentString);
		target.ge_.setBalloon(balloon);
	});
}


/**
*	
*/
ktree.GoogleEarth.prototype.installEventHandler_ = function(kmlObject) {
	var target = this;
	
	//First, we ask the event manager to create a handler for this object
	this.eventManager_.getHandlerForObject(kmlObject.getName());
	
	// Now we install a generic entry point into the event manager as a way
	// of delegating responsibility for future events
	google.earth.addEventListener(kmlObject, 'click', function(event) {
		event.preventDefault();
		
		// TODO: Experimental
		
		// Get Sam's lat and lon
		var samLat = target.samPosition_.get(target.LAT_KEY);
		var samLon = target.samPosition_.get(target.LON_KEY)
		var samLatLon = new ktree.earth.LatLon(samLat, samLon);
		
		// Get the lat and lon of the click
		var eventX = event.getClientX();
		var eventY = event.getClientY();
		var hitTestResult = target.ge_.getView().hitTest(eventX, target.ge_.UNITS_PIXELS, eventY, target.ge_.UNITS_PIXELS, target.ge_.HIT_TEST_GLOBE);
		if (hitTestResult) {
			var clickLatLon = new ktree.earth.LatLon(hitTestResult.getLatitude(), hitTestResult.getLongitude());
			
			// Calculate the distance between them (in km)
			var distance = samLatLon.distanceTo(clickLatLon);
			alert('Distance = ' + distance + ' km');
		
			// If it's an interact action at a great distance...
			if (false) {
				// Pop up a balloon saying Sam can't do that
			}
		
			else {
				var result = target.eventManager_.handleEvent(kmlObject.getName(), target.getCurrentVerb());
				var balloon = target.ge_.createHtmlStringBalloon('');
				balloon.setContentString(result);
				target.ge_.setBalloon(balloon);
			}
		}
		else {
			ktree.debug.logError("Couldn't get a hit test result for the click event.");
		}
	});
}

/**
*	This version of the function installs a generic event handler, which only loads
*	the appropriate content from the server when the object is actually clicked.
*/
/*
ktree.GoogleEarth.prototype.installEventHandler_ = function(kmlObject) {
	var target = this;
	google.earth.addEventListener(kmlObject, 'click', function(event) {
		event.preventDefault();
		var name = kmlObject.getName();
		var verb = target.getCurrentVerb();
		var balloon = target.ge_.createHtmlStringBalloon('');
		//balloon.setContentString("Getting response...");
		//target.ge_.setBalloon(balloon);
		target.eventManager_.handleEvent(event, name, verb, balloon);
	});	
}
*/

/**
*	Updates the plugin's current view using an argument abstract view. Will also set the camera
*	fly-to speed appropriately if there is a KTX parameter cached for the view.
*	@private
*	@param {KmlAbstractView} abstractView	The abstract view to use for updating
*/
ktree.GoogleEarth.prototype.updateView_ = function(abstractView) {
	var flyToSpeed = this.ktxCache_.flyToSpeedForView(abstractView.getId());
	if (flyToSpeed) {
		this.setFlyToSpeed(flyToSpeed);
	}
	this.ge_.getView().setAbstractView(abstractView);
}


/**
*	Safe method for attempting to convert a KML string to a KmlObject. If the KML string is
*	well-formed, the resulting KmlObject is returned; otherwise an error is raised. 
*	@private
*	@params {string} kmlString		The KML string to convert to an object
*	@returns {KmlObject}
*/
ktree.GoogleEarth.prototype.kmlStringToObject_ = function(kmlString) {
	try {
		var kmlObject = this.ge_.parseKml(kmlString);
	}
	catch (error) {
		ktree.debug.logError("Adding KML failed. GoogleEarth was unable to parse the KML string: " + kmlString);
	}
	return kmlObject;
}


/**
*	Adds a new KmlFolder object to the GoogleEarth plugin's internal data store and
*	returns a reference to it
*	@private
*	@param {string} folderName		The string ID of the new KmlFolder
*	@param {string} parentName		The string ID of the intended parent container. If null, the new folder is 
*									added to the top-level of the plugin.
*	@return {KmlFolder}				A pointer to the created KmlFolder
*/
ktree.GoogleEarth.prototype.createKmlFolder_ = function(folderName, parentName) {
	var folder = this.ge_.createFolder(folderName);
	
	if (!parentName) {
		ktree.debug.logFine('Installing KmlFolder <' + folderName + '> with plugin root as parent.');
		this.ge_.getFeatures().appendChild(folder);
	}

	else {
		ktree.debug.logFine('Installing KmlFolder <' + folderName + '> into container <' + parentName + '>');
		var parentContainer = this.retrieveKmlFeature_(parentName);
		parentContainer.getFeatures().appendChild(folder);
	}
	
	return folder;
}


/**
*	Returns whether the argument KML type is a container (e.g. a KmlDocument
*	or a KmlFolder).
*	@private
*	@param {string} kmlType		The name of the KmlType to examine
*	@return {bool}				Is this KmlType a container?
*/
ktree.GoogleEarth.prototype.typeIsContainer_ = function(kmlType) {
	return (kmlType == "KmlFolder" || kmlType == "KmlDocument");
}


/**
*	Returns whether the argument KML type is an absract view
*	@private
*	@param {string} kmlType		The name of the KmlType to examine
*	@return {bool}				Is this KmlType an abstract view?
*/
ktree.GoogleEarth.prototype.typeIsAbstractView_ = function(kmlType) {
	return (kmlType == "KmlLookAt" || kmlType == "KmlCamera");
}


/**
*	Returns whether the argument KML type is clickable
*	@private
*	@param {string} kmlType		The name of the KmlType to examine
*	@return {bool}				Is this KmlType clickable?
*/
ktree.GoogleEarth.prototype.typeIsClickable_ = function(kmlType) {
	return (kmlType == "KmlPlacemark");
}




/**********************************************************************
*	
*                 Experimental Code Below this Point       
*
***********************************************************************/



/**
*	@ignore
*/
ktree.GoogleEarth.prototype.moveCameraTo = function() {
	// Get the current view
	var lookAt = this.ge_.getView().copyAsLookAt(this.ge_.ALTITUDE_RELATIVE_TO_GROUND);
	
	// Set lat and long as desired
	lookAt.setLatitude(0);
	lookAt.setLongitude(0);
	
	// Update the view
	this.ge_.getView().setAbstractView(lookAt);
}

/**
*	@ignore
*/
ktree.GoogleEarth.prototype.moveCameraRelative = function() {
	var camera = this.ge_.getView().copyAsCamera(this.ge_.ALTITUDE_RELATIVE_TO_GROUND);
	
	camera.setLatitude(camera.getLatitude() + 0);
	camera.setLongitude(camera.getLongitude() + 0.1);
	
	this.ge_.getView().setAbstractView(camera);
}


/**
*	@ignore
*	@param {ktree.AnimationProvider | null} newAnimationProvider
*/
ktree.GoogleEarth.prototype.startAnimation = function(newAnimationProvider) {
	if(!this.animationRunning_) {
		this.animationRunning_ = true;
		if(goog.isDef(newAnimationProvider)) {
			this.setAnimationProvider(newAnimationProvider);
		}
		if (!goog.isNull(this.animationProvider_)) {
			ktree.debug.logInfo('GoogleEarth is starting the AnimationProvider <' + this.animationProvider_.getName() + '>.');
			google.earth.addEventListener(this.ge_, 'frameend', this.animationProvider_.provide);
			this.animationProvider_.initialize();
			this.animationProvider_.provide();
		}
		else {
			ktree.debug.logWarning('GoogleEarth was asked to start an animation without an AnimationProvider.');
		}
	}
	else {
		ktree.debug.logWarning('GoogleEarth was asked to start an animation while another was still running.');
	}
	
}

/**
*	@ignore
*/
ktree.GoogleEarth.prototype.startAnimationCallback = function() {
	this.startAnimation();
}

/**
*	@ignore
*/
ktree.GoogleEarth.prototype.stopAnimation = function(tickProvider) {
	if(this.animationRunning_) {
		ktree.debug.logInfo('GoogleEarth is stopping the AnimationProvider <' + this.animationProvider_.getName() + '>.');
		google.earth.removeEventListener(this.ge_, 'frameend', this.animationProvider_.provide);
		this.animationRunning_ = false;
		this.animationProvider_.cleanup();
	}
	else {
		ktree.debug.logWarning('GoogleEarth was asked to stop an animation when none was running.');
	}
}

/**
*	@ignore
*	@param {ktree.AnimationProvider} newAnimationProvider
*	@private
*/
ktree.GoogleEarth.prototype.setAnimationProvider = function(newAnimationProvider) {
	ktree.debug.logInfo('GoogleEarth is switching to the AnimationProvider <' + newAnimationProvider.getName() + '>.');
	this.animationProvider_ = newAnimationProvider;
}

/**
*	@ignore
*/
ktree.GoogleEarth.prototype.makeCameraButton = function() {
	//alert('Google Earth <' + this.identifier_ + "> is making a camera button");
	var b = new goog.ui.Button('Move Camera');
	b.render(goog.dom.$('button'));
	goog.events.listen(b, goog.ui.Component.EventType.ACTION, this.moveCameraTo, false, this);
}

/**
*	@ignore
*/
ktree.GoogleEarth.prototype.makeAnimTestButton = function() {
	var b = new goog.ui.Button('Start Animation');
	b.render(goog.dom.$('button'));
	var target = this;
	
	/**
	*	@implements {ktree.AnimationProvider}
	*/
	var orbit = {
		getName: function() {
			return "Orbit";
		},
		
		initialize: function() {
			target.ge_.getOptions().setFlyToSpeed(target.ge_.SPEED_TELEPORT);
			target.ge_.getSun().setVisibility(true);
			target.ge_.getOptions().setStatusBarVisibility(true);
		},
		
		provide: function() {
			target.moveCameraRelative();
		},
		
		cleanup: function() {
			
		}
	};
	
	this.setAnimationProvider(orbit);
	goog.events.listen(b, goog.ui.Component.EventType.ACTION, this.startAnimationCallback, false, this);
}
