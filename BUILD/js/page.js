function updateHeader () 
{
	/* Transparent header over image (have to remove headerHeight offset)
	$("#debug").text("scrollTop:" + $(document).scrollTop());
	if ($(document).scrollTop() == 0) {
		$('.header').css( { 
			'background-color':'transparent',
			'color':'black'
		});
	} else {
		$('.header').css({ 
			'background-color':'var(--backCol)',
			'color':'var(--frontCol)'
		});
	}*/
}

function main () 
{
	$("*").removeClass ("hideOnStart");

	$("img.hisrc, .hisrc img").hisrc({
		minKbpsForHighBandwidth: 300,
		speedTestUri: "img/50k.jpg",
		speedTestKB: 50,
		speedTestExpireMinutes: 20,
		srcIsLowResolution: true,
		// Debug
		forcedBandwidth: true, 
	});

	$("img.hisrc_two, .hisrc_two img").hisrc({
		minKbpsForHighBandwidth: 300,
		speedTestUri: "img/50k.jpg",
		speedTestKB: 50,
		speedTestExpireMinutes: 20,
		srcIsLowResolution: false,
		// Debug
		forcedBandwidth: true, 
	});
	
	updateHeader ();
	$(window).scroll(updateHeader);
};

$.hisrc.speedTest();
$(document).ready (main);