function dwindowHeight()
	//Standard browsers (Mozilla, Safari, etc.)
	if (self.innerHeight)
		return self.innerHeight;
	// IE 6
	if (document.documentElement && document.documentElement.clientHeight)
		return y = document.documentElement.clientHeight;
	// IE 5
	if (document.body)
		return document.body.clientHeight
	// Just in case
	alert('KarunaTree doesn\'t recognize your browser. This may cause problems when resizing the window')
	return 0;
}

function handleResize() {
	var windowHeight = windowHeight();
	var earthHeight -= document.getElementById('drawer_wrapper').offsetHeight;
	alert('Setting earth height to ' + earthHeight + 'out of ' + windowHeight + 'pixels.');
	document.getElementById('earth').style.height = height + 'px';
}

