goog.provide('ktree.Soundscape');

goog.require('ktree.debug');
goog.require('ktree.config');
goog.require('ktree.sound');

goog.require('goog.string');
goog.require('goog.structs.Map');
goog.require('goog.async.ConditionalDelay');

/**
*	@fileoverview
*	Soundscape provides sound management utilities for KarunaTree. Built as a wrapper around the SoundManager2 API.
*	In addition to the Soundscape object, this file also contains several pieces of configuration code for SoundManager2 itself.
*
*	Target SoundManager2 version: 2.95a.20090717 (November 2009)
*	@see <a href="http://www.schillmania.com/projects/soundmanager2/doc/">SoundManager2 API Documentation</a>
*
*	@version 0.2
*	@author Derek Lyons
*/


/**
*	@constructor
*/
ktree.Soundscape = function() {
	this.targetVolumes_ = new goog.structs.Map();
	
	//this.testButtons();
}

/**
*	Fade in a specified sound over a specified period of time. The sound does not have to
*	have been previously loaded; requests to fade in unloaded sounds will result in attempt
*	to load them.
*	@param {string} soundID			The ID string of the sound to fade
*	@param {string} relativePath	Path to the sound file, relative to the public root
*	@param {integer} fadeDuration	(Optional) The duration of the fade in milliseconds
*/
ktree.Soundscape.prototype.fadeIn = function(soundID, jsonParams) {
	var params = this.mergeParamsWithDefaults_(jsonParams);
	var sound = this.getSound_(soundID, params);
	if (!sound) {
		ktree.debug.logError('Soundscape.fadeIn could not find a sound with ID <' + soundID + '>');
		return;
	}
	
	ktree.debug.logGroup('Soundscape.fadeIn is fading in sound <' + soundID + '>');
	var fadeCounter = 0;
	var fadeDelay = new goog.async.ConditionalDelay(
		function() {
			if (fadeCounter < params.fade_in_duration) {
				fadeCounter += ktree.sound.FADE_TIMESTEP;
				sound.setVolume(params.volume*fadeCounter/params.fade_in_duration);
				//ktree.debug.logInfo('Fade step <' + fadeCounter + '> : Sound volume: <' + sound.volume + '>');
				return false;
			}
			if (fadeCounter >= params.fade_in_duration) {
				sound.setVolume(params.volume)
				//ktree.debug.logInfo('Fade step <' + fadeCounter + '> : Sound volume: <' + sound.volume + '>');
				return true;
			}
		}
	);
	fadeDelay.onFailure = function() {
		ktree.debug.logWarning('Soundscape.fadeIn failed to reach the end of the fade succesfully.');
		sound.setVolume(params.volume);
	}
	fadeDelay.onSuccess = function() {
		ktree.debug.logInfo('Fade in complete! Sound volume is: <' + sound.volume + '>');
		ktree.debug.logGroupEnd();
	}
	
	soundManager.play(soundID);
	fadeDelay.start(ktree.sound.FADE_TIMESTEP, params.fade_in_duration + ktree.sound.FADE_DURATION_ERROR);
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
		readyDelay.start(100, ktree.config.SM2_INIT_TIMEOUT);
	}
}

/**
*	Retrieves the sound identified by a given sound ID. If the sound has not yet been loaded into the
*	SoundManager, this method will attempt to load a file with name soundID.mp3 from the default sound
*	directory. May return null if no sound could be matched to the ID.
*	@private
*	@param {string}		soundID		String identifier for the desired sound
*	@param {string} relativePath	Path to the sound file, relative to ktree.sound.SOUND_ROOT
*	@return {SMSound} 	sound		May be null if no sound could be matched to the argument ID
*/
ktree.Soundscape.prototype.getSound_ = function(soundID, params) {
	var sound = soundManager.getSoundById(soundID);
	if (!sound) {
		sound = this.loadSound(soundID, params);
		if (!sound) {
			ktree.debug.logError('Soundscape.getSound could not find a sound with ID <' + soundID + '>');
			return null;
		}
	}
	return sound;
}

/**
*	TODO: Not yet supported
*			fade_in_delay
*			fade_in_duration
*			fade_down_delay
*			fade_down_volume
*			fade_down_duration
*			loop
*/
ktree.Soundscape.prototype.loadSound = function(soundID, params) {
	var smParams = {
		id: params.name,
		url: goog.string.buildString(ktree.sound.SOUND_ROOT, params.path),
		volume: params.volume,
		onload: function() {
			this.setPosition(params.start_position);
		}
	};
	return soundManager.createSound(smParams);
}

ktree.Soundscape.prototype.mergeParamsWithDefaults_ = function(jsonParams) {
	var params = jsonParams.sound;
	if (!params.volume) {
		params.volume = ktree.sound.DEFAULT_VOLUME;
	}
	if (!params.fade_in_duration) {
		params.fade_in_duration = ktree.sound.DEFAULT_FADE_DURATION;
	}
	return params;	
}

/**
*	TODO: This function is not currently working! soundManager.canPlayURL does not actually check for the existence
*	of a file at the URL -- it just checks that the URL is of valid format and file type.
*
*	Given an argument sound ID string, attempt to find and load a "matching" (i.e. named soundID.mp3) in the
*	server's default sound directory.
*	@private
*	@param {string}		soundID		ID string identifying the desired sound
*	@return {SMSound} 	sound		The sound matching the argument ID string. May be null if no match is found.
*/
ktree.Soundscape.prototype.findAndLoadSound_ = function(soundID, targetVolume) {
	if (!targetVolume) {
		targetVolume = ktree.sound.DEFAULT_TARGET_VOLUME;
	}
	var music_url = goog.string.buildString(ktree.sound.MUSIC_DIR, soundID, '.mp3');
	if (soundManager.canPlayURL(music_url)) {
		this.targetVolumes_.set(soundID, targetVolume);
		return soundManager.createSound(soundID, music_url);
	}
	else {
		var ambient_url = goog.string.buildString(ktree.sound.AMBIENT_DIR, soundID, '.mp3');
		if (soundManager.canPlayURL(ambient_url)) {
			this.targetVolumes_.set(soundID, targetVolume);
			return soundManager.createSound(soundID, ambient_url);
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

ktree.Soundscape.prototype.testButtons = function() {
	var b1 = new goog.ui.Button('Test Fade Out');
	b1.render(goog.dom.$('button-fade-out'));
	goog.events.listen(b1, goog.ui.Component.EventType.ACTION, this.fadeOutTest, false, this);
	
	var b2 = new goog.ui.Button('Test Fade In');
	b2.render(goog.dom.$('button-fade-in'));
	goog.events.listen(b2, goog.ui.Component.EventType.ACTION, this.fadeInTest, false, this);
}

ktree.Soundscape.prototype.fadeOutTest = function() {
	this.fadeOut('hidden-sky-free', 8000);
}

ktree.Soundscape.prototype.fadeInTest = function() {
	this.fadeIn('desert-wind', 5000);
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
	//soundManager.createSound('floating-bamboo-free', 'sound/music/floating-bamboo-free.mp3');
	//soundManager.createSound('the-dimpled-cheek-free', 'sound/music/the-dimpled-cheek-free.mp3');
	//soundManager.createSound('triosante-allegro-free', 'sound/music/triosante-allegro-free.mp3');
	//soundManager.createSound('desert-wind', 'sound/ambient/desert-wind.mp3');
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
soundManager.onready(
	function(status) {
			ktree.Soundscape.onReady_();
		}, 
		ktree.Soundscape.target_
	);