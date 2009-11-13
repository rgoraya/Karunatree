goog.provide('ktree.World');

goog.require('ktree.GoogleEarth');

/**
*	@fileoverview
*	Implements functionality for the geographical visualization in which
*	KT stories are set.
*/

/**
*	Constructs a new World
*	@constructor
*/
ktree.World = function() {
	
	/**
	*	The World's private reference to the actual world
	*	visualization package
	*	@private
	*	@type {ktree.GoogleEarth}
	*/
	this.globe_;
}

/**
*	Allows the world to perform necessary one-time initializations, for
*	example on page load 
*/
ktree.World.prototype.initialize = function() {
	this.globe_ = new ktree.GoogleEarth('Main');
}