function getNumericalProp (element, property, defaultValue) 
{
	try {
		return parseFloat(window.getComputedStyle(element, null).getPropertyValue(property));
	} catch (err) {
		return defaultValue;
	}
}
function getDefaultFontSize () 
{
	return getNumericalProp (document.body, 'font-size', 16);
}
function resetProperty (element, property) {
	// Both should work
	element[0].style.removeProperty (property);
	element.css(property, '');
}


function updateScrollPos () 
{
	var $window = $(window), $sideNav = $('.sideNav');
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

	/* Make fixed header transparent over image (have to remove headerHeight offset) */
	/*$("#debug").text("scrollTop:" + $(document).scrollTop());*/
	/*if ($window.scrollTop() == 0) {
		$header.css( { 
			'background-color':'transparent',
			'color':'black'
		});
	} else {
		$header.css({ 
			'background-color':'var(--backCol)',
			'color':'var(--frontCol)'
		});
	}*/
}

function setupHiSrc () 
{
	$("img.hisrc, .hisrc img").hisrc({
		minKbpsForHighBandwidth: 300,
		speedTestUri: "img/50k.jpg",
		speedTestKB: 50,
		speedTestExpireMinutes: 20,
		srcIsLowResolution: true,
		// Debug
		/*forcedBandwidth: true, */
	});

	$("img.hisrc_two, .hisrc_two img").hisrc({
		minKbpsForHighBandwidth: 300,
		speedTestUri: "img/50k.jpg",
		speedTestKB: 50,
		speedTestExpireMinutes: 20,
		srcIsLowResolution: false,
		// Debug
		/*forcedBandwidth: true, */
	});
}

function main () 
{
	$("*").removeClass ("hideOnStart");

	setupHiSrc ();

	updateScrollPos ();
};

$.hisrc.speedTest();
$(document).ready (main);