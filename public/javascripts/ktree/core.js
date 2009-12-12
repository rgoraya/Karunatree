goog.provide('ktree.Core');

goog.require('ktree.debug');
goog.require('ktree.World');
goog.require('ktree.ktx.KtxManager');

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
	
	if(debugOn) {
		ktree.debug.startDebugger();
	}

	this.world_ = new ktree.GoogleEarth('Main');
	this.ktxManager_ = new ktree.ktx.KtxManager(this.world_);
}

ktree.Core.prototype.debugTemp = function() {
	var target = this;
	var name = 'http://localhost:3000/kml/1-1.ktx.xml';
	
	success = function(dataSource) {

	}
	
	failure = function() {
		alert('Failed to load KtxDataSource')
	}
	//this.world_.makeAnimTestButton();
	this.ktxManager_.loadKtx(name, 'KTXTest', success, failure);
}