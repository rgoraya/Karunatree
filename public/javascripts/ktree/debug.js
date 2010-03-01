goog.provide('ktree.debug');

goog.require('goog.debug');
goog.require('goog.debug.Console');
goog.require('goog.debug.FancyWindow');
goog.require('goog.debug.Logger');

/**
*	@fileoverview
*	Provides debug utility functions for the rest of the system.
*	Note that this file should not require any other ktree
*	resources.
*
*	@version 0.2
*	@author Derek Lyons
*/


/**
*	Start the Main debug log and attach it to a window
*	
*/
ktree.debug.startDebugger = function() {
	
	//Uncomment this version to use a separate debug window
	//
	//var debugWindow = new goog.debug.FancyWindow('KarunaTree');
	//debugWindow.setEnabled(true);
	//debugWindow.init();
	
	var debugConsole = new goog.debug.Console();
	debugConsole.setCapturing(true);

	ktree.debug.mainLogger_ = goog.debug.Logger.getLogger('Main');
	ktree.debug.mainLogger_.setLevel(goog.debug.Logger.Level.FINE);
	ktree.debug.logFine('KTree is running in debug mode');
}


ktree.debug.logFine = function(message) {
	//console.info(message);
	ktree.debug.mainLogger_.fine(message);
}

ktree.debug.logInfo = function(message) {
	//console.info(message);
	ktree.debug.mainLogger_.info(message);
}

ktree.debug.logWarning = function(message) {
	//console.warning(message);
	ktree.debug.mainLogger_.warning(message);
}

ktree.debug.logShout = function(message) {
	//console.error(message);
	ktree.debug.mainLogger_.shout(message);
}

ktree.debug.logError= function(message) {
	//console.error(message);
	ktree.debug.mainLogger_.severe(message);
}

ktree.debug.logElement = function(element, message) {
	if(message) ktree.debug.mainLogger_.info(message);
	console.dirxml(element);
}

ktree.debug.logElementError = function(element, message) {
	if(message) ktree.debug.mainLogger_.severe(message);
	console.dirxml(element);
}

ktree.debug.logProperties = function(object, message) {
	if(message) ktree.debug.mainLogger_.info(message);
	console.dir(object);
}

ktree.debug.logGroup = function(message) {
	console.group(message);
}

ktree.debug.logGroupHidden = function(message) {
	console.groupCollapsed(message);
}

ktree.debug.logGroupEnd = function() {
	console.groupEnd();
}