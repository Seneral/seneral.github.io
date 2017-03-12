// UTILITY
function getNumericalProp (element, property, defaultValue) { 
	try { return parseFloat(window.getComputedStyle(element, null).getPropertyValue(property)); } 
	catch (err) { return defaultValue; }
}
function getDefaultFontSize () {
	return getNumericalProp (document.body, 'font-size', 16);
}
function resetProperty (element, property) { // Both should work, but just in case one isn't supported
	element.css(property, ''); element[0].style.removeProperty (property);
}
// STICKY PANELS
function initiateStickyPanels () {
	var $window = $(window), $sideNav = $('.sticky');
	if ($sideNav.length)
	{ /* Side Navigation box */
		var defaultOffset = $sideNav.offset ().top, defaultMargin = parseFloat ($sideNav.css('margin-top')), padding = 65, defaultFontSize = getDefaultFontSize ();
		//$(".debug").text ("Values: defaultOffset: " + defaultOffset + "; defaultMargin: " + defaultMargin + "; defaultFontSize: " + defaultFontSize);
		var update = function () {
			//$(".debug").text ($window.width () + " > " + (90*defaultFontSize) +" && " + $window.scrollTop() + " > " + (defaultOffset - padding + defaultMargin));
			if ($window.width () > (90*defaultFontSize) && $window.scrollTop() > (defaultOffset + defaultMargin - padding)) {
				$sideNav.css('marginTop', $window.scrollTop() - (defaultOffset - padding)); // Overwrite css margin-top to push sideNav down
				//$(".debug").text ("Adjusting with current offset " + $sideNav.offset ().top + " and current margin " + parseFloat ($sideNav.css('margin-top')) + 
				//	" and with defaultOffset: " + defaultOffset + " and defaultMargin " + defaultMargin + "!");
			} else {
				resetProperty ($sideNav, 'marginTop');
				resetProperty ($sideNav, 'margin-top');
				//$(".debug").text ("Reset to defaultOffset: " + defaultOffset + " and defaultMargin " + defaultMargin + "!");
			}
		};
		$(window).scroll(update);
		$(window).resize(function () {
			/* Update default values  */
			resetProperty ($sideNav, 'marginTop');
			resetProperty ($sideNav, 'margin-top');
			defaultMargin = parseFloat ($sideNav.css('margin-top'));
			defaultOffset = $sideNav.offset ().top;
			update ();
			//$(".debug").text ("Resized! Updating values to defaultOffset: " + defaultOffset + " and defaultMargin: " + defaultMargin + "!");
		});
		update ();
	}
}
// HISRC ADAPTIVE IMAGE LOADING
function setupHiSrc () {
	// Setup different variations of HiSrc, each only responsible for replacing
	// Do not perform a speed test on their own

	var doHiSRC = function () {
		// Applies to banners (width:100%), which are available in 800, 1600 and 2400 horizontal sizes:
		var $banners = $(".banner.hisrc img.bannerImg");
		$banners.hisrc({
			speedTestUri: '', // Don't do another speed test
			srcIsLowResolution: true,
			// Set banner specific sizes
			minHDSize: 1600,
			minRetinaSize: 2400,
		});
		
		// Applies to all other images only having medium and high quality versions
		var $normalImgs = $("img.hisrc, hisrc img").not($banners);
		$normalImgs.hisrc({
			speedTestUri: '', // Don't do another speed test
			srcIsLowResolution: true,
			// Set minimum screen size for high quality version
			minHDSize: 1200,
			minRetinaSize: 2200,
		});
	};

	doHiSRC ();

	// Screen size can increase, usually due to moving window to a higher-res second screen or changing orientation
	var initialWidth = screen.width;
	$(window).resize(function () {
		if (screen.width > initialWidth)
		{ // Reload higher quality content suitable for the new resolution, but only if it is needed
			initialWidth = screen.width;
			doHiSRC ();
		}
	});
}
// GOOGLE ANALYTICS CONTROL
var gaProperty = 'UA-92606737-1';
var disableGA = 'ga-disable-' + gaProperty;
function gaCheck () {
	if (document.cookie.indexOf(disableGA + '=true') > -1)
		window[disableGA] = true; // Cookie set to disble GA
	else if (document.cookie.indexOf(disableGA + '=false') > -1)
		window[disableGA] = false; // Cookie set to allow GA
	else
		$('.cookieNote').show (); // Cookie not yet set - show cookie note
}
function gaOptout () { setGADisable (true); }
function gaAgree () { setGADisable (false); }
function setGADisable (toggle) {
	document.cookie = disableGA + '=' + toggle + '; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
	window[disableGA] = toggle;
	$('.cookieNote').hide ();
	//if (toggle == true) alert ("Analytics have been disabled!");
}

// ON START

// Perform the first and only speed test of hiSrc
$.hisrc.speedTest ({
	minKbpsForHighBandwidth: 200,
	speedTestUri: "http://www.seneral.dev/img/50K.jpg",
	speedTestKB: 50,
	speedTestExpireMinutes: 20,
	secondChance: true, // Enable second chance for desktop
	/*forcedBandwidth: 'high',*/ // Debug
});
/*$(document).on('speedTestComplete.hisrc', function () {
	$(".debug").text("Network: " + $.hisrc.bandwidth + " (" + $.hisrc.connectionKbps + "Kbps) in " + $.hisrc.connectionType + " network!");
});*/

// Start JS Routines
$(document).ready (function () {
	$("*").removeClass ("hideOnStart");
	setupHiSrc ();
	initiateStickyPanels ();
	gaCheck ();
	// gaStart has already been called right when html was loaded
});