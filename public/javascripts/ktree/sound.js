goog.provide('ktree.Sound');

soundManager.url = 'swf';

soundManager.onload = function() {
	soundManager.createSound('hidden-sky-free', 'sound/hidden-sky-free.mp3');
	soundManager.play('hidden-sky-free');
}

