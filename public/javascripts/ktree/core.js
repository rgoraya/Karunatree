goog.provide('ktree.Core');

goog.require('ktree.Utils');
goog.require('ktree.World');

/**
*	@fileoverview
*	The launch point for KarunaTree javascript. 
*/

/**
*	Create a Core object. This is the function called
*	from HTML to setup the JS portion of our system.
* 	@constructor
*/
ktree.Core = function(debugOn) {

	if (debugOn) {
		ktree.Utils.startDebugger();
	}
	
	this.world_ = new ktree.World();
	this.world_.initialize();
}