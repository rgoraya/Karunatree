goog.provide('ktree.ktx.KtxManager');

goog.require('ktree.debug');
goog.require('ktree.ktx.KtxInterpreter');

goog.require('goog.ds.DataManager');
goog.require('goog.ds.XmlHttpDataSource');
goog.require('goog.ds.LoadState');
goog.require('goog.async.ConditionalDelay');

/**
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
	*	@private
	*	@type {ktree.GoogleEarth}
	*/
	this.world_ = world;
	
	/**
	*	The KtxInterpreter object that the Manager uses to parse
	*	and interpret KTX files
	*	@private
	*	@type {ktree.ktx.KtxInterpreter}
	*/
	this.interpreter_ = new ktree.ktx.KtxInterpreter(this.world_);
}


/**
*	Load a remote KTX file and render the results in the World.
*	@public 
*	@param {string} uri 				The URI for the KTX (.xml) file to load
*	@param {string} dsName 				A string identifier by which the newly created KtxDataSource will be referenced
*/
ktree.ktx.KtxManager.prototype.loadKtx = function(uri, dsName) {
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
		target.interpreter_.parse(dataSource);
	}
	conditionalDelay.start(100, 5000);
}

/**
*	Parse KTX from an argument KtxDataSource. If the World is ready, transmit the results for rendering.
*	If the world is not yet ready, cache the results and retry transmission later
*	@private
*	@param {ktree.ktx.KtxDataSource} ktxDataSource The source of the KTX data to be parsed/transmitted
*/
ktree.ktx.KtxManager.prototype.parseKtx_ = function(ktxDataSource) {
	if(this.world_.apiReady()) {
		alert('GE is ready for data');
	}
	else {
		alert('GE is not yet ready for data');
	}
}


ktree.ktx.KtxManager.prototype.waitToGetKtxDataSource = function(dsName) {
	
	var target = this;
	var foundDataSource;
	
	var conditionalDelay = new goog.async.ConditionalDelay(
		function() {
			var dataSource = target.dm_.getDataSource(dsName);
			if (goog.isNull(dataSource)) {
				if (goog.array.contains(target.failedDataSources_, dsName)) {
					foundDataSource = false;
					return true;
				}
				else return false;
			}
			else {
				foundDataSource = true;
				return true;
			}	
		}
	);

	conditionalDelay.onFailure = function() {
		ktree.debug.logError('Timed out while trying to retrieve KTX DataSource <' + dsName + '> from the DataManager');
		goog.array.insert(target.failedDataSources_, dsName);
	}
	conditionalDelay.onSuccess = function() {
		ktree.debug.logInfo('KTX DataSource <' + dsName + '> has finished loading succesfully');
		target.dm_.addDataSource(dataSource);
		target.currentDsName_ = dsName;
	}
	conditionalDelay.start(100, 5000);
	
	var dataSource = this.dm_.getDataSource(dsName);
	if (goog.isNull(dataSource)) {
		ktree.debug.logError('KTX DataSource <' + dsName + '> could not be retrieved from the DataManager');
	}
	else {
		ktree.debug.logFine('Retrieving KTX DataSource <' + dsName + '> from DataManager');
	}
	return dataSource;
}