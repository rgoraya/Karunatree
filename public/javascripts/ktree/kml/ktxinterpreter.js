goog.provide('ktree.ktx.KtxInterpreter');

goog.require('ktree.debug');
goog.require('ktree.ktx');
goog.require('ktree.World');
goog.require('ktree.ktx.KtxCache');

goog.require('goog.ds.BasicNodeList');
goog.require('goog.ds.XmlDataSource');
goog.require('goog.async.Delay');
goog.require('goog.dom.xml');
goog.require('goog.string');

/**
*	@fileoverview
*	The KTXInterpreter is responsible for converting a KTX (.xml) file, represented
*	internally as a goog.ds.XmlDataSource, into a series of KTX commands and KML strings
*	for the World to render
*
*	@version 0.3
*	@author Derek Lyons
*
*	@deprecated
*/

/**
*	A KTX interpreter
*	@constructor
*/
ktree.ktx.KtxInterpreter = function(world, cache) {
	/**
	*	The World object to which the Interpreter should direct
	*	its output
	*	@private
	*	@type {ktree.World}
	*/
	this.world_ = world;
		
	/**
	*	A list of KTX commands awaiting transmission to the World
	*	@private
	*	@type {goog.ds.BasicNodeList}
	*/
	this.ktxQueue_;
	
	/**
	*	A string of KML awaiting transmission to the World
	*	@private
	*	@type {string}
	*/
	this.kmlString_;
	
	this.ktxCache_ = new ktree.ktx.KtxCache();
	this.world_.installKtxCache(this.ktxCache_);
}


/**
*	//TODO Should the transmission to the World object happen here or in the KtxManager?
*	
*	Parse KTX from an argument goog.ds.XmlDataSource. If the World is ready, transmit the results 
*	(i.e. interpreted KTX commands and a KML string) for rendering.
*	If the world is not yet ready, cache the results and retry transmission later
*	@private
*	@param {goog.ds.XmlDataSource} dataSource The source of the KTX data to be parsed
*/
ktree.ktx.KtxInterpreter.prototype.processKml = function(dsName, dataSource, parentName) {	
	// The KTX command queue and KML string are cleared at the start of each parsing run
	this.ktxQueue_ = new goog.ds.BasicNodeList();
	this.kmlString_ = null;
		
	ktree.debug.logGroupHidden('KtxInterpreter is processing the XML tree for <' + dsName + '>...');
	ktree.debug.logElement(dataSource.getElement());
	this.ktxCache_.buildCacheForXmlDataSource(dsName, dataSource);
	this.kmlString_ = goog.dom.xml.serialize(dataSource.getElement());
	ktree.debug.logGroupEnd();
	
	if(this.world_.apiReady()) {
		this.sendCommands_(parentName);
	}
	else {
		this.delayedSendCommands_(parentName);
	}
}


/**
*	Send commands to the World. Two messages are sent: first, a sequence of
*	interpreted KTX commands are dispatched (as function calls on the World object);
*	second, a string of KML is sent to be rendered by the World. Note that this
* 	method does NOT check to see whether the World object's API is actually ready
*	to receive commands. For that functionality, delaySendCommands_() should be used.
*	@see {ktree.ktx.KtxInterpreter#delayedSendCommands_}
*	@private
*/
ktree.ktx.KtxInterpreter.prototype.sendCommands_ = function(parentName) {
	//this.interpretKtxCommands_();
	this.world_.addKml(this.kmlString_, parentName);
}

/**
*	Uses a goog.async.ConditionalDelay to delay transmission of commands until the
*	World object reports that its API is ready to receive them
*	@see {ktree.ktx.KtxInterpreter#sendCommands_}
*	@private
*/
ktree.ktx.KtxInterpreter.prototype.delayedSendCommands_ = function(parentName) {
	ktree.debug.logInfo('The KtxInterpreter is delaying transmission of commands while GoogleEarth finishes initializing');
	var target = this;
	var conditionalDelay = new goog.async.ConditionalDelay(
		function() {
			return (target.world_.apiReady());
		}
	);
	conditionalDelay.onFailure = function() {
		ktree.debug.logError('The KtxInterpreter timed out waiting for GoogleEarth to initialize');
	}
	conditionalDelay.onSuccess = function() {
		ktree.debug.logInfo('The KtxInterpreter reports that GoogleEarth has finished initializing. Sending delayed commands...');
		target.sendCommands_(parentName);
	}
	conditionalDelay.start(100, 5000);
}

/**
*	Interpret a sequence of KTX commands (drawn from the Interpreter's KTX Queue), 
*	transforming them into appropriate function calls on the World object.
*	@private
*/
ktree.ktx.KtxInterpreter.prototype.interpretKtxCommands_ = function() {
	ktree.debug.logGroupHidden('KtxInterpreter is issuing KTX commands...');
	var numCommands = this.ktxQueue_.getCount();
	for (var i = 0; i < numCommands; i++) {
		var command = this.ktxQueue_.getByIndex(i);
		var commandType = command.getDataName();
		var commandValue = command.get();
		
		switch(commandType) {
			case 'ktx:flyToSpeed':
				ktree.debug.logInfo('Setting flyToSpeed to: <' + commandValue + '>');
				this.world_.setFlyToSpeed(goog.string.toNumber(commandValue));
				break;
			default:
				ktree.debug.logError('KtxInterpreter did not recognize KTX command <' + commandType + '> with value <' + commandValue + '>');
		}
	}
	ktree.debug.logGroupEnd();
}