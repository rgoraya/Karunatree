goog.provide('ktree.sound');

/**
*	@fileoverview
*	Defines constants in the ktree.sound namespace.
*	@see {ktree.sound.Soundscape}
*
*	@version 0.1
*/

ktree.sound.SOUND_ROOT = "sound/";

/**
*	Relative server directory in which music files are stored
*/
ktree.sound.MUSIC_DIR = "sound/music/";

/**
*	Relative server directory in which ambient sound files are stored
*/
ktree.sound.AMBIENT_DIR = "sound/ambient/";

/**
*	Default target volume assigned to sounds which do not specify an
*	alternative
*/
ktree.sound.DEFAULT_VOLUME = 100;

/**
*	Duration, in milliseconds, of a default fade effect
*/
ktree.sound.DEFAULT_FADE_DURATION = 5000;

/**
*	Timestep, in milliseconds, used to adjust volume during fade effects
*/
ktree.sound.FADE_TIMESTEP = 100;

/**
*	An error term, in milliseconds, used to adjust the operation of fade timers.
*	Fade timers will continue to run for the specified fade duration PLUS the
*	FADE_DELAY_ERROR. This is sometimes needed to allow fade effects to complete
*	smoothly because, for example, a 100 msec timer will not always be able to fully 
*	execute exactly 10 times during one clock second.
*/

ktree.sound.FADE_DURATION_ERROR = 5000;