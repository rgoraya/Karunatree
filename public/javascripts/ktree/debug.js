goog.provide('ktree.debug');

goog.require('ktree.config');

goog.require('goog.debug');
goog.require('goog.debug.Console');
goog.require('goog.debug.FancyWindow');
goog.require('goog.debug.Logger');

/**
*	@fileoverview
*	Provides debug utility functions for the rest of the system. Note that this file 
*	should not require any other ktree resources except for ktree.config.
*
*	@version 0.3
*	@author Derek Lyons
*/


/**
*	Start the debugger and prepare it to output to the display specified in
*	ktree.config.DEBUG_OUTPUT
*	
*/
ktree.debug.startDebugger = function() {
	var displayString = "None";
	var defaulted = false;
	
	// If the debugger was configured to use the console but none is available
	// (for example, if Firebug is not running), fall back on window output.
	if (ktree.config.DEBUG_OUTPUT == ktree.config.DEBUG_OUTPUT_CONSOLE) {
		if (typeof console == 'undefined') {
			ktree.config.DEBUG_OUTPUT = ktree.config.DEBUG_OUTPUT_WINDOW;
			defaulted = true;
		}
	}
	
	switch (ktree.config.DEBUG_OUTPUT) {
	
		case ktree.config.DEBUG_OUTPUT_CONSOLE:
			displayString = "Console";
			ktree.debug.debugDisplay_ = new goog.debug.Console();
			ktree.debug.debugDisplay_.setCapturing(true);
			break;
	
		case ktree.config.DEBUG_OUTPUT_WINDOW:
			displayString = "Window";
			ktree.debug.debugDisplay_ = new goog.debug.FancyWindow('KarunaTree');
			ktree.debug.debugDisplay_.setEnabled(true);
			ktree.debug.debugDisplay_.init();
			break;
	
		case ktree.config.DEBUG_OUTPUT_ALERT_ALL:
			displayString = "Alert(All)";
			
			ktree.debug.logFine = goog.bind(ktree.debug.displayAlert_, null, "Fine");
			ktree.debug.logInfo = goog.bind(ktree.debug.displayAlert_, null, "Info");
			ktree.debug.logElement = goog.bind(ktree.debug.displayAlert_, null, "Element");
			ktree.debug.logProperties = goog.bind(ktree.debug.displayAlert_, null, "Properties");
			ktree.debug.logGroup = goog.bind(ktree.debug.displayAlert_, null, "Group");
			ktree.debug.logGroupHidden = goog.bind(ktree.debug.displayAlert_, null, "Hidden Group");
			ktree.debug.logGroupEnd = goog.bind(ktree.debug.displayAlert_, null, "End Group");
			
			ktree.debug.logWarning = goog.bind(ktree.debug.displayAlert_, null, "Warning");
			ktree.debug.logShout = goog.bind(ktree.debug.displayAlert_, null, "Shout");
			ktree.debug.logError = goog.bind(ktree.debug.displayAlert_, null, "Error");
			ktree.debug.logElementError = goog.bind(ktree.debug.displayAlert_, null, "Element Error");
			break;
			
		case ktree.config.DEBUG_OUTPUT_ALERT_WARNINGS:
			displayString = "Alert(Warnings and Above)";
			
			ktree.debug.logFine = ktree.debug.silent_;
			ktree.debug.logInfo = ktree.debug.silent_;
			ktree.debug.logElement = ktree.debug.silent_;
			ktree.debug.logProperties = ktree.debug.silent_;
			ktree.debug.logGroup = ktree.debug.silent_;
			ktree.debug.logGroupHidden = ktree.debug.silent_;
			ktree.debug.logGroupEnd = ktree.debug.silent_;
			
			ktree.debug.logWarning = goog.bind(ktree.debug.displayAlert_, null, "Warning");
			ktree.debug.logShout = goog.bind(ktree.debug.displayAlert_, null, "Shout");
			ktree.debug.logError = goog.bind(ktree.debug.displayAlert_, null, "Error");
			ktree.debug.logElementError = goog.bind(ktree.debug.displayAlert_, null, "Element Error");
			break;
	}

	if (ktree.config.DEBUG_OUTPUT != ktree.config.DEBUG_OUTPUT_ALERT_ALL && ktree.config.DEBUG_OUTPUT != ktree.config.DEBUG_OUTPUT_ALERT_WARNINGS) {
		ktree.debug.mainLogger_ = goog.debug.Logger.getLogger('KTree');
		ktree.debug.mainLogger_.setLevel(goog.debug.Logger.Level.FINE);
	}
	
	if (defaulted) {
		ktree.debug.logWarning('Warning: <Console> output is not available. Defaulting to <Window> output.');
	}
	
	ktree.debug.logFine('KTree is running in debug mode. Outputting to <' + displayString + '>');	
}


/**
*	Basic logging functions
*/

ktree.debug.logFine = function(message) {
	ktree.debug.mainLogger_.fine(message);
}

ktree.debug.logInfo = function(message) {
	ktree.debug.mainLogger_.info(message);
}

ktree.debug.logWarning = function(message) {
	ktree.debug.mainLogger_.warning(message);
}

ktree.debug.logShout = function(message) {
	ktree.debug.mainLogger_.shout(message);
}

ktree.debug.logError= function(message) {
	ktree.debug.mainLogger_.severe(message);
}

/**
*	Advanced logging functions. These are meant to work with the Firebug console,
*	and will diminish in usefuleness when other debug displays are used.
*	@param element
*	@param {string} [message]
*/

ktree.debug.logElement = function(element, message) {
	if(message) ktree.debug.mainLogger_.info(message);
	if (ktree.config.DEBUG_OUTPUT == ktree.config.DEBUG_OUTPUT_CONSOLE) {
		console.dirxml(element);
	}
	else {
		ktree.debug.logConsoleWarning_("logElement", element);
	}
}

/**
*	@param object
*	@param {string} [message]
*/
ktree.debug.logProperties = function(object, message) {
	if(message) ktree.debug.mainLogger_.info(message);
	if (ktree.config.DEBUG_OUTPUT == ktree.config.DEBUG_OUTPUT_CONSOLE) {
		console.dir(object);
	}
	else {
		ktree.debug.logConsoleWarning_("logProperties", object);
	}
}

ktree.debug.logGroup = function(message) {
	if (ktree.config.DEBUG_OUTPUT == ktree.config.DEBUG_OUTPUT_CONSOLE) {
		console.group(message);
	}
	else {
		ktree.debug.logInfo("********** Starting Log Group: < " + message + "> **********");
	}
}

ktree.debug.logGroupHidden = function(message) {
	if (ktree.config.DEBUG_OUTPUT == ktree.config.DEBUG_OUTPUT_CONSOLE) {
		console.groupCollapsed(message);
	}
	else {
		ktree.debug.logInfo("********** Starting Hidden Log Group: < " + message + "> **********");
	}
}

ktree.debug.logGroupEnd = function() {
	if (ktree.config.DEBUG_OUTPUT == ktree.config.DEBUG_OUTPUT_CONSOLE) {
		console.groupEnd();
	}
	else {
		ktree.debug.logInfo("********** Ending Log Group **********");
	}
}


/**
*	Private logging functions. Used by ktree.debug to adjust for different
*	debug output configurations.
*/
ktree.debug.displayAlert_ = function(logLevel, arg1, arg2) {
	if (arg2) {
		alert("[" + logLevel + "] " + arg2 + "\n(Object argument suppressed)");
	}
	else {
		alert("[" + logLevel + "] " + arg1);
	}
}

ktree.debug.logConsoleWarning_ = function(logFnName, object) {
	ktree.debug.mainLogger_.warning("Warning: ktree.debug." + logFnName + " requires console output. Logged object is:\n" + object);
}

ktree.debug.silent_ = function() {};