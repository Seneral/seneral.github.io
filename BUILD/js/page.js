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
	//SetupModernizr ();
	//updateHeader ();
};

$(document).ready (main);

$(window).scroll(updateHeader);

