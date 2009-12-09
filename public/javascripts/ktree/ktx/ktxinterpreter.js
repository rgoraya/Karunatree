goog.provide('ktree.ktx.KtxInterpreter');

goog.require('ktree.debug');
goog.require('ktree.ktx.KtxDataSource');

goog.require('goog.dom.xml');

/**
*	@constructor
*/
ktree.ktx.KtxInterpreter = function(world) {
	this.world_ = world;
}


/**
*	//TODO Should the transmission to the World object happen here or in the KtxManager?
*	
*	Parse KTX from an argument KtxDataSource. If the World is ready, transmit the results for rendering.
*	If the world is not yet ready, cache the results and retry transmission later
*	@private
*	@param {ktree.ktx.KtxDataSource} ktxDataSource The source of the KTX data to be parsed/transmitted
*/
ktree.ktx.KtxInterpreter.prototype.parseKtx = function(dataSource, delay) {
	var apiReady = this.world_.apiReady();
	
	//TODO Parse out KTX commands
	var kmlString = goog.dom.xml.serialize(dataSource.getRootElement());
	
	if(apiReady) {
		this.world_.parseKml(kmlString);
	}
	else {
		this.delayedKtxTransmit_(kmlString);
	}
}

/**
*	@private
*/
ktree.ktx.KtxInterpreter.prototype.delayedKtxTransmit_ = function(kmlString) {
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
		target.world_.parseKml(kmlString);
		ktree.debug.logInfo('The KtxInterpreter reports that GoogleEarth finished initializing and accepted delayed commands');
	}
	conditionalDelay.start(100, 5000);
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

