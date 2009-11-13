goog.provide('ktree.Utils');

goog.require('goog.debug');
goog.require('goog.debug.FancyWindow');
goog.require('goog.debug.Logger');

/**
*	@fileoverview
*	Provides utility functions for the rest of the system.
*	Note that this file should not require any other ktree
*	resources.
*/

/**
* 	@constructor
*/
ktree.Utils = function() {
	// Empty for the time being.
}


/**
*	Start the Main debug log and attach it to a window
*	
*/
ktree.Utils.startDebugger = function() {
	//Create the debug window
	var debugWindow = new goog.debug.FancyWindow('KarunaTree');
	debugWindow.setEnabled(true);
	debugWindow.init();

	//Create a logger to display messages "FINE" and above
	var logger = goog.debug.Logger.getLogger('Main');
	logger.setLevel(goog.debug.Logger.Level.FINE);
	ktree.Utils.logFine('Running in debug mode');
}

/**
*	Log message with level FINE to the Main debug log.
*	Note this is an example of a public static method.
* @private
*/
ktree.Utils.logFine = function(message) {
	var logger = goog.debug.Logger.getLogger('Main');
	logger.fine(message);
}

/**
*	Log message with level SEVERE to the Main debug log.
*/
ktree.Utils.logSevere = function(message) {
	var logger = goog.debug.Logger.getLogger('Main');
	logger.severe(message);
}

