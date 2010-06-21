goog.provide('ktree.growl');

ktree.growl.it = function(message) {
	var growl = new k.Growler();
	growl.growl(message, {header: "KarunaTree", className: "atwork"});
}
