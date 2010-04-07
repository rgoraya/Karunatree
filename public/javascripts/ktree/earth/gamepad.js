goog.provide('ktree.earth.Gamepad');

goog.require('ktree.config');

ktree.earth.Gamepad = function(ge) {
	// Pointer to the GE plugin
	this.ge_ = ge;
	
	this.delegate_ = null;
	
	// FIXME Move these outside of the class
	// Constants
	this.BUTTON_A_NAME = 'button_a';
	this.BUTTON_A_WIDTH = 64;
	this.BUTTON_A_HEIGHT = 64;
	this.BUTTON_A_XMIN = 25;
	this.BUTTON_A_XMAX = this.BUTTON_A_XMIN + this.BUTTON_A_WIDTH;
	this.BUTTON_A_YMIN = 25;
	this.BUTTON_A_YMAX = this.BUTTON_A_YMIN + this.BUTTON_A_HEIGHT;
	
	this.BUTTON_X_NAME = 'button_x';
	this.BUTTON_X_WIDTH = 64;
	this.BUTTON_X_HEIGHT = 64;
	this.BUTTON_X_XMIN = 65;
	this.BUTTON_X_XMAX = this.BUTTON_X_XMIN + this.BUTTON_X_WIDTH;
	this.BUTTON_X_YMIN = 65;
	this.BUTTON_X_YMAX = this.BUTTON_X_YMIN + this.BUTTON_X_HEIGHT;
	
	this.CURRENT = 'current';
	// (Note that these state names map to file names
	this.DEFAULT = '_default';
	this.HOVER = '_hover';
	this.ACTIVE = '_active';
	
	this.STATES = [this.DEFAULT, this.HOVER, this.ACTIVE, this.CURRENT];
	
	// Variables to track gamepad state
	this.activeButton_ = null;
	this.hoveredButton_ = null;
	
	// Create the buttons
	this.buttonA = this.createButton_(this.BUTTON_A_NAME, this.BUTTON_A_XMIN, this.BUTTON_A_XMIN, this.BUTTON_A_WIDTH, this.BUTTON_A_HEIGHT);
	this.buttonX = this.createButton_(this.BUTTON_X_NAME, this.BUTTON_X_XMIN, this.BUTTON_X_XMIN, this.BUTTON_X_WIDTH, this.BUTTON_X_HEIGHT);
	
	// Add the event listeners
	var target = this;
	var boundMouseDownEvent = goog.bind(this.mouseDownEvent, this);
	google.earth.addEventListener(this.ge_.getWindow(), 'mousedown', boundMouseDownEvent);
	var boundMouseMoveEvent = goog.bind(this.mouseMoveEvent, this);
	google.earth.addEventListener(this.ge_.getWindow(), 'mousemove', boundMouseMoveEvent);
	
	// Cycle the buttons to pre-load images
	this.setButton_(this.buttonX, this.HOVER);
	this.setButton_(this.buttonA, this.HOVER);
	this.toggleButton_(this.buttonA);
	
	// Make the X button active by default
	this.toggleButton_(this.buttonX);
}


ktree.earth.Gamepad.prototype.createButton_ = function(name, x, y, width, height) {
	var overlayMap = new goog.structs.Map();
	
	for (i = 0; i <= 2; i++) {
		var icon = this.ge_.createIcon('');
		icon.setHref(ktree.config.URL_BASE + ktree.config.URL_COMPONENT_ICON_PATH + name + this.STATES[i] + '.png');
		
		var overlay = this.ge_.createScreenOverlay('');
		overlay.setDrawOrder(i + 1);
		overlay.setVisibility(this.STATES[i] == this.DEFAULT);
		overlay.setIcon(icon);
		overlay.getOverlayXY().set(x, this.ge_.UNITS_PIXELS, y, this.ge_.UNITS_INSET_PIXELS);
		overlay.getScreenXY().set(0, this.ge_.UNITS_FRACTION, 1, this.ge_.UNITS_FRACTION);
		overlay.getSize().set(width, this.ge_.UNITS_PIXELS, height, this.ge_.UNITS_PIXELS);
		this.ge_.getFeatures().appendChild(overlay);

		overlayMap.set(this.STATES[i], overlay);
	}
	
	// Each button's state starts out as the default value
	overlayMap.set(this.CURRENT, this.DEFAULT);
	
	return overlayMap;
}

ktree.earth.Gamepad.prototype.mouseDownEvent = function(event) {
	// Only handle left-button clicks
	if (event.getButton() != 0) {
		return;
	}
		
	var selectedButton = this.isMouseOnButton_(event.getClientX(), event.getClientY());
	if (selectedButton) {
		this.toggleButton_(selectedButton);
		event.preventDefault();
		return false;
	}
}

ktree.earth.Gamepad.prototype.mouseMoveEvent = function(event) {
    var selectedButton = this.isMouseOnButton_(event.getClientX(), event.getClientY());

	// If we're moving over a button...
	if (selectedButton) {
      	var state = selectedButton.get(this.CURRENT);
		// ... and the button is inactive, change it to hover.
		if (state == this.DEFAULT) {
			this.setButton_(selectedButton, this.HOVER);
			this.hoveredButton_ = selectedButton;
		}
    }
	
	// If we're not moving over a button...
	else {
		// .. make sure the buttons are not in the hover state
		if (this.hoveredButton_) {
			this.setButton_(this.hoveredButton_, this.DEFAULT);
			this.hoveredButton_ = null;
		}
	}
}

ktree.earth.Gamepad.prototype.isMouseOnButton_ = function(x, y) {
	if ( this.BUTTON_A_XMIN <= x && x <= this.BUTTON_A_XMAX &&
		 this.BUTTON_A_YMIN <= y && y <= this.BUTTON_A_YMAX) {
			return this.buttonA;
	}
	else if (this.BUTTON_X_XMIN <= x && x <= this.BUTTON_X_XMAX &&
		 this.BUTTON_X_YMIN <= y && y <= this.BUTTON_X_YMAX) {
			return this.buttonX;
	}
	else {
		return null;
	}
}

ktree.earth.Gamepad.prototype.setButton_ = function(button, newState) {
	var oldState = button.get(this.CURRENT);
	
	//Turn on the new state
	var overlay = button.get(newState);
	overlay.setVisibility(true);
	button.set(this.CURRENT, newState);
	
	// Turn off the old state
	var oldOverlay = button.get(oldState);
	oldOverlay.setVisibility(false);	
}

/**
*	Implements a click on a button by toggling between active/inactive/hover
*	states as appropriate
*/
ktree.earth.Gamepad.prototype.toggleButton_ = function(button) {
	var state = button.get(this.CURRENT);
	
	// If the toggled button was active, now it is hovered
	if (state == this.ACTIVE) {
		button.get(this.DEFAULT).setVisibility(true);
		button.set(this.CURRENT, this.HOVER);
		this.setActiveButton_(null);
		this.hoveredButton_ = button;
	}
	// If the toggled button was hovered or inactive, now it is active
	else {
		button.get(this.ACTIVE).setVisibility(true);
		button.set(this.CURRENT, this.ACTIVE);
		if (this.hoveredButton_ == button) {
			this.hoveredButton_ = null;
		}
		
		// If a *different* button was active when this toggle occurred,
		// we need to deactivate it
		if (this.activeButton_) {
			this.activeButton_.get(this.DEFAULT).setVisibility(true);
			this.activeButton_.get(this.ACTIVE).setVisibility(false);
			this.activeButton_.set(this.CURRENT, this.DEFAULT);
		}
		
		// Update the current active button
		this.setActiveButton_(button);
	}
	
	// Turn off the layer corresponding to the old state of the toggled button
	button.get(state).setVisibility(false);
}

ktree.earth.Gamepad.prototype.setActiveButton_ = function(button) {
	this.activeButton_ = button;
	
	// Notify the delegate of the change
	if (this.delegate_) {
		var message = null;
		if (button == this.buttonX) {
			message = this.BUTTON_X_NAME;
		}
		else if (button == this.buttonA) {
			message = this.BUTTON_A_NAME;
		}
		this.delegate_.activeButtonDidChange(message);
	}
}

ktree.earth.Gamepad.prototype.setDelegate = function(delegate) {
	this.delegate_ = delegate;
	// FIXME Need a way to get the *name* of the active button (not just its Map object)
	this.delegate_.activeButtonDidChange(this.BUTTON_X_NAME);
}