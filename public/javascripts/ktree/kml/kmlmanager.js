/**
*   Karunatree
*   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
*   
*   Author: Derek Lyons
*
**/

goog.provide('ktree.kml.KmlManager');

goog.require('ktree.debug');
goog.require('ktree.config');

goog.require('goog.string');
goog.require('goog.dom.xml');
goog.require('goog.ds.DataManager');
goog.require('goog.ds.XmlDataSource');
goog.require('goog.ds.XmlHttpDataSource');
goog.require('goog.ds.LoadState');
goog.require('goog.async.ConditionalDelay');


/**
*	@fileoverview
*	The KmlManager class is responsible for loading KML data, pre-processing it to identify KarunaTree extension (KTX)
*	commands for caching, and transmitting serialized KML to the World for display.
*
*	KML data can be loaded from remote .xml files, from strings, or from an automatically updated cache of previously
*	loaded data.
*
*	Note that while the KmlManager class knows how to parse KTX commands out of KML, it does not know how to do anything
*	with those commands other than cache them. See ktree.kml.KtxCache for details on how KTX commands are eventually
*	communicated to the World.
*
*	@see {ktree.kml.KtxCache}
*
*	@version 0.3
*	@author Derek Lyons
*/


/**
*	A KmlManager
*	@constructor
*/
ktree.kml.KmlManager = function(world) {
	
	/**
	*	A pointer to the singleton goog.ds.DataManager instance
	*	@private
	*	@type {goog.ds.DataManager}
	*/
	this.dm_ = goog.ds.DataManager.getInstance();
	
	/**
	*	A reference to the World object that will eventually display
	*	the contents of the KML files
	*	@private
	*	@type {ktree.GoogleEarth}
	*/
	this.world_ = world;
	
	/**
	*	The KTX cache to which the KmlManager will save
	*	any KTX commands it finds while processing KML data
	*	@private
	*	@type {ktree.kml.KtxCache}
	*/
	this.ktxCache_ = new ktree.kml.KtxCache();
	
	this.world_.installKtxCache(this.ktxCache_);
	//this.findAndLoadKml('Clock', goog.string.buildString(ktree.config.URL_KML_PATH, 'clock.xml'));
}

ktree.kml.KmlManager.prototype.sceneIsLoading = function(sceneName, subscene) {
	this.world_.sceneIsLoading(sceneName, subscene);
}

ktree.kml.KmlManager.prototype.loadConfigurationKml = function() {
}


/**
*	Loads KML for the specified data source. If the data source has been previously
*	loaded, the KML will be retrieved from a cache. If the data source is new,
*	the method will attempt to load it from a URI. Once loaded the KML data source
*	is processed and displayed.
*	@public
*	@param {string} datasourceName		A unique identifier for this KML data source
*	@param {string} uri					A URI from which the KML for the data source can be retrieved
*/
ktree.kml.KmlManager.prototype.findAndLoadKml = function(datasourceName, uri) {
	var kmlCached = false;
	if (this.world_.apiReady()) {
		kmlCached = this.world_.tryLoadingKmlForScene(datasourceName);
	}
	if (!kmlCached) {
		this.loadKmlFromUri_(datasourceName, uri);
	}
}


/**
*	Loads KML for the specified data source from a string. Once loaded the KML data source
*	is processed and displayed.
*	@public
*	@param {string} dataSourceName		A unique identifier for this KML data source
*	@param {string} kmlString			A string representation of the KML to load, expected to be wrapped in double quotes.
*/
ktree.kml.KmlManager.prototype.loadKmlFromString = function(dataSourceName, kmlString) {
	//Note when restoring KML from the database, the string comes wrapped
	//in double quotes to preserve the linebreak characters it contains.
	var cleanString = goog.string.stripQuotes(kmlString, '"');
	var xmlDoc = goog.dom.xml.loadXml(cleanString);
	var dataSource = new goog.ds.XmlDataSource(xmlDoc);
	this.dm_.addDataSource(dataSource);
	this.cacheKtxCommands_(dataSourceName, dataSource);
}


/**
*	Loads KML for the specified data source by retrieving it from a remote KML (.xml) file.
*	Once loaded the KML data source is processed and displayed.
*	@private 
*	@param {string} datasourceName			A unique identifier for this KML data source
*	@param {string} uri 					The URI for the KML (.xml) file to load
*/
ktree.kml.KmlManager.prototype.loadKmlFromUri_ = function(datasourceName, uri) {
	var target = this;
	ktree.debug.logInfo('Creating new KML XmlHttpDataSource <' + datasourceName + '> with data from URI <' + uri + '>...');
	var dataSource = new goog.ds.XmlHttpDataSource(uri, datasourceName);	
	dataSource.load();
	
	var conditionalDelay = new goog.async.ConditionalDelay(
		function() {
			return (dataSource.getLoadState() == goog.ds.LoadState.LOADED);
		}
	);
	conditionalDelay.onFailure = function() {
		ktree.debug.logError('KML XmlHttpDataSource <' + datasourceName + '> could not be created from URI <' + uri + '>');
	}
	conditionalDelay.onSuccess = function() {
		ktree.debug.logInfo('KML XmlHttpDataSource <' + datasourceName + '> successfully created from URI <' + uri + '>');
		target.dm_.addDataSource(dataSource);
		target.cacheKtxCommands_(datasourceName, dataSource);
	}
	conditionalDelay.start(100, 5000);
}


/**	
*	TODO: This function shouldn't need to know the name of the parent data source. That decision should be
*	handled by GoogleEarth
*
*	Caches KTX commands from an argument KML data source. Once the data source has been processed it is
*	transmitted to the world for display
*	@private
*	@param {string} dataSourceName				A unique identifier for the KML data source being processed
*	@param {goog.ds.XmlDataSource} dataSource 	The KML data source to extract KTX commands from
*	@param {string} [parentName]				Optional. An identifier for the KML data source to which the
*												argument data source should be parented
*/
ktree.kml.KmlManager.prototype.cacheKtxCommands_ = function(dataSourceName, dataSource) {	
	ktree.debug.logGroupHidden('KmlManager is caching KTX commands from KML data source <' + dataSourceName + '>...');
	ktree.debug.logElement(dataSource.getElement());
	this.ktxCache_.buildCacheForXmlDataSource(dataSourceName, dataSource);
	var kmlString = goog.dom.xml.serialize(dataSource.getElement());
	ktree.debug.logGroupEnd();
	
	if(this.world_.apiReady()) {
		this.sendKmlToWorld_(kmlString);
	}
	else {
		this.delayedSendKmlToWorld_(kmlString);
	}
}


/**
*	Transmit KML to the World for display. Note that this method does NOT check to see 
*	whether the World object's API is actually ready to receive KML. For that functionality, 
*	ktree.kml.KmlManager.delayedSendKmlToWorld_() should be used.
*	@see {ktree.kml.KmlManager#delayedSendKmlToWorld_}
*	@private
*	@param {string} kmlString				The string of KML to transmit to the World
*	@param {string} [parentName]			Optional. An identifier for the KML node to which the
*											argument KML data should be parented
*/
ktree.kml.KmlManager.prototype.sendKmlToWorld_ = function(kmlString, parentName) {
	this.world_.addKml(kmlString, parentName);
}


/**
*	Delays transmission of KML to the World until the World's API is ready to receive it
*	@see {ktree.ktx.KtxInterpreter#sendKmlToWorld_}
*	@private
*	@param {string} kmlString				The string of KML to transmit to the World
*	@param {string} [parentName]			Optional. An identifier for the KML node to which the
*											argument KML data should be parented
*/
ktree.kml.KmlManager.prototype.delayedSendKmlToWorld_ = function(kmlString, parentName) {
	ktree.debug.logInfo('The KmlManager is delaying transmission of commands while GoogleEarth finishes initializing');
	var target = this;
	var conditionalDelay = new goog.async.ConditionalDelay(
		function() {
			return (target.world_.apiReady());
		}
	);
	conditionalDelay.onFailure = function() {
		ktree.debug.logError('The KmlManager timed out waiting for GoogleEarth to initialize');
	}
	conditionalDelay.onSuccess = function() {
		ktree.debug.logInfo('The KmlManager reports that GoogleEarth has finished initializing. Sending delayed commands...');
		target.sendKmlToWorld_(kmlString, parentName);
	}
	conditionalDelay.start(100, ktree.config.GE_API_INIT_TIMEOUT);
}