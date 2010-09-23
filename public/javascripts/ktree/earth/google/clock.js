/**
*   Karunatree
*   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
*   
*   Author: Derek Lyons
*
**/

goog.provide('ktree.earth.google.Clock');

goog.require('goog.string');
goog.require('goog.asserts');

ktree.earth.google.Clock = function(gePlugin) {
	this.ge_ = gePlugin;
	
	this.year_ = 2010;
	this.month_ = 7;
	this.day_ = 1;
	
	this.hours_ = 0;
	this.mins_ = 0;
}

ktree.earth.google.Clock.prototype.increment = function(increment) {
	if (increment.mins) this.incrementMins_(increment.mins);
	if (increment.hours) this.incrementHours_(increment.hours);
	if (increment.days) this.incrementDay_(increment.day);

	var timeStampedView = this.getTimeStampedView();
	this.updateView_(timeStampedView);
}

ktree.earth.google.Clock.prototype.getTimeStampedView = function() {
	var kml				 	= ''
						 	+ '<?xml version="1.0" encoding="UTF-8" ?>'
							+ '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">'
						  	+ ''
							+ '<Placemark>'
							+ '  <name>Clock</name>'
					        + '  <visibility>0</visibility>'
					      	+ '  <LookAt>'
					        + '    <gx:TimeStamp><when>'+this.year_.toString()+'-'+goog.string.padNumber(this.month_, 2)+'-'+goog.string.padNumber(this.day_, 2)+'T'+goog.string.padNumber(this.hours_, 2)+':'+goog.string.padNumber(this.mins_, 2)+':00+Z</when></gx:TimeStamp>' 
					        + '  </LookAt>'
							+ '  <Point>'
					        + '    <coordinates>0,0,0</coordinates>'
					        + '  </Point>'
					    	+ '</Placemark>'
							+ '</kml>'
					
	var kmlObject = this.ge_.parseKml(kml);
	return kmlObject.getAbstractView();
}

ktree.earth.google.Clock.prototype.updateView_ = function(timeStampedView) {
	var currentView = this.ge_.getView().copyAsLookAt(this.ge_.ALTITUDE_RELATIVE_TO_GROUND);
	
	timeStampedView.setLatitude(currentView.getLatitude());
	timeStampedView.setLongitude(currentView.getLongitude());
	timeStampedView.setAltitude(currentView.getAltitude());
	timeStampedView.setHeading(currentView.getHeading());
	timeStampedView.setRange(currentView.getRange());
	timeStampedView.setTilt(currentView.getTilt());
	
	this.ge_.getView().setAbstractView(timeStampedView);
}

ktree.earth.google.Clock.prototype.incrementMins_ = function(incrementMins) {
	this.mins_ += incrementMins;
	if (this.mins_ >= 60) {
		this.incrementHours_(1);
		this.mins_ -= 60;
	}
	goog.asserts.assert(this.mins_ >= 0 && this.mins_ < 60, "The google.Clock's minute data is out of range.");
}

ktree.earth.google.Clock.prototype.incrementHours_ = function(incrementHours) {
	this.hours_ += incrementHours;
	if (this.hours_ >= 24) {
		this.incrementDay_(1);
		this.hours_ -= 24;
	}
	goog.asserts.assert(this.hours_ >= 0 && this.hours_ < 24, "The google.Clock's hour data is out of range.");
}

ktree.earth.google.Clock.prototype.incrementDay_ = function(incrementDay) {
	// TODO: Complete this function
	this.day_ += 1;
	goog.asserts.assert(this.day_ >= 1 && this.day_ < 29, "The google.Clock's day data is out of range.")
}



