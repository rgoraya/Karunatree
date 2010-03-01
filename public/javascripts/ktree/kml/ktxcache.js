goog.provide('ktree.kml.KtxCache');

goog.require('ktree.debug');
goog.require('ktree.kml.constants');

goog.require('goog.dom.xml');
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
	*	Storage for placemark-related KTX commands
	*	@private
	*	@type {goog.structs.Map}
	*/
	this.placemarkCacheMap_ = new goog.structs.Map();
}


/**
*	Recurrent function that walks through an XML data source tree looking 
*	for KTX commands to cache. When KTX commands are found they are stored
*	for later recall.
*	@private
*	@param {string} dataSourceName			A unique identifier for this XML data source
*	@param {goog.ds.XmlDataSource} node		The XML node from which to begin walking
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
*	@returns {float}			The fly-to-speed for the specified view. May be null if no speed has been specified.
*/
ktree.kml.KtxCache.prototype.flyToSpeedForView = function(viewId) {
	return parseFloat(this.viewCacheMap_.get(viewId));
}


/**
*	Retrieve the name of the illustration corresponding to a particular placemark
*	@public
*	@param {string} placemarkName		The name of the requested placemark
*	@returns {string}					The name of the illustration for the placemark. May be null if no illustration 
*										has been specified.
*/
ktree.kml.KtxCache.prototype.illustrationForPlacemark = function(placemarkName) {
	return this.placemarkCacheMap_.get(placemarkName);
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
			case "#document":	return true;
			case "kml": 		return true; 
			case "Document": 	return true;
			case "Folder": 		return true;
			default: 			return false;
		}
	}
}


/**
*	Cache KTX commands associated with a view node (if present)
*	@private
*	@param {goog.ds.XmlDataSource} node		The view node to examine
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
*	@param {goog.ds.XmlDataSource} node		The placemark node to examine
*/
ktree.kml.KtxCache.prototype.cachePlacemarkNode_ = function(node) {
	var illustration = node.getChildNodeValue(ktree.kml.constants.ILLUSTRATION);
	if (illustration) {
		var nodeName = node.getChildNodeValue("name");
		if (nodeName) {
			ktree.debug.logFine("KtxCache is caching placemark <" + nodeName + "> with illustration <" + illustration + ">");
			this.placemarkCacheMap_.set(nodeName, illustration);
		}
		else {
			ktree.debug.logError("KtxCache can't cache placemarks with no ID specified.");
		}
	}
}

