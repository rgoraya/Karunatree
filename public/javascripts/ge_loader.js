var USER_ID;				// ID for current user
var DRAWER_OPEN = true;		// Is the story drawer currently open?
var DRAWER_HEIGHT = 325; 	// Height in pixels of the drawer div

//Load the API
function load_ge(id) {
	USER_ID = id;
	google.load("earth", "1");
	google.setOnLoadCallback(init);
}

//Initialize the GE instance, with callbacks
function init() {
	handleResize();
	google.earth.createInstance('earth', initCB, failureCB);
}

//Callback for succesful initialization
function initCB(instance) {
	ge = instance;
	ge.getWindow().setVisibility(true);
	ge.getSun().setVisibility(true);
	ge.getOptions().setAtmosphereVisibility(true);
	ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);
	setupKmlNetworkLink();
}

//Callback for failed initialization
function failureCB(errorCode) {
	alert("Sorry, but the Google Earth API failed to load.");
}

//Retrieve the KML file for the user
function setupKmlNetworkLink() {
	var href = 'http://localhost:3000/kml_bundle/transmit/'+user_id;
	google.earth.fetchKml(ge, href, linkDidFinishLoading);
}

function linkDidFinishLoading(kmlObject) {
	if (kmlObject) {
		ge.getFeatures().appendChild(kmlObject);
		//ge.getTourPlayer().setTour(kmlObject);
		//ge.getTourPlayer().play();
	}
	else {
		alert("Sorry, but I couldn't find any map data to display.")
	}
}

function windowHeight() {
	//Standard browsers (Mozilla, Safari, etc.)
	if (self.innerHeight)
		return self.innerHeight;
	// IE 6
	if (document.documentElement && document.documentElement.clientHeight)
		return y = document.documentElement.clientHeight;
	// IE 5
	if (document.body)
		return document.body.clientHeight;
	// Just in case
	alert('KarunaTree doesn\'t recognize your browser. This may cause problems when resizing the window')
	return 0;
}

function handleResize() {
	var totalHeight = windowHeight();
	var offsetHeight = document.getElementById('nav').offsetHeight;
	if (DRAWER_OPEN) {
		offsetHeight += DRAWER_HEIGHT;
	}
	offsetHeight += document.getElementById('drawer_handle').offsetHeight;
	document.getElementById('earth').style.height = (totalHeight - offsetHeight) + 'px';
}

function toggleDrawerState() {
	if(DRAWER_OPEN) DRAWER_OPEN = false;
	else DRAWER_OPEN = true;
}

window.onresize = handleResize;