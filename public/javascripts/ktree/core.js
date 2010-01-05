goog.provide('ktree.Core');

goog.require('ktree.debug');
goog.require('ktree.Soundscape')
goog.require('ktree.World');
goog.require('ktree.ktx.KtxManager');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.ui.Component');
goog.require('goog.ui.SplitPane');
goog.require('goog.ui.SplitPane.Orientation');

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
	
	this.soundscape_ = new ktree.Soundscape();
	
	this.viewportSizeMonitor_ = new goog.dom.ViewportSizeMonitor();
	goog.events.listen(this.viewportSizeMonitor_, goog.events.EventType.RESIZE, this.viewportResize_, false, this);
	
	var viewportSize = goog.dom.getViewportSize();
	ktree.debug.logInfo('Core is setting up SplitPane view for a viewport of size: ' + viewportSize);
	var lhs = new goog.ui.Component();
	var rhs = new goog.ui.Component();
	this.splitPane_ = new goog.ui.SplitPane(lhs, rhs, goog.ui.SplitPane.Orientation.HORIZONTAL);
	//The initial size (for the left-half of the split) needs to be set before decorate is called
	this.splitPane_.setInitialSize(viewportSize.width*0.7);
	this.splitPane_.decorate(goog.dom.getElement('splitter'));
	this.splitPane_.setHandleSize(15	);
	var scaledViewport = new goog.math.Size(viewportSize.width, viewportSize.height*0.92);
	this.splitPane_.setSize(scaledViewport);
	this.splitPane_.setContinuousResize(true);
}

ktree.Core.prototype.viewportResize_ = function(e) {
	var newSize = this.viewportSizeMonitor_.getSize();
	ktree.debug.logInfo('Core is resizing the SplitPane view for new viewport dimensions: ' + newSize);
	var newScaledSize =new goog.math.Size(newSize.width, newSize.height*0.92);
	this.splitPane_.setSize(newScaledSize);	
}

ktree.Core.prototype.soundscape = function() {
	return this.soundscape_;
}

ktree.Core.prototype.ktx = function(uri, dsName) {
	this.ktxManager_.ktx(dsName, uri);
}

ktree.Core.prototype.debugTemp = function() {
	var target = this;
	var name = 'http://localhost:3000/ktx/1-1.ktx.xml';
	
	success = function(dataSource) {

	}
	
	failure = function() {
		alert('Failed to load KtxDataSource')
	}
	ktree.Soundscape.testButton();
	this.ktxManager_.loadKtx(name, 'KTXTest', success, failure);
}