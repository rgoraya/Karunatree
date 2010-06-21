goog.provide('ktree.earth.LatLon');
goog.provide('Geo');

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Latitude/longitude spherical geodesy formulae & scripts (c) Chris Veness 2002-2010            */
/*   - www.movable-type.co.uk/scripts/latlong.html                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
 
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Note that minimal error checking is performed in this example code!                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
 
 
Number.prototype.toRad = function() {  // convert degrees to radians
  return this * Math.PI / 180;
}
Number.prototype.toDeg = function() {  // convert radians to degrees (signed)
  return this * 180 / Math.PI;
}

/**
 * Creates a point on the earth's surface at the supplied latitude / longitude
 *
 * @constructor
 * @param {number} lat: latitude in numeric degrees
 * @param {number} lon: longitude in numeric degrees
 * @param {number} [rad=6371]: radius of earth if different value is required from standard 6,371km
 */
ktree.earth.LatLon = function (lat, lon, rad) {
  if (typeof rad == 'undefined') rad = 6371;  // earth's mean radius in km
  this._lat = lat;
  this._lon = lon;
  this._radius = rad;
}
 
 
/**
 * Returns the distance from this point to the supplied point, in km 
 * (using Haversine formula)
 *
 * from: Haversine formula - R. W. Sinnott, "Virtues of the Haversine",
 *       Sky and Telescope, vol 68, no 2, 1984
 *
 * @param   {ktree.earth.LatLon} point: Latitude/longitude of destination point
 * @param   {number} [precision=4]: no of significant digits to use for returned value
 * @returns {string} Distance in km between this point and destination point
 */
ktree.earth.LatLon.prototype.distanceTo = function(point, precision) {
  // default 4 sig figs reflects typical 0.3% accuracy of spherical model
  if (typeof precision == 'undefined') precision = 4;  
  
  var R = this._radius;
  var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
  var lat2 = point._lat.toRad(), lon2 = point._lon.toRad();
  var dLat = lat2 - lat1;
  var dLon = lon2 - lon1;

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1) * Math.cos(lat2) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d.toPrecision(precision);
	//return d.toPrecisionFixed(precision);
}


/**
 * Returns the (initial) bearing from this point to the supplied point, in degrees
 *   see http://williams.best.vwh.net/avform.htm#Crs
 *
 * @param   {ktree.earth.LatLon} point: Latitude/longitude of destination point
 * @returns {number} Initial bearing in degrees from North
 */
ktree.earth.LatLon.prototype.bearingTo = function(point) {
  var lat1 = this._lat.toRad(), lat2 = point._lat.toRad();
  var dLon = (point._lon-this._lon).toRad();

  var y = Math.sin(dLon) * Math.cos(lat2);
  var x = Math.cos(lat1)*Math.sin(lat2) -
          Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
  var brng = Math.atan2(y, x);
  
  return (brng.toDeg()+360) % 360;
}


/**
 * Returns final bearing arriving at supplied destination point from this point; the final bearing 
 * will differ from the initial bearing by varying degrees according to distance and latitude
 *
 * @param   {ktree.earth.LatLon} point: Latitude/longitude of destination point
 * @returns {number} Final bearing in degrees from North
 */
ktree.earth.LatLon.prototype.finalBearingTo = function(point) {
  // get initial bearing from supplied point back to this point...
  var lat1 = point._lat.toRad(), lat2 = this._lat.toRad();
  var dLon = (this._lon-point._lon).toRad();

  var y = Math.sin(dLon) * Math.cos(lat2);
  var x = Math.cos(lat1)*Math.sin(lat2) -
          Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
  var brng = Math.atan2(y, x);
          
  // ... & reverse it by adding 180°
  return (brng.toDeg()+180) % 360;
}


/**
 * Returns the midpoint between this point and the supplied point.
 *   see http://mathforum.org/library/drmath/view/51822.html for derivation
 *
 * @param   {ktree.earth.LatLon} point: Latitude/longitude of destination point
 * @returns {ktree.earth.LatLon} Midpoint between this point and the supplied point
 */
ktree.earth.LatLon.prototype.midpointTo = function(point) {
  var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
  var lat2 = point._lat.toRad();
  var dLon = (point._lon-this._lon).toRad();

  var Bx = Math.cos(lat2) * Math.cos(dLon);
  var By = Math.cos(lat2) * Math.sin(dLon);

  var lat3 = Math.atan2(Math.sin(lat1)+Math.sin(lat2),
                    Math.sqrt( (Math.cos(lat1)+Bx)*(Math.cos(lat1)+Bx) + By*By) );
  var lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

  return new ktree.earth.LatLon(lat3.toDeg(), lon3.toDeg());
}


/**
 * Returns the destination point from this point having travelled the given distance (in km) on the 
 * given initial bearing (bearing may vary before destination is reached)
 *
 *   see http://williams.best.vwh.net/avform.htm#LL
 *
 * @param   {number} brng: Initial bearing in degrees
 * @param   {number} dist: Distance in km
 * @returns {ktree.earth.LatLon} Destination point
 */
ktree.earth.LatLon.prototype.destinationPoint = function(brng, dist) {
  dist = dist/this._radius;  // convert dist to angular distance in radians
  brng = brng.toRad();  // 
  var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();

  var lat2 = Math.asin( Math.sin(lat1)*Math.cos(dist) + 
                        Math.cos(lat1)*Math.sin(dist)*Math.cos(brng) );
  var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(dist)*Math.cos(lat1), 
                               Math.cos(dist)-Math.sin(lat1)*Math.sin(lat2));
  lon2 = (lon2+3*Math.PI)%(2*Math.PI) - Math.PI;  // normalise to -180...+180

  if (isNaN(lat2) || isNaN(lon2)) return null;
  return new ktree.earth.LatLon(lat2.toDeg(), lon2.toDeg());
}


/**
 * Returns the point of intersection of two paths defined by point and bearing
 *
 *   see http://williams.best.vwh.net/avform.htm#Intersection
 *
 * @param   {ktree.earth.LatLon} p1: First point
 * @param   {number} brng1: Initial bearing from first point
 * @param   {ktree.earth.LatLon} p2: Second point
 * @param   {number} brng2: Initial bearing from second point
 * @returns {ktree.earth.LatLon} Destination point (null if no unique intersection defined)
 */
ktree.earth.LatLon.intersection = function(p1, brng1, p2, brng2) {
  var lat1 = p1.lat.toRad(), lon1 = p1.lon.toRad();
  var lat2 = p2.lat.toRad(), lon2 = p2.lon.toRad();
  var brng13 = brng1.toRad(), brng23 = brng2.toRad();
  var dLat = lat2-lat1, dLon = lon2-lon1;
  
  var dist12 = 2*Math.asin( Math.sqrt( Math.sin(dLat/2)*Math.sin(dLat/2) + 
    Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)*Math.sin(dLon/2) ) );
  if (dist12 == 0) return null;
  
  // initial/final bearings between points
  var brngA = Math.acos( ( Math.sin(lat2) - Math.sin(lat1)*Math.cos(dist12) ) / ( Math.sin(dist12)*Math.cos(lat1) ) );
  if (isNaN(brngA)) brngA = 0;  // protect against rounding
  var brngB = Math.acos( ( Math.sin(lat1) - Math.sin(lat2)*Math.cos(dist12) ) / ( Math.sin(dist12)*Math.cos(lat2) ) );
  
  if (Math.sin(lon2-lon1) > 0) {
    var brng12 = brngA;
    var brng21 = 2*Math.PI - brngB;
  } else {
    var brng12 = 2*Math.PI - brngA;
    var brng21 = brngB;
  }
  
  var alpha1 = (brng13 - brng12 + Math.PI) % (2*Math.PI) - Math.PI;  // angle 2-1-3
  var alpha2 = (brng21 - brng23 + Math.PI) % (2*Math.PI) - Math.PI;  // angle 1-2-3
  
  if (Math.sin(alpha1)==0 && Math.sin(alpha2)==0) return null;  // infinite intersections
  if (Math.sin(alpha1)*Math.sin(alpha2) < 0) return null;       // ambiguous intersection
  
  //alpha1 = Math.abs(alpha1);
  //alpha2 = Math.abs(alpha2);
  // ... Ed Williams takes abs of alpha1/alpha2, but seems to break calculation?
  
  var alpha3 = Math.acos( -Math.cos(alpha1)*Math.cos(alpha2) + Math.sin(alpha1)*Math.sin(alpha2)*Math.cos(dist12) );
  var dist13 = Math.atan2( Math.sin(dist12)*Math.sin(alpha1)*Math.sin(alpha2), 
                       Math.cos(alpha2)+Math.cos(alpha1)*Math.cos(alpha3) )
  var lat3 = Math.asin( Math.sin(lat1)*Math.cos(dist13) + Math.cos(lat1)*Math.sin(dist13)*Math.cos(brng13) );
  var dLon13 = Math.atan2( Math.sin(brng13)*Math.sin(dist13)*Math.cos(lat1), 
                       Math.cos(dist13)-Math.sin(lat1)*Math.sin(lat3) );
  var lon3 = lon1+dLon13;
  lon3 = (lon3+Math.PI) % (2*Math.PI) - Math.PI;  // normalise to -180..180º
  
  return new ktree.earth.LatLon(lat3.toDeg(), lon3.toDeg());
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * Returns the distance from this point to the supplied point, in km, travelling along a rhumb line
 *
 *   see http://williams.best.vwh.net/avform.htm#Rhumb
 *
 * @param   {ktree.earth.LatLon} point: Latitude/longitude of destination point
 * @returns {string} Distance in km between this point and destination point
 */
ktree.earth.LatLon.prototype.rhumbDistanceTo = function(point) {
  var R = this._radius;
  var lat1 = this._lat.toRad(), lat2 = point._lat.toRad();
  var dLat = (point._lat-this._lat).toRad();
  var dLon = Math.abs(point._lon-this._lon).toRad();
  
  var dPhi = Math.log(Math.tan(lat2/2+Math.PI/4)/Math.tan(lat1/2+Math.PI/4));
  var q = (!isNaN(dLat/dPhi)) ? dLat/dPhi : Math.cos(lat1);  // E-W line gives dPhi=0
  // if dLon over 180° take shorter rhumb across 180° meridian:
  if (dLon > Math.PI) dLon = 2*Math.PI - dLon;
  var dist = Math.sqrt(dLat*dLat + q*q*dLon*dLon) * R; 
  
  //return dist.toPrecisionFixed(4);  // 4 sig figs reflects typical 0.3% accuracy of spherical model
  return dist.toPrecision(4);
}

/**
 * Returns the bearing from this point to the supplied point along a rhumb line, in degrees
 *
 * @param   {ktree.earth.LatLon} point: Latitude/longitude of destination point
 * @returns {number} Bearing in degrees from North
 */
ktree.earth.LatLon.prototype.rhumbBearingTo = function(point) {
  var lat1 = this._lat.toRad(), lat2 = point._lat.toRad();
  var dLon = (point._lon-this._lon).toRad();
  
  var dPhi = Math.log(Math.tan(lat2/2+Math.PI/4)/Math.tan(lat1/2+Math.PI/4));
  if (Math.abs(dLon) > Math.PI) dLon = dLon>0 ? -(2*Math.PI-dLon) : (2*Math.PI+dLon);
  var brng = Math.atan2(dLon, dPhi);
  
  return (brng.toDeg()+360) % 360;
}

/**
 * Returns the destination point from this point having travelled the given distance (in km) on the 
 * given bearing along a rhumb line
 *
 * @param   {number} brng: Bearing in degrees from North
 * @param   {number} dist: Distance in km
 * @returns {ktree.earth.LatLon} Destination point
 */
ktree.earth.LatLon.prototype.rhumbDestinationPoint = function(brng, dist) {
  var R = this._radius;
  var d = parseFloat(dist)/R;  // d = angular distance covered on earth's surface
  var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
  brng = brng.toRad();

  var lat2 = lat1 + d*Math.cos(brng);
  var dLat = lat2-lat1;
  var dPhi = Math.log(Math.tan(lat2/2+Math.PI/4)/Math.tan(lat1/2+Math.PI/4));
  var q = (!isNaN(dLat/dPhi)) ? dLat/dPhi : Math.cos(lat1);  // E-W line gives dPhi=0
  var dLon = d*Math.sin(brng)/q;
  // check for some daft bugger going past the pole
  if (Math.abs(lat2) > Math.PI/2) lat2 = lat2>0 ? Math.PI-lat2 : -(Math.PI-lat2);
  var lon2 = (lon1+dLon+3*Math.PI)%(2*Math.PI) - Math.PI;
 
  return new ktree.earth.LatLon(lat2.toDeg(), lon2.toDeg());
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/**
 * Returns the latitude of this point; signed numeric degrees if no format, otherwise format & dp 
 * as per Geo.toLat()
 *
 * @param   {string} [format]: Return value as 'd', 'dm', 'dms'
 * @param   {number} [dp] No of decimal places to display (0, 2, or 4)
 * @returns {number|string|null} Numeric degrees if no format specified, otherwise deg/min/sec
 */
ktree.earth.LatLon.prototype.lat = function(format, dp) {
  if (typeof format == 'undefined') return this._lat;
  
  return null;
	//return Geo.toLat(this._lat, format, dp);
}

/**
 * Returns the longitude of this point; signed numeric degrees if no format, otherwise format & dp 
 * as per Geo.toLon()
 *
 * @param   {string} [format]: Return value as 'd', 'dm', 'dms'
 * @param   {number} [dp]: No of decimal places to display (0, 2, or 4)
 * @returns {number|string|null} Numeric degrees if no format specified, otherwise deg/min/sec
 */
ktree.earth.LatLon.prototype.lon = function(format, dp) {
  if (typeof format == 'undefined') return this._lon;
  
  return null;
	//return Geo.toLon(this._lon, format, dp);
}

/**
 * Returns a string representation of this point; format and dp as per lat()/lon()
 * @returns {string | null}
 */
ktree.earth.LatLon.prototype.toString = function(format, dp) {
  if (typeof format == 'undefined') format = 'dms';
  
  return null;
	//return Geo.toLat(this._lat, format, dp) + ', ' + Geo.toLon(this._lon, format, dp);
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */