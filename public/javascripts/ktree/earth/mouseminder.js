/**
*   Karunatree
*   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
*   
*   Author: Derek Lyons
*
**/

goog.provide('ktree.earth.MouseMinder');

/**
*	@constructor
*/
ktree.earth.MouseMinder = function() {
	this.dragInfo_ = null;
	this.message = 'PUMPKINZ!';
	
	this.mouseDownEventCallback = goog.bind(this.mouseDownEvent, this);
	this.mouseUpEventCallback = goog.bind(this.mouseUpEvent, this);
	this.mouseMoveEventCallback = goog.bind(this.mouseMoveEvent, this);
}


ktree.earth.MouseMinder.prototype.mouseDownEvent = function(event) {
	//ktree.debug.logInfo(this.message);
	if (event.getTarget().getName() == "Sam") {
		this.dragInfo_ = {
			target: event.getTarget(),
			dragged: false
		}
	}
}

ktree.earth.MouseMinder.prototype.mouseUpEvent = function(event) {
	//ktree.debug.logInfo('Mouse up!');
	if (target_.dragInfo_) {
		if (target_.dragInfo_.dragged) {
			event.preventDefault();
		}
		target_.dragInfo_ = null;
	}
}

ktree.earth.MouseMinder.prototype.mouseMoveEvent = function(event) {
	//ktree.debug.logInfo('Mouse moving...');
	if (this.dragInfo_) {
		event.preventDefault();
		var point = this.dragInfo_.target.getGeometry();
		point.setLatitude(event.getLatitude());
		point.setLongitude(event.getLongitude());
		this.dragInfo_.dragged = true;
	}
}