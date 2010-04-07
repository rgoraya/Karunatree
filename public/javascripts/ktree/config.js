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
*	Turn debug logging on/off.
*/
ktree.config.DEBUG_ON = (ktree.config.DEPLOYED) ? false : true;

/**
*	If false, all ktx:flyToSpeed commands are ignored, and the camera
*	moves between positions at its maximum speed.
*/
ktree.config.ENABLE_FLY_TO_SPEED = (ktree.config.DEPLOYED) ? true : false;

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

ktree.config.URL_COMPONENT_ICON_PATH = "/images/icons/"

ktree.config.URL_COMPONENT_SAVE_KML_TO_SERVER = "/play/save"

ktree.config.URL_COMPONENT_FEATURE_BEHAVIOR = "/features/behavior/"

ktree.config.URL_COMPONENT_ADD_TO_INVENTORY = "/characters/add_to_inventory"

ktree.config.URL_COMPONENT_REQUEST_SCENE = "/play/request_scene"

ktree.config.URL_COMPONENT_BIND_BEHAVIOR = "/characters/bind_behavior"



/**********************************
*	 EXTERNAL API CONFIGURATION
***********************************/
/**
*	Maximum amount of time the system will wait for the GE API to initialize before assuming
*	that something has gone wrong. Expressed in msec.
*/
ktree.config.GE_API_INIT_TIMEOUT = 20000;

/**
*	Maximum amount of time the system will wait for the SoundManager2 API to initialize before 
*	assuming that something has gone wrong. Expressed in msec.
*/
ktree.config.SM2_INIT_TIMEOUT = 10000;

