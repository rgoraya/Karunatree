goog.provide('ktree.kml.KtxCache');

goog.require('ktree.debug');
goog.require('ktree.kml.constants');

goog.require('goog.array');
goog.require('goog.dom.xml');
goog.require('goog.json');
goog.require('goog.structs.Map');
goog.require('goog.ds.XmlDataSource');


/**
*	@fileoverview
*	The KTXCache is responsible for storing a subset of the KTX/KML commands that KTXInterpreter
*	extracts from remote KTX (.xml) files. Caching allows the Earth view to refresh appropriately when
*	the user navigates between scenes without repeatedly reloading the same data sources from the server.
*	
*	Last version 02.26.10
*
*	@version 0.2
*	@author Derek Lyons
*/


/**
*	A KtxCache
*	@constructor
*/
ktree.kml.KtxCache = function() {
	
	/**
	*	Storage for view-related KTX commands
	*	@private
	*	@type {goog.structs.Map}
	*/
	this.viewCacheMap_ = new goog.structs.Map();
	
	/**
	*	Cache of illustrations associated with KML features
	*	Key {string}: KML feature name
	*	Value {string}: Illustration file name 
	*	@private
	*	@type {goog.structs.Map}
	*/
	this.illustrationCacheMap_ = new goog.structs.Map();
	
	/**
	*	Cache of appearance cues (scene/subscene) for KML features
	*	Key {string}: KML feature name
	*	Value {Object}: scene {string} and subscene {integer} for appearance
	*/
	this.appearCacheMap_ = new goog.structs.Map();
	
	/**
	*	Cache if hiding cues (scene/subscene) for KML features
	*/
	this.hideCacheMap_ = new goog.structs.Map();
	
	this.coordsCacheMap_ = new goog.structs.Map();
}


/**
*	Recurrent function that walks through an XML data source tree looking 
*	for KTX commands to cache. When KTX commands are found they are stored
*	for later recall.
*	@private
*	@param {string} dataSourceName			A unique identifier for this XML data source
*	@param {goog.ds.XmlDataSource|goog.ds.DataNode} node	The XML node from which to begin walking
*/
ktree.kml.KtxCache.prototype.buildCacheForXmlDataSource = function(dataSourceName, node) {
	ktree.debug.logInfo('KtxCache is building a cache for data source <' + dataSourceName + '>'); 
	
	var nodeDataName = node.getDataName();
	
	if (this.shouldStepIntoNode_(nodeDataName)) {
		ktree.debug.logInfo('Stepping into node: <' + nodeDataName + '>...');
		
		var children = node.getChildNodes();
		var numChildren = children.getCount();
		for (var i = 0; i < numChildren; i++) {
			var child = children.getByIndex(i);
			this.buildCacheForXmlDataSource(dataSourceName, child);
		}
	}
	
	else if (nodeDataName == "LookAt" || nodeDataName == "Camera") {
		this.cacheViewNode_(node);
	}
	
	else if (nodeDataName == "Placemark") {
		this.cachePlacemarkNode_(node);
	}
}


/**
*	Retrieve the fly-to-speed specified for a particular view
*	@public
*	@param {string} viewId		A unique identifier for the requested view
*	@returns {number}			The fly-to-speed for the specified view. May be null if no speed has been specified.
*/
ktree.kml.KtxCache.prototype.flyToSpeedForView = function(viewId) {
	return parseFloat(this.viewCacheMap_.get(viewId));
}


/**
*	Retrieve the name of the illustration corresponding to a particular placemark
*	@public
*	@param {string} placemarkName		The name of the requested placemark
*	@returns {?string}					The name of the illustration for the placemark. May be null if no illustration 
*										has been specified.
*/
ktree.kml.KtxCache.prototype.illustrationForPlacemark = function(placemarkName) {
	var illustration = this.illustrationCacheMap_.get(placemarkName);
	if(goog.isString(illustration)) {
		return illustration;
	}
	else {
		ktree.debug.logError('KtxCache reports that it retrieved an unexpected result type (non-string) while trying to retrieve the illustration for a placemark.')
		return null;
	}
}

/**
*	@returns {Array} Names of features to appear for this scene; may be null.
*/
ktree.kml.KtxCache.prototype.featuresToAppearForScene = function(sceneName, subscene) {
	return this.featuresToChangeVisibilityForScene_(this.appearCacheMap_, sceneName, subscene);
}

/**
*	@returns {Array} Names of features to hide for this scene; may be null
*/
ktree.kml.KtxCache.prototype.featuresToHideForScene = function(sceneName, subscene) {
	return this.featuresToChangeVisibilityForScene_(this.hideCacheMap_, sceneName, subscene);
}

ktree.kml.KtxCache.prototype.coordinatesForPlacemark = function(placemarkName) {
	return this.coordsCacheMap_.get(placemarkName);
}

ktree.kml.KtxCache.prototype.updateCoordinatesForPlacemark = function(placemarkName, lat, lon) {
	var coords = this.coordsCacheMap_.get(placemarkName);
	if (coords) {
		coords.set("latitude", lat);
		coords.set("longitude", lon);
	}
	this.coordsCacheMap_.set(placemarkName, coords);
}


/**
*	@private
*/
ktree.kml.KtxCache.prototype.featuresToChangeVisibilityForScene_ = function(cacheMap, sceneName, subscene) {
	var arrayForSubscene = null;
	var mapForScene = cacheMap.get(sceneName);
	if (mapForScene) {
		arrayForSubscene = mapForScene.get(subscene);
	}
	return arrayForSubscene;
}



/**
*	Returns whether the argument node type is one that may contain nested
*	KTX commands
*
*	@private
*	@param {string}		nodeDataName	DataName for the node in question
*	@return {boolean}	Can nodes of this type have nested KTX commands?
*/
ktree.kml.KtxCache.prototype.shouldStepIntoNode_ = function(nodeDataName) {
	if (goog.string.startsWith(nodeDataName, ktree.kml.constants.KML_ROOT_PREFIX)) {
		return true;
	}
	else {
		switch(nodeDataName) {
			case "kml": 		return true;
			case "Folder": 		return true; 
			case "Document": 	return true;
			default: 			return false;
		}
	}
}


/**
*	Cache KTX commands associated with a view node (if present)
*	@private
*	@param {goog.ds.DataNode} node		The view node to examine
*/
ktree.kml.KtxCache.prototype.cacheViewNode_ = function(node) {
	var flyToSpeed = node.getChildNodeValue(ktree.kml.constants.FLY_TO_SPEED);
	if (flyToSpeed) {
		var nodeId = node.getChildNodeValue("@id");
		if (nodeId) {
			ktree.debug.logFine("KtxCache is caching view node <" + nodeId + "> with flyToSpeed <" + flyToSpeed + ">");
			this.viewCacheMap_.set(nodeId, flyToSpeed);
		}
		else {
			ktree.debug.logError("KtxCache can't cache view nodes with no ID specified.");
		}	
	}
}


/**
*	Cache KTX commands associated with a placemark node (if present)
*	@private
*	@param {goog.ds.DataNode} node		The placemark node to examine
*/
ktree.kml.KtxCache.prototype.cachePlacemarkNode_ = function(node) {
	var illustration = node.getChildNodeValue(ktree.kml.constants.ILLUSTRATION);
	var appearJsonString = node.getChildNodeValue(ktree.kml.constants.APPEAR);
	var hideJsonString = node.getChildNodeValue(ktree.kml.constants.HIDE);
	var coords = node.getChildNode("Point").getChildNodeValue("coordinates");
	
	if (illustration || appearJsonString || hideJsonString) {
		var nodeName = node.getChildNodeValue("name");
		if (nodeName) {
			if (illustration) {
				ktree.debug.logFine("KtxCache is caching illustration <" + illustration + "> for placemark <" + nodeName + ">");
				this.illustrationCacheMap_.set(nodeName, illustration);
			}
			if (appearJsonString) {
				ktree.debug.logFine("KtxCache is caching an appear cue for placemark <" + nodeName + ">");
				var appearObject = goog.json.parse(appearJsonString);
				this.cacheVisibilityDataForFeature_(nodeName, this.appearCacheMap_, appearObject);
			}
			if (hideJsonString) {
				ktree.debug.logFine("KtxCache is caching a hide cue for placemark <" + nodeName + ">");
				var hideObject = goog.json.parse(hideJsonString);
				this.cacheVisibilityDataForFeature_(nodeName, this.hideCacheMap_, hideObject)
			}
			if (coords) {
				ktree.debug.logFine("KtxCache is caching coordinates for placemark <" + nodeName + ">");
				var coordsArray = coords.split(",");
				var coordsMap = new goog.structs.Map();
				// FIXME
				coordsMap.set("longitude", parseFloat(coordsArray[0]));
				coordsMap.set("latitude", parseFloat(coordsArray[1]));
				coordsMap.set("altitude", parseFloat(coordsArray[2]));
				this.coordsCacheMap_.set(nodeName, coordsMap);
			}
		}
		else {
			ktree.debug.logError("KtxCache can't cache placemarks with no ID specified.");
		}
	}
}


ktree.kml.KtxCache.prototype.cacheVisibilityDataForFeature_ = function(featureName, cacheMap, visibilityObject) {
	// Try to retrieve a map for the scene
	var mapForScene = cacheMap.get(visibilityObject.scene);
	
	// If there IS NOT a map for this scene...
	if (!mapForScene) {
		// Start an array of features that will appear or disappear for this scene/subscene
		var featureArray = [];
		goog.array.insert(featureArray, featureName);
		
		// Use the subscene as a key to put the array into a new map
		var subsceneMap = new goog.structs.Map();
		subsceneMap.set(visibilityObject.subscene, featureArray);
		
		// Use the scene as a key to put the subscene map into a new map
		cacheMap.set(visibilityObject.scene, subsceneMap);
	}
	
	// If there IS a map for the scene...
	else {
		var arrayForSubscene = mapForScene.get(visibilityObject.subscene);
		
		// If there IS NOT an array for the subscene...
		if (!arrayForSubscene) {
			// Start an array of features to appear for this subscene
			var featureArray = [];
			goog.array.insert(featureArray, featureName);

			// Use the subscene as a key to put the array into the scene's map
			mapForScene.set(visibilityObject.subscene, featureArray);
		}
		
		// If there IS an array for the subscene...
		else {
			goog.array.insert(arrayForSubscene, featureName);
		}
	}
}

