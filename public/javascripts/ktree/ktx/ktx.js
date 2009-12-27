goog.provide('ktree.ktx');

/**
*	@fileoverview
*	Defines constants in the ktree.ktx namespace which are used by the KtxInterpreter to make
*	sense of KTX commands
*	@see {ktree.ktx.KtxInterpreter}
*/

/**
*	The prefix string used to identify the root of a KTX (.xml) file in the context
*	of a goog.ds.XmlDataSource
*	@type {string}
*/
ktree.ktx.KTX_ROOT_PREFIX = "$";

/**
*	The prefix string used to identify KTX commands embedded within a KTX (.xml) file
*	@type {string}
*/
ktree.ktx.KTX_NODE_PREFIX = "ktx:";

/**
*	Constant used to request a flyTo speed of "teleport" (e.g. instant travel) from
*	the World object
*	@type {number}
*/
ktree.ktx.SPEED_TELEPORT = 6;

ktree.ktx.KML_HEADER = '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:ktx="http://www.karunatree.com/kml/ext/2.2">\n<Document>\n';

ktree.ktx.KML_FOOTER = '\n</Document>\n</kml>';

ktree.ktx.KML_NAMESPACE_DECLARATION = ' xmlns="http://www.opengis.net/kml/2.2"'