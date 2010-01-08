goog.provide('ktree.ktx.KtxManager');

goog.require('ktree.debug');
goog.require('ktree.ktx.KtxInterpreter');
goog.require('ktree.ktx.KtxCache');

goog.require('goog.structs.Set');
goog.require('goog.ds.DataManager');
goog.require('goog.ds.XmlHttpDataSource');
goog.require('goog.ds.LoadState');
goog.require('goog.async.ConditionalDelay');

/**
*	@fileoverview
*	The KtxManager class implements the logic needed to load KTX (.xml) files from remote addresses,
*	and manage the goog.ds.XmlHttpDataSource objects which are used to locally represent and manipulate
*	the contents of the files. The KtxManager does not itself know how to actually interpret the KTX files
*	that it loads and manages; for that functionality see the KtxInterpreter
*	@see {ktree.ktx.KtxInterpreter}
*
*	@version 0.2
*/

/**
*	A KtxManager
*	@constructor
*/
ktree.ktx.KtxManager = function(world) {
	
	/**
	*	A pointer to the singleton goog.ds.DataManager instance
	*	@private
	*	@type {goog.ds.DataManager}
	*/
	this.dm_ = goog.ds.DataManager.getInstance();
	
	/**
	*	A reference to the World object that will eventually display
	*	the contents of the KTX files
	*	@private
	*	@type {ktree.GoogleEarth}
	*/
	this.world_ = world;
	
	this.cache_ = new ktree.ktx.KtxCache(this.world_);
	
	/**
	*	The KtxInterpreter object that the Manager uses to parse
	*	and interpret KTX files
	*	@private
	*	@type {ktree.ktx.KtxInterpreter}
	*/
	this.interpreter_ = new ktree.ktx.KtxInterpreter(this.world_, this.cache_);
	
	this.loadedDsNames_ = new goog.structs.Set();
}

ktree.ktx.KtxManager.prototype.ktx = function(dsName, uri) {
	if (this.cache_.hasCacheForScene(dsName)) {
		this.cache_.retrieveCacheForScene(dsName);
	}
	else {
		this.loadKtx_(uri, dsName);
	}
}


/**
*	Load a remote KTX (.xml) file and pass it to the KtxInterpreter for
*	parsing and interpretation.
*	@public 
*	@param {string} uri 				The URI for the KTX (.xml) file to load
*	@param {string} dsName 				A string identifier by which the goog.ds.XmlHttpDataSource corresponding
*										to the input file will be referenced
*/
ktree.ktx.KtxManager.prototype.loadKtx_ = function(uri, dsName) {
	
	ktree.debug.logInfo('Creating new KTX XmlHttpDataSource <' + dsName + '> with data from URI <' + uri + '>...');
	var dataSource = new goog.ds.XmlHttpDataSource(uri, dsName);	
	dataSource.load();
	
	var conditionalDelay = new goog.async.ConditionalDelay(
		function() {
			return (dataSource.getLoadState() == goog.ds.LoadState.LOADED);
		}
	);
	var target = this;
	conditionalDelay.onFailure = function() {
		ktree.debug.logError('KTX XmlHttpDataSource <' + dsName + '> could not load data from URI <' + uri + '>');
	}
	conditionalDelay.onSuccess = function() {
		ktree.debug.logInfo('KTX XmlHttpDataSource <' + dsName + '> has finished loading succesfully');
		target.dm_.addDataSource(dataSource);
		target.loadedDsNames_.add(dsName);
		target.interpreter_.parse(dsName, dataSource);
	}
	conditionalDelay.start(100, 5000);
}