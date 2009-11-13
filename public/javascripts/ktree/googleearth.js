goog.provide('ktree.GoogleEarth');

goog.require('ktree.Utils');

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
	*	The Google Earth API instance associated with this object.
	*	@private
	*/
	this.ge_;
	
	/**
	*	A string to uniquely identify this GoogleEarth object
	*	@private
	*	@type {string}
	*/
	this.identifier_ = identifier;
	
	/**
	*	A temporary reference to this *particular* GoogleEarth object needed to 
	*	allow the initialization callback chain to reach this object again.
	*	@private
	*/
	var that_ = this;
	
	/**
	*	Callback to begin initialization of the Google Earth API instance,
	*	providing further callbacks for success and failure
	*	@private	
	*/
	var initializeAPI_ = function() {
		ktree.Utils.logFine('GoogleEarth <' + that_.identifier_ + '> received its google.OnLoadCallback.');
		google.earth.createInstance('earth', apiInitSuccess_, apiInitFailure_);
	}
	
	/**
	*	If the API initializes successfully, set up its basic parameters
	*	@private
	*	@param instance The initialized earth API instance
	*/
	var apiInitSuccess_ = function(instance) {
		ktree.Utils.logFine('GoogleEarth <' + that_.identifier_ + '> reports successful Earth API initialization.');
		that_.ge_ = instance;
		that_.ge_.getWindow().setVisibility(true);
		that_.ge_.getSun().setVisibility(false);
		that_.ge_.getOptions().setAtmosphereVisibility(true);
		that_.ge_.getNavigationControl().setVisibility(that_.ge_.VISIBILITY_AUTO);
	};

	/**
	*	If the API fails to initialize, provide an error message
	*	@private
	*	@param errorCode An error message from the Earth API
	*/
	var apiInitFailure_ = function(errorCode) {
		alert("Oops! There was a problem initializing the Google Earth API.");
		ktree.Utils.logSevere('GoogleEarth <' + that_.identifer_ + '> reports that Earth API initialization failed.');
		ktree.Utils.logSevere('API error code as follows:' + errorCode);
	};
	
	// Finally! Start the process of setting up the Earth API
	google.load("earth", "1");
	google.setOnLoadCallback(initializeAPI_);
}


