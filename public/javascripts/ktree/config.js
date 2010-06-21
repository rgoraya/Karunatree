goog.provide('ktree.config');

/**
*	@fileoverview
*	Collection point for flags and constants that influence system-wide behavior
*/


/**********************************
*	   GLOBAL CONFIGURATION
***********************************/

/**
*	Set to true when deploying the system on a production server
*/
ktree.config.DEPLOYED = false;



/**********************************
*    DEBUGGING CONFIGURATION
***********************************/

/**
*	Debugging Constants
*/
ktree.config.DEBUG_OUTPUT_CONSOLE = 0;
ktree.config.DEBUG_OUTPUT_WINDOW = 1;
ktree.config.DEBUG_OUTPUT_ALERT_ALL = 2;
ktree.config.DEBUG_OUTPUT_ALERT_WARNINGS = 3;

/**
*	Turn debug logging on/off
*/
ktree.config.DEBUG_ON = (ktree.config.DEPLOYED) ? false : true;

/**
*	Set the destination for debug output:
*		CONSOLE = output to Firebug console
*		WINDOW = output to goog.debug.FancyWindow
*		ALERT_ALL = output all debug messages to javascript alerts
*		ALERT_WARNINGS = output debug messages of level 'warning' and above to javascript alerts
*/
ktree.config.DEBUG_OUTPUT = ktree.config.DEBUG_OUTPUT_CONSOLE;


/**
*	If false, all ktx:flyToSpeed commands are ignored, and the camera
*	moves between positions at its maximum speed.
*/
ktree.config.ENABLE_FLY_TO_SPEED = (ktree.config.DEPLOYED) ? true : true;

/**
*	Turn sound on/off. This doesn't work yet.
*/
ktree.config.ENABLE_SOUND = (ktree.config.DEPLOYED) ? true : false;

/**
*	Enable incremental serialization of the Google Earth plugin's
*	KML data back to the server
*/
ktree.config.ENABLE_SERIALIZATION = false;



/**********************************
*	     URL CONFIGURATION
***********************************/


ktree.config.URL_BASE = (ktree.config.DEPLOYED) ? "http://ec2-184-72-52-139.us-west-1.compute.amazonaws.com" : "http://localhost:3000"

ktree.config.URL_COMPONENT_KML_PATH = "/kml/"

ktree.config.URL_COMPONENT_ICON_PATH = "/images/icons/"

ktree.config.URL_COMPONENT_SAVE_KML_TO_SERVER = "/play/save"

ktree.config.URL_COMPONENT_FEATURE_BEHAVIOR = "/features/behavior/"

ktree.config.URL_COMPONENT_ADD_TO_INVENTORY = "/characters/add_to_inventory"

ktree.config.URL_COMPONENT_REQUEST_SCENE = "/play/request_scene"

ktree.config.URL_COMPONENT_BIND_BEHAVIOR = "/characters/bind_behavior"

ktree.config.URL_KML_PATH = ktree.config.URL_BASE + ktree.config.URL_COMPONENT_KML_PATH;



/***********************************
 *	  GOOGLE EARTH CONFIGURATION
 ***********************************/

ktree.config.GE_PLUGIN_ROOT_FOLDER = "KarunaTree"

/**
 *	Maximum amount of time the system will wait for the GE API to initialize before assuming
 *	that something has gone wrong. Expressed in msec.
 */
ktree.config.GE_API_INIT_TIMEOUT = 20000;



/**********************************
*	 EXTERNAL API CONFIGURATION
***********************************/


/**
*	Maximum amount of time the system will wait for the SoundManager2 API to initialize before 
*	assuming that something has gone wrong. Expressed in msec.
*/
ktree.config.SM2_INIT_TIMEOUT = 10000;

