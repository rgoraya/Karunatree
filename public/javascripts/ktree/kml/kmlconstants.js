goog.provide('ktree.kml.constants');

/**
*	@fileoverview
*	Defines constants used in the ktree.kml package, including labels for KarunaTree's 
*	KML namespace extension KTX.
*
*	Last version update: 02.26.10
*
*	@version 0.3
*	@author Derek Lyons
*/

/**
*	The prefix string used to identify the root of a KML (.xml) file in the context
*	of a goog.ds.XmlDataSource
*	@type {string}
*/
ktree.kml.constants.KML_ROOT_PREFIX = "$";

/**
*	The prefix string used to identify KTX commands embedded within a KTX (.xml) file
*	@type {string}
*/
ktree.kml.constants.KTX_NODE_PREFIX = "ktx:";

/**
*	String used to identify fly-to-speed KTX nodes
*/
ktree.kml.constants.FLY_TO_SPEED = "ktx:flyToSpeed";

/**
*	String used to identify illustration KTX nodes
*/
ktree.kml.constants.ILLUSTRATION = "ktx:illustration";

/**
*	
*/
ktree.kml.constants.APPEAR = "ktx:appear"

ktree.kml.constants.HIDE = "ktx:hide"

/**
*	Constant used to request a flyTo speed of "teleport" (e.g. instant travel) from
*	the World object
*	@type {number}
*/
ktree.kml.constants.SPEED_TELEPORT = 6;