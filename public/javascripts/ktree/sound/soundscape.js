goog.provide('ktree.Soundscape');

goog.require('ktree.debug');
goog.require('ktree.sound');

goog.require('goog.string');
goog.require('goog.async.ConditionalDelay');
goog.require('goog.structs.Map');

/**
*	@fileoverview
*	Soundscape provides sound management utilities for KarunaTree. Built as a wrapper around the SoundManager2 API.
*	In addition to the Soundscape object, this file also contains several pieces of configuration code for SoundManager2 itself.
*
*	Target SoundManager2 version: 2.95a.20090717 (November 2009)
*	@see <a href="http://www.schillmania.com/projects/soundmanager2/doc/">SoundManager2 API Documentation</a>
*
*	@version 0.1
*/


/**
*	@constructor
*/
ktree.Soundscape = function() {
	this.targetVolumes_ = new goog.structs.Map();
}

/**
*	Fade in a specified sound over a specified period of time. The sound does not have to
*	have been previously loaded; requests to fade in unloaded sounds will result in attempt
*	to load them.
*	@param {string} soundID			The ID string of the sound to fade
*	@param {integer} fadeDuration	(Optional) The duration of the fade in milliseconds
*/
ktree.Soundscape.prototype.fadeIn = function(soundID, fadeDuration) {
	var sound = this.getSound(soundID);
	if (!sound) {
		ktree.debug.logError('Soundscape.fadeIn could not find a sound with ID <' + soundID + '>');
		return;
	}
	if (!fadeDuration) {
		fadeDuration = ktree.sound.DEFAULT_FADE_DURATION;
	}	
	var desiredVolume = this.targetVolumes_.get(soundID);
	
	ktree.debug.logGroup('Soundscape.fadeIn is fading in sound <' + soundID + '>');
	var fadeCounter = 0;
	var fadeDelay = new goog.async.ConditionalDelay(
		function() {
			if (fadeCounter < fadeDuration) {
				fadeCounter += ktree.sound.FADE_TIMESTEP;
				sound.setVolume(100*fadeCounter/fadeDuration);
				//ktree.debug.logInfo('Fade step <' + fadeCounter + '> : Sound volume: <' + sound.volume + '>');
				return false;
			}
			if (fadeCounter >= fadeDuration) {
				sound.setVolume(desiredVolume)
				//ktree.debug.logInfo('Fade step <' + fadeCounter + '> : Sound volume: <' + sound.volume + '>');
				return true;
			}
		}
	);
	fadeDelay.onFailure = function() {
		ktree.debug.logWarning('Soundscape.fadeIn failed to reach the end of the fade succesfully.');
		sound.setVolume(desiredVolume);
	}
	fadeDelay.onSuccess = function() {
		ktree.debug.logInfo('Fade in complete! Sound volume is: <' + sound.volume + '>');
		ktree.debug.logGroupEnd();
	}
	
	soundManager.play(soundID);
	fadeDelay.start(ktree.sound.FADE_TIMESTEP, fadeDuration + ktree.sound.FADE_DURATION_ERROR);
}

/**
*	Fade out a specified sound over a specified period of time. Yields an error if the specified
*	sound has not already been loaded.
*	@param {string} soundID			The ID string of the sound to fade
*	@param {integer} fadeDuration	(Optional) The duration of the fade in milliseconds
*/
ktree.Soundscape.prototype.fadeOut = function(soundID, fadeDuration) {
	var sound = soundManager.getSoundById(soundID);
	if (!sound) {
		ktree.debug.logError('Soundscape.fadeOut could not find a sound with ID <' + soundID + '>');
		return;
	}
	if (!fadeDuration) {
		fadeDuration = ktree.sound.DEFAULT_FADE_DURATION;
	}
	var numSteps = fadeDuration/ktree.sound.FADE_TIMESTEP;
	var stepSize = sound.volume/numSteps;
	
	ktree.debug.logGroup('Soundscape.fadeOut is fading out sound <' + soundID + '>');
	var fadeCounter = 0;
	var fadeDelay = new goog.async.ConditionalDelay(
		function() {
			if (fadeCounter < fadeDuration) {
				fadeCounter += ktree.sound.FADE_TIMESTEP;
				sound.setVolume(sound.volume-stepSize);
				//ktree.debug.logInfo('Fade step <' + fadeCounter + '> : Sound volume: <' + sound.volume + '>');
				return false;
			}
			if (fadeCounter >= fadeDuration) {
				sound.stop();
				//ktree.debug.logInfo('Fade step <' + fadeCounter + '> : Sound volume: <0>');
				return true;
			}
		}
	);
	fadeDelay.onFailure = function() {
		ktree.debug.logWarning('Soundscape.fadeOut failed to reach the end of the fade succesfully.');
		sound.stop();
	}
	fadeDelay.onSuccess = function() {
		ktree.debug.logInfo('Fade out complete!');
		ktree.debug.logGroupEnd();
	}
	fadeDelay.start(ktree.sound.FADE_TIMESTEP, fadeDuration + ktree.sound.FADE_DURATION_ERROR);
}

/**
*	Method used to queue callback functions that should execute once the SoundManager has finished 
*	initializing. Note that if the SoundManager is already initialized, the callback will be executed 
*	immediately.
*
*	Example: this method can be used to request a 'getSound' invocation when a page first loads, before
*	the SoundManager is fully initialized. The getSound request will be delayed (for up to five seconds)
*	until the SoundManager is ready to respond.
*	@public
*	@param {function} callback	The function that should be executed when the SoundManager is initialized.
*/
ktree.Soundscape.prototype.whenReady = function(callback) {
	if (soundManager.supported()) {
		callback();
	}
 	else {
		ktree.debug.logInfo('Soundscape.whenReady is delaying a callback while SoundManager initializes...');
		var readyDelay = new goog.async.ConditionalDelay(
			function() {
				return soundManager.supported()
			}
		);
		readyDelay.onFailure = function() {
			ktree.debug.logError('Soundscape.whenReady timed out while waiting for SoundManager to initialize');
		}
		readyDelay.onSuccess = function() {
			ktree.debug.logInfo('SoundManager is ready! Soundscape.whenReady is firing its callback.');
			callback();
		}
		readyDelay.start(100, 5000);
	}
}

/**
*	Retrieves the sound identified by a given sound ID. If the sound has not yet been loaded into the
*	SoundManager, this method will attempt to load a file with name soundID.mp3 from the default sound
*	directory. May return null if no sound could be matched to the ID.
*	@private
*	@param {string}		soundID		String identifier for the desired sound
*	@return {SMSound} 	sound		May be null if no sound could be matched to the argument ID
*/
ktree.Soundscape.prototype.getSound_ = function(soundID) {
	var sound = soundManager.getSoundById(soundID);
	if (!sound) {
		sound = this.findAndLoadSound_(soundID);
		if (!sound) {
			ktree.debug.logError('Soundscape.getSound could not find a sound with ID <' + soundID + '>');
			return null;
		}
	}
	return sound;
}

/**
*	Given an argument sound ID string, attempt to find and load a "matching" (i.e. named soundID.mp3) in the
*	server's default sound directory.
*	@private
*	@param {string}		soundID		ID string identifying the desired sound
*	@return {SMSound} 	sound		The sound matching the argument ID string. May be null if no match is found.
*/
ktree.Soundscape.prototype.findAndLoadSound_ = function(soundID, targetVolume) {
	if (targetVolume) {
		targetVolume = ktree.sound.DEFAULT_TARGET_VOLUME;
	}
	var music_url = goog.string.buildString(ktree.sound.MUSIC_DIR, soundID, '.mp3');
	if (soundManager.canPlayURL(music_url)) {
		this.targetVolumes_.set(soundID, targetVolume);
		return soundManager.createSound(soundID, music_url);
	}
	else {
		var fx_url = goog.string.buildString(ktree.sound.FX_DIR, soundID, '.mp3');
		if (soundManager.canPlayURL(fx_url)) {
			this.targetVolumes_.set(soundID, targetVolume);
			return soundManager.createSound(soundID, fx_url);
		}
		else {
			ktree.debug.logError('Soundscape.findAndLoadSound could not locate a sound named <' + 
									soundID + '.mp3> in the ' + 
									ktree.sound.MUSIC_DIR + ' or ' +
									ktree.sound.FX_DIR + ' directories.');
			return null;
		}
	}
}

/**
*	Initialization callback from the SoundManager2 library
*	@private
*/
ktree.Soundscape.onReady_ = function() {
	if (!soundManager.supported()) {
		ktree.Soundscape.disableSound_();
	}
}

/**
*	Disable sound support
*	@private
*/
ktree.Soundscape.disableSound_ = function() {
	alert('TODO: Disable sound');
}

ktree.Soundscape.testButton = function() {
	var b1 = new goog.ui.Button('Test Fade Out');
	b1.render(goog.dom.$('button-fade-out'));
	goog.events.listen(b1, goog.ui.Component.EventType.ACTION, ktree.Soundscape.fadeOutTest, false, this);
	
	var b2 = new goog.ui.Button('Test Fade In');
	b2.render(goog.dom.$('button-fade-in'));
	goog.events.listen(b2, goog.ui.Component.EventType.ACTION, ktree.Soundscape.fadeInTest, false, this);
}

ktree.Soundscape.fadeOutTest = function() {
	ktree.Soundscape.fadeOut('hidden-sky-free', 8000);
}

ktree.Soundscape.fadeInTest = function() {
	ktree.Soundscape.fadeIn('the-rainy-season', 8000);
}


/*
*********************************************
*  SoundManger2 library configuration code  *
*********************************************
*/

/**
*	A scope reference used to direct callbacks from the SoundManager2 library
*/
ktree.Soundscape.target_ = this;

/**
*	Directory where SM2 .SWF files are located
*/
soundManager.url = 'swf';

/**
*	If true, detailed debug info is output to a soundmanager-debug div appended to bottom of page body
*/
soundManager.debugMode = false;

/**
*	Called by the SoundManager2 library after succesful initialization
*/
soundManager.onload = function() {
	ktree.debug.logInfo('SoundManager2 has initialized successfully.');
}

/**
*	Called by the SoundManager2 library if initialization fails
*/
soundManager.onerror = function() {
	ktree.debug.logError("The SoundManager2 library was unable to initialize. Disabling sound...");
}

/**
*	Setup an initialization callback from the SoundManager2 library. Methods passed to this function are called
*	just prior to soundManager.onload / soundManager.onerror. Because this function takes a scope argument,
*	we use it to connect ktree.Soundscape initialization code with the SoundManager2 library initialization
*	(the soundManager.onload and soundManager.onerror methods are both called with window scope).
*/
soundManager.onready(function(status) {
		ktree.Soundscape.onReady_();
	}, 
	ktree.Soundscape.target_
);