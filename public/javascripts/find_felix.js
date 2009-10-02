function createPlacemark() {
	
	//Begin setting up the Placemark
	var placemark = ge.createPlacemark('');
	placemark.setName("Say Hello to Felix!");
	placemark.setDescription(
		'Felix is a <a href="http://en.wikipedia.org/wiki/Sea_otter">California Sea Otter</a> (<i>Enhydra lutris</i>).<br><br>' +
		'<img src="http://research.hellofelix.com/images/felix-closeup.jpg" height="166px" width="250px">'
	);
	
	//Begin setting up the Placemark style map
	var styleMap = ge.createStyleMap('');
	
	//Style map's normal style
	var normalStyle = ge.createStyle('');
	var normalIcon = ge.createIcon('');
	normalIcon.setHref('http://research.hellofelix.com/images/otter-icon.gif');
	normalStyle.getIconStyle().setIcon(normalIcon);
	
	//Style map's highlighed style
	var highlightStyle = ge.createStyle('');
	var highlightIcon = ge.createIcon('');
	highlightIcon.setHref('http://research.hellofelix.com/images/otter-icon.gif');
	highlightStyle.getIconStyle().setIcon(highlightIcon);
	highlightStyle.getIconStyle().setScale(1.3);
	
	//Finish style map
	styleMap.setNormalStyle(normalStyle);
	styleMap.setHighlightStyle(highlightStyle);
	
	//Apply style map to placemark
	placemark.setStyleSelector(styleMap);
	
	//Locate and add the placemark
	var point = ge.createPoint('');
	point.setLatitude(12.345);
	point.setLongitude(54.321);
	placemark.setGeometry(point);
	
	//Add the Placemark
	ge.getFeatures().appendChild(placemark);
	
}

function findFelixHTML() {
	var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
	alert(ge_string);
	
	lookAt.set(12.345, 54.321, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, -68.541, 76, 3000);
	
	ge.getOptions().setFlyToSpeed(0.1);
	
	ge.getView().setAbstractView(lookAt);
}

function findFelixKML() {
	var href = 'http://research.hellofelix.com/kml/findFelix.kml';
	google.earth.fetchKml(ge, href, kmlFinishedLoading);
}

function kmlFinishedLoading(object) {
	ge.getTourPlayer().setTour(object);
	ge.getTourPlayer().play();
}

function about() {
	var balloon = ge.createHtmlStringBalloon('');
	balloon.setContentString(
		'<h1>Features included in this demo:</h1>' +
		'<ul><li>Basic <b>placemarks</b> with custom styles</li>' +
		'<li>Several styles of <b>balloons</b> (Feature, HTML string)</li>' +
		'<li><b>Camera</b> position and look-at manipulation</li>' +
		'<li>External KML <b>importing</b></li>' +
		'<li><b>Tour</b> functionality implemented via external KML file</li>' +
		'</ul><br><br>' +
		'<img src="http://research.hellofelix.com/images/napping-otters.jpg" width="400px" height="300px">'
	);
	
	balloon.setMinHeight(400);
	balloon.setMinWidth(600);
	ge.setBalloon(balloon);
}

function addDomListener(element, eventName, listener) {
	if (element.addEventListener)
		element.addEventListener(eventName, listener, false);
	else if (element.attachEvent)
		element.attachEvent('on' + eventName, listener);
}
