goog.provide('ktree.earth.Earth');

goog.require('ktree.GoogleEarth');

ktree.earth.Earth = function() {
	this.model_ = new ktree.GoogleEarth('Main');
}

ktree.earth.Earth.prototype.update = function() {
	this.model_.update();
}

ktree.earth.Earth.prototype.getModel = function() {
	return this.model_;
}


ktree.earth.Earth.prototype.unload = function() {
	this.model_.unload();
}