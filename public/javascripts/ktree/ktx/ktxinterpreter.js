goog.provide('ktree.ktx.KtxInterpreter');

goog.require('ktree.debug');
goog.require('ktree.ktx');

goog.require('goog.ds.BasicNodeList');
goog.require('goog.ds.XmlDataSource');
goog.require('goog.dom.xml');
goog.require('goog.string');

/**
*	@fileoverview
*	The KTXInterpreter is responsible for converting a KTX (.xml) file, represented
*	internally as a goog.ds.XmlDataSource, into a series of KTX commands and KML strings
*	for the World to render
*/

/**
*	A KTX interpreter
*	@constructor
*/
ktree.ktx.KtxInterpreter = function(world) {
	/**
	*	The World object to which the Interpreter should direct
	*	its output
	*	@private
	*	@type {ktree.World}
	*/
	this.world_ = world;
	
	/**
	*	A list of KTX commands (represented as goog.ds.DataNodes)
	*	awaiting transmission to the World
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
ktree.ktx.KtxInterpreter.prototype.parse = function(dataSource) {	
	// The KTX command queue and KML string are cleared at the start of each parsing run
	this.ktxQueue_ = new goog.ds.BasicNodeList();
	this.kmlString_ = null;
	
	ktree.debug.logGroup('KtxInterpreter is starting to walk the XML tree...');
	this.findKtxNodes_(dataSource);
	ktree.debug.logGroupEnd();
	
	var remainingKml = dataSource.getElement();
	ktree.debug.logElement(remainingKml, 'KtxInterpreter has finished walking the XML tree. <' 
										+ this.ktxQueue_.getCount() + '> KTX command(s) found. '
										+ 'The remaining KML object is:');
	this.kmlString_ = goog.dom.xml.serialize(remainingKml);
	var apiReady = this.world_.apiReady();
	if(apiReady) {
		this.sendCommands_();
	}
	else {
		this.delayedSendCommands_();
	}
}

/**
*	Recurrent function which walks through an goog.ds.XmlDataSource tree looking 
*	for KTX commands to execute. When KTX commands are found, they are cached
*	for transmission to the World object and removed from the DataSource tree.
*	@param {goog.ds.XmlDataSource} node	The node from which to begin walking
*/
ktree.ktx.KtxInterpreter.prototype.findKtxNodes_ = function(node) {
	
	var nodeDataName = node.getDataName();
	
	if (this.shouldStepIntoNode_(nodeDataName)) {
		ktree.debug.logInfo('Stepping into node: <' + nodeDataName + '>...');
		
		var children = node.getChildNodes();
		var numChildren = children.getCount();
		for (var i = 0; i < numChildren; i++) {
			var child = children.getByIndex(i);
			this.findKtxNodes_(child);
		}
	}
	
	// Note that the 'else' here means we do not recur through KTX nodes.
	else if (goog.string.startsWith(nodeDataName, ktree.ktx.KTX_NODE_PREFIX)) {
		ktree.debug.logInfo('Found a KTX node of type: <' + nodeDataName + '>');
		// Remove the KTX node from its parent, effectively stripping
		// it from the underlying XML file
		goog.dom.removeNode(node.getElement());
		this.ktxQueue_.add(node);
	}
}

/**
*	Returns whether argument Node DataName is one that the parser should look
*	inside for nested KTX commands.
*	@private
*	@param {string}		nodeDataName	DataName for the current Node
*	@return {boolean}	Should the parser recur into a Node with the given
*						nodeDataName to find nested KTX commands?
*/
ktree.ktx.KtxInterpreter.prototype.shouldStepIntoNode_ = function(nodeDataName) {
	if (goog.string.startsWith(nodeDataName, ktree.ktx.KTX_ROOT_PREFIX)) {
		return true;
	}
	else {
		switch(nodeDataName) {
			case "kml": 		return true; 
			case "Document": 	return true;
			case "Folder": 		return true;
			default: 			return false;
		}
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
ktree.ktx.KtxInterpreter.prototype.sendCommands_ = function() {
	this.interpretKtxCommands_();
	this.world_.parseKml(this.kmlString_);
}

/**
*	Uses a goog.async.ConditionalDelay to delay transmission of commands until the
*	World object reports that its API is ready to receive them
*	@see {ktree.ktx.KtxInterpreter#sendCommands_}
*	@private
*/
ktree.ktx.KtxInterpreter.prototype.delayedSendCommands_ = function() {
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
		target.sendCommands_();
	}
	conditionalDelay.start(100, 5000);
}

/**
*	Interpret a sequence of KTX commands (drawn from the Interpreter's KTX Queue), 
*	transforming them into appropriate function calls on the World object.
*	@private
*/
ktree.ktx.KtxInterpreter.prototype.interpretKtxCommands_ = function() {
	ktree.debug.logGroup('KtxInterpreter is issuing KTX commands...');
	var numCommands = this.ktxQueue_.getCount();
	for (var i = 0; i < numCommands; i++) {
		var command = this.ktxQueue_.getByIndex(i);
		// Strip the KTX prefix from the command type
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
}