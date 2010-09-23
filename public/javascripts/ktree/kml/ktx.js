/**
*   Karunatree
*   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
*   
*   Author: Derek Lyons
*
**/

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
ktree.ktx.KTX_ROOT_PREFIX = "$";

ktree.ktx.KML_HEADER = '<kml>\n<Document>\n';

ktree.ktx.KML_FOOTER = '\n</Document>\n</kml>';

//ktree.ktx.KML_NAMESPACE_DECLARATION = ' xmlns="http://www.opengis.net/kml/2.2"'

/**
*	The prefix string used to identify KTX commands embedded within a KTX (.xml) file
*	@type {string}
*/
ktree.ktx.KTX_NODE_PREFIX = "ktx:";

ktree.ktx.FLY_TO_SPEED = "ktx:flyToSpeed";

ktree.ktx.ILLUSTRATION = "ktx:illustration";

/**
*	Constant used to request a flyTo speed of "teleport" (e.g. instant travel) from
*	the World object
*	@type {number}
*/
ktree.ktx.SPEED_TELEPORT = 6;