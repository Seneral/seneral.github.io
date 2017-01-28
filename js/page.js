function SetupModernizr () 
{
	Modernizr.addTest('csscalc', function() {
		var prop = 'width:';
		var value = 'calc(10px);';
		var el = createElement('a');
		el.style.cssText = prop + prefixes.join(value + prop);
		return !!el.style.length;
	});

	Modernizr.addTest('cssanimations', testAllProps('animationName', 'a', true));

	Modernizr.addTest('cssgradients', function() {
		var str1 = 'background-image:';
		var str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));';
		var css = '';
		var angle;

		for (var i = 0, len = prefixes.length - 1; i < len; i++) {
			angle = (i === 0 ? 'to ' : '');
			css += str1 + prefixes[i] + 'linear-gradient(' + angle + 'left top, #9f9, white);';
		}

		if (Modernizr._config.usePrefixes) {
			// legacy webkit syntax (FIXME: remove when syntax not in use anymore)
			css += str1 + '-webkit-' + str2;
		}

		var elem = createElement('a');
		var style = elem.style;
		style.cssText = css;

		// IE6 returns undefined so cast to string
		return ('' + style.backgroundImage).indexOf('gradient') > -1;
	});

	Modernizr.addTest('touchevents', function() {
		var bool;
		if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
			bool = true;
		} else {
			// include the 'heartz' as a way to have a non matching MQ to help terminate the join
			// https://git.io/vznFH
			var query = ['@media (', prefixes.join('touch-enabled),('), 'heartz', ')', '{#modernizr{top:9px;position:absolute}}'].join('');
			testStyles(query, function(node) {
				bool = node.offsetTop === 9;
			});
		}
		return bool;
	});

	Modernizr.addTest('checked', function() {
		return testStyles('#modernizr {position:absolute} #modernizr input {margin-left:10px} #modernizr :checked {margin-left:20px;display:block}', function(elem) {
			var cb = createElement('input');
			cb.setAttribute('type', 'checkbox');
			cb.setAttribute('checked', 'checked');
			elem.appendChild(cb);
			return cb.offsetLeft === 20;
		});
	});

	testStyles('#modernizr { height: 50vh; }', function(elem) {
		var height = parseInt(window.innerHeight / 2, 10);
		var compStyle = parseInt((window.getComputedStyle ?
								getComputedStyle(elem, null) :
								elem.currentStyle).height, 10);
		Modernizr.addTest('cssvhunit', compStyle == height);
	});

	testStyles('#modernizr { width: 50vw; }', function(elem) {
		var width = parseInt(window.innerWidth / 2, 10);
		var compStyle = parseInt((window.getComputedStyle ?
								getComputedStyle(elem, null) :
								elem.currentStyle).width, 10);
		Modernizr.addTest('cssvwunit', compStyle == width);
	});

	Modernizr.addTest('mediaqueries', mq('only all'));
}


function updateHeader () 
{
	/*$("#debug").text("scrollTop:" + $(document).scrollTop());
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

