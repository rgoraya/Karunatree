goog.provide('ktree.script.ScriptManager');

goog.require('goog.dom');

ktree.script.SCRIPT_TEXT_DIV = "script";

/**
*	@constructor
*/
ktree.script.ScriptManager = function() {
	
}

ktree.script.ScriptManager.prototype.renderText = function(text) {
	var scriptElement = goog.dom.getElement(ktree.script.SCRIPT_TEXT_DIV);
	goog.dom.setTextContent(scriptElement, text);
}