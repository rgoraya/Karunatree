/**
*   Karunatree
*   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
*   
*   Author: Derek Lyons
*
**/

goog.provide('ktree.ui.Toolbar');

goog.require('ktree.debug');
goog.require('goog.dom');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarButton');

/**
*	@constructor
*/
ktree.ui.Toolbar = function() {
	this.bar_ = new goog.ui.Toolbar();
	//this.bar_.addChild(new goog.ui.ToolbarButton('World Time: 0'), true);
	this.bar_.render(goog.dom.getElement('toolbar'));
}

ktree.ui.Toolbar.prototype.updateTime = function(time) {
	this.bar_.getChildAt(0).setCaption('World Time: ' + time);
}
