/**
*   Karunatree
*   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
*   
*   Author: Derek Lyons
*
**/

goog.provide('ktree.engine.Sequoia');

goog.require('ktree.config');
goog.require('ktree.debug');
goog.require('ktree.growl');
goog.require('ktree.GoogleEarth');
goog.require('ktree.kml.KmlManager');

goog.require('goog.async.ConditionalDelay');

/**
*	@constructor
*/
ktree.engine.Sequoia = function(world, kmlManager, toolbar) {
	this.world_ = world;
	this.kmlManager_ = kmlManager;
	this.toolbar_ = toolbar;
	
	this.start();
};

ktree.engine.Sequoia.prototype.start = function() {
	
	// Wait for the Earth to be ready before trying to interact with it
	var target = this;
	var conditionalDelay = new goog.async.ConditionalDelay(
		function() {
			return (target.world_.apiReady());
		}
	);
	conditionalDelay.onFailure = function() {
		ktree.debug.logError('Sequoia timed out waiting for GoogleEarth to initialize');
	}
	conditionalDelay.onSuccess = function() {
		target.configureEarth();
	}
	conditionalDelay.start(100, ktree.config.GE_API_INIT_TIMEOUT);
	
	
	//this.clock_ = new goog.Timer(1000);
	//this.clock_.start();
	
	//var boundTickAction = goog.bind(this.tickAction, this);
	//goog.events.listen(this.clock_, goog.Timer.TICK, boundTickAction);
	
	//this.time_ = 0;
};

ktree.engine.Sequoia.prototype.configureEarth = function() {
	this.world_.getPlugin().getOptions().setTerrainExaggeration(2);
	this.world_.setFlyToSpeed(0.3);
	ktree.growl.it('Here we go!');
	this.kmlManager_.findAndLoadKml('Sanctuary', ktree.config.URL_BASE + ktree.config.URL_COMPONENT_KML_PATH + 'sanctuary.xml');
}

ktree.engine.Sequoia.prototype.tickAction = function() {
	this.toolbar_.updateTime(this.time_++);
	this.world_.update();
}



