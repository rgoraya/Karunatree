goog.provide('ktree.GoogleEarth');

goog.require('ktree.debug');
goog.require('ktree.ktx');
goog.require('ktree.AnimationProvider');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Button');

/**
*	@fileoverview
*	Implements the bridge between KarunaTree and the Google Earth API.
*	This is the only place in the system where direct calls to the
*	Earth API should be issued.
*/

/**
*	Create a new GoogleEarth object, attached to an initialized instance
*	of the GoogleEarth API.
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
	*	A temporary reference to this *particular* GoogleEarth object needed to 
	*	allow the initialization callback chain to reach this object again.
	*	@private
	*/
	var target_ = this;
		
	/**
	*	@private
	*	@type {ktree.AnimationProvider}
	*/
	this.animationProvider_ = null;
	
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
		target_.ge_.getNavigationControl().setVisibility(target_.ge_.VISIBILITY_AUTO);		
	};

	/**
	*	If the API fails to initialize, provide an error message
	*	@private
	*	@param errorCode An error message from the Earth API
	*/
	var apiInitFailure_ = function(errorCode) {
		//alert("Oops! There was a problem initializing the Google Earth API.");
		ktree.debug.logError('GoogleEarth <' + target_.identifier_ + '> reports that Earth API initialization failed.');
		ktree.debug.logError('API error code as follows:' + errorCode);
	};
	
	// Finally! Start the process of setting up the Earth API
	google.load("earth", "1");
	google.setOnLoadCallback(initializeAPI_);
}

/**
*	Returns whether or not the Google Earth API is initialized and ready for commands
*	@return {boolean}
*/
ktree.GoogleEarth.prototype.apiReady = function() {
	return this.geReady_;
}

/**
*	Adds the features in an argument KML string to the GE instance. If the KML string defines
*	an AbstractView (e.g. a Camera or a LookAt), the GE instance's view is set to the
*	AbstractView
*	@param {string} kmlString		A string of valid KML
*/
ktree.GoogleEarth.prototype.parseKml = function(kmlString) {
	var kmlObject = this.ge_.parseKml(kmlString);
	if (kmlObject.getAbstractView() !== null) {
		this.ge_.getView().setAbstractView(kmlObject.getAbstractView());
	}
	this.ge_.getFeatures().appendChild(kmlObject);
}

ktree.GoogleEarth.prototype.fetchKml = function(kmlUrl) {
	ktree.debug.logFine('GoogleEarth <' + this.identifier_ + '> is fetching KML from from URL <' + kmlUrl + '>');
	var callbackTarget = this;
	google.earth.fetchKml(this.ge_, kmlUrl, function(kmlObject) {callbackTarget.addKml(kmlObject)});
}

ktree.GoogleEarth.prototype.addKml = function(kmlObject) {
	ktree.debug.logFine('GoogleEarth <' + this.identifier_ + '> is parsing a new KML Object...');
	if (kmlObject) {
		
		if('getFeatures' in kmlObject) {
			ktree.debug.logFine('Here is the KML Object: ' + kmlObject.getKml());
			var featureList = kmlObject.getFeatures().getChildNodes();
			ktree.debug.logFine('KML object has features: ' + featureList.getLength());
			var i;
			for(i = 0; i < featureList.getLength(); i++) {
				ktree.debug.logFine('Loop: ' +i);
				var feature = featureList.item(i);
				ktree.debug.logFine('Feature:' +feature.getType());
			}
		}
		
		if (kmlObject.getAbstractView() !== null) {
			this.ge_.getView().setAbstractView(kmlObject.getAbstractView());
		}
		this.ge_.getFeatures().appendChild(kmlObject);
	}
	
}

ktree.GoogleEarth.prototype.setFlyToSpeed = function(speed) {
	if (speed == ktree.ktx.SPEED_TELEPORT) {
		speed = this.ge_.SPEED_TELEPORT;
	}
	this.ge_.getOptions().setFlyToSpeed(speed);
}

ktree.GoogleEarth.prototype.moveCameraTo = function() {
	// Get the current view
	var lookAt = this.ge_.getView().copyAsLookAt(this.ge_.ALTITUDE_RELATIVE_TO_GROUND);
	
	// Set lat and long as desired
	lookAt.setLatitude(0);
	lookAt.setLongitude(0);
	
	// Update the view
	this.ge_.getView().setAbstractView(lookAt);
}

ktree.GoogleEarth.prototype.moveCameraRelative = function() {
	var camera = this.ge_.getView().copyAsCamera(this.ge_.ALTITUDE_RELATIVE_TO_GROUND);
	
	camera.setLatitude(camera.getLatitude() + 0);
	camera.setLongitude(camera.getLongitude() + 0.1);
	
	this.ge_.getView().setAbstractView(camera);
}

/**
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

ktree.GoogleEarth.prototype.startAnimationCallback = function() {
	this.startAnimation();
}

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
*	@param {ktree.AnimationProvider} newAnimationProvider
*	@private
*/
ktree.GoogleEarth.prototype.setAnimationProvider = function(newAnimationProvider) {
	ktree.debug.logInfo('GoogleEarth is switching to the AnimationProvider <' + newAnimationProvider.getName() + '>.');
	this.animationProvider_ = newAnimationProvider;
}

ktree.GoogleEarth.prototype.makeCameraButton = function() {
	//alert('Google Earth <' + this.identifier_ + "> is making a camera button");
	var b = new goog.ui.Button('Move Camera');
	b.render(goog.dom.$('button'));
	goog.events.listen(b, goog.ui.Component.EventType.ACTION, this.moveCameraTo, false, this);
}

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
