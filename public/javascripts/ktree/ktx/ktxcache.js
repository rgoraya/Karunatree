goog.provide('ktree.ktx.KtxCache');

goog.require('ktree.debug');

goog.require('goog.structs.Map');
goog.require('goog.ds.BasicNodeList');
goog.require('goog.dom.xml');

/**
*	@fileoverview
*	The KTXCache is responsible for storing a subset of the KTX/KML commands that KTXInterpreter
*	extracts from remote KTX (.xml) files. Caching allows the Earth view to refresh appropriately when
*	the user navigates between scenes without repeatedly reloading the same data sources from the server.
*	
*	@version 0.1
*/

ktree.ktx.KtxCache = function(world) {
	this.world_ = world;
	
	this.cacheMap_ = new goog.structs.Map();
	
	/**
	*	@type {goog.ds.BasicNodeList}
	*/
	this.currentCache_ = null;
	
	/**
	*	@type {string}
	*/
	this.currentScene_ = null;
}

ktree.ktx.KtxCache.prototype.hasCacheForScene = function(sceneName) {
	if (this.cacheMap_.containsKey(sceneName)) return true;
	else return false;
}

ktree.ktx.KtxCache.prototype.openCacheForScene = function(sceneName) {
	this.currentScene_ = sceneName;
	this.currentCache_ = new goog.ds.BasicNodeList();
}

/**
*	@param {goog.ds.XmlDataSource} node 
*/
ktree.ktx.KtxCache.prototype.cacheNode = function(node) {
	if (!this.currentCache_) {
		ktree.debug.logError('KTX Cache was asked to add a node with no current scene opened for caching!');
		return;
	}
	
	var dataName = node.getDataName();
	ktree.debug.logElement(node.getElement(), "KTX Cache has received a new node:")
	this.currentCache_.add(node);
}

ktree.ktx.KtxCache.prototype.closeCacheForScene = function() {
	this.cacheMap_.set(this.currentScene_, this.currentCache_);
	this.currentScene_ = null;
	this.currentCache_ = null;
}

ktree.ktx.KtxCache.prototype.retrieveCacheForScene = function(sceneName) {
	ktree.debug.logGroupHidden('KTX Cache is retrieving nodes for scene <' + sceneName + '>...');
	var cache = this.cacheMap_.get(sceneName);
	var numNodes = cache.getCount();
	for (var i = 0; i < numNodes; i++) {
		var node = cache.getByIndex(i);
		ktree.debug.logElement(node.getElement(), "Retrieved a node of type <" + node.getDataName() + '>');
		var nodeString = goog.dom.xml.serialize(node.getElement());
		// This is a workaround to remove the NS declaration that goog.dom.xml.serialize() inserts when serializing a node
		nodeString = goog.string.remove(nodeString, ktree.ktx.KML_NAMESPACE_DECLARATION);
		nodeString = goog.string.buildString(ktree.ktx.KML_HEADER, nodeString, ktree.ktx.KML_FOOTER);
		ktree.debug.logInfo('...Node serialized to string:\n' + nodeString);
		this.world_.parseKml(nodeString);
	}
	ktree.debug.logGroupEnd();
}

