goog.provide('ktree.World');

goog.require('ktree.GoogleEarth');

/**
*	@fileoverview
*	Implements functionality for the geographical visualization in which
*	KT stories are set.
*
*	@version 0.1
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
	this.globe_ = new ktree.GoogleEarth('Main');
}

/**
*	Calculate the great circle distance (in meters) between two points on the Earth's surface
*	using the spherical law of cosines.
*	Code courtesy of:
*	http://www.movable-type.co.uk/scripts/latlong.html
*	http://code.google.com/apis/ajax/playground/?exp=earth#smooth_animation_with_frameend
*	
*	@public
*/
ktree.World.distance = function(lat1, lon1, lat2, lon2) {
	var a = Math.sin(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180);
	var b = Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
	return Math.acos(a + b) * 6371000; //Units come from the 6371000 term, the radius of the Earth in meters
}

/**
*	Given a starting point, heading, and distance, calculate the ending point that you will reach
*	following a great circle route.
*	Code courtesy of:
*	http://www.movable-type.co.uk/scripts/latlong.html
*	http://code.google.com/apis/ajax/playground/?exp=earth#smooth_animation_with_frameend
*
*	@public
*/
ktree.World.destination = function (lat, lon, dist, heading) {
  
	//Convert all angles to radians
	lat *= Math.PI / 180;
  	lon *= Math.PI / 180;
  	heading *= Math.PI / 180;
  	
	//Convert distance to angular distance
	dist /= 6371000;

  	var lat2 = Math.asin(Math.sin(lat) * Math.cos(dist) + Math.cos(lat) * Math.sin(dist) * Math.cos(heading));

  	return [180 / Math.PI * lat2,
      		180 / Math.PI * (lon + Math.atan2(Math.sin(heading) * Math.sin(dist) * Math.cos(lat2), Math.cos(dist) - Math.sin(lat) * Math.sin(lat2)))];
}