goog.provide('ktree.config');

/**
*	@fileoverview
*	Collection point for flags and constants that influence system-wide behavior
*/


ktree.config.BASE_URI = "http://localhost:3000"

ktree.config.ICON_PATH = "/images/icons/"

ktree.config.URI_COMPONENT_FOR_FEATURE_BEHAVIOR = "/features/behavior/"

ktree.config.URI_COMPONENT_FOR_ADD_TO_INVENTORY = "/characters/add_to_inventory"

ktree.config.URI_COMPONENT_FOR_REQUEST_SCENE = "/play/request_scene"

ktree.config.URI_COMPONENT_FOR_BIND_BEHAVIOR = "/characters/bind_behavior"


/**
*	This doesn't work yet.
*/
ktree.config.ENABLE_SOUND = false;

/**
*	Enable fly-to-speed commands during debugging. If false, the
*	camera always moves at its default (fast) speed
*/
ktree.config.ENABLE_FLY_TO_SPEED = true;


/**
*	Enable incremental serialization of the Google Earth plugin's
*	KML data back to the server
*/
ktree.config.ENABLE_SERIALIZATION = false;