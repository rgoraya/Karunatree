goog.provide('ktree.ktx.KtxInterpreter');

goog.require('ktree.debug');
goog.require('ktree.ktx');

goog.require('goog.ds.BasicNodeList');
goog.require('goog.ds.XmlDataSource');
goog.require('goog.dom.xml');
goog.require('goog.string');

/**
*	@constructor
*/
ktree.ktx.KtxInterpreter = function(world) {
	this.world_ = world;
	this.ktxQueue_;
	this.kmlString_;
}


/**
*	//TODO Should the transmission to the World object happen here or in the KtxManager?
*	
*	Parse KTX from an argument goog.ds.XmlDataSource. If the World is ready, transmit the results for rendering.
*	If the world is not yet ready, cache the results and retry transmission later
*	@private
*	@param {goog.ds.XmlDataSource} dataSource The source of the KTX data to be parsed/transmitted
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

ktree.ktx.KtxInterpreter.prototype.sendCommands_ = function() {
	this.interpretKtxCommands_();
	this.world_.parseKml(this.kmlString_);
}

/**
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

ktree.ktx.KtxInterpreter.prototype.testParse = function(dataSource) {
	if (goog.isNull(dataSource)) {
		ktree.Utils.logError('KTXInterpreter received a null DataSource!');
		return;
	}

		var s = dataSource.getDataName();
		ktree.debug.logInfo('Top level getDataName(): ' + dataSource.getDataName());
		ktree.debug.logInfo('Top level getDataPath(): ' + dataSource.getDataPath());
		ktree.debug.logInfo('Top level get(): ' + dataSource.get());
		ktree.debug.logInfo('Top level node number of children: ' + dataSource.getChildNodes().getCount());
		var child = dataSource.getChildNode('node');
		ktree.debug.logInfo('Child node getDataName(): ' + child.getDataName());
		ktree.debug.logInfo('Child node getDataPath(): ' + child.getDataPath());
		ktree.debug.logInfo('Child node number of attributes: ' + child.getChildNodes('@*').getCount());
		ktree.debug.logInfo('Child node get(): ' + child.get());
		var child2 = child.getChildNode('anothernode');
		ktree.debug.logInfo('Child2 node getDataName(): ' + child2.getDataName());
		ktree.debug.logInfo('Child2 node getDataPath(): ' + child2.getDataPath());
		ktree.debug.logInfo('Child2 node get(): ' + child2.get());
		
		var rootElement = dataSource.getRootElement();
		ktree.debug.logGroup('After walking the XML, here is what I have:');
		ktree.debug.logInfo('The root node is: ');
		ktree.debug.logElement(rootElement);
		ktree.debug.logGroupEnd();
		
		alert('Starting transmission to GE');
		var rootElementString = goog.dom.xml.serialize(rootElement);
}

