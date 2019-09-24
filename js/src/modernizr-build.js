/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-setclasses-cssclassprefix:supports- !*/
!function(n,e,s){function o(n,e){return typeof n===e}function a(){var n,e,s,a,i,l,r;for(var c in f)if(f.hasOwnProperty(c)){if(n=[],e=f[c],e.name&&(n.push(e.name.toLowerCase()),e.options&&e.options.aliases&&e.options.aliases.length))for(s=0;s<e.options.aliases.length;s++)n.push(e.options.aliases[s].toLowerCase());for(a=o(e.fn,"function")?e.fn():e.fn,i=0;i<n.length;i++)l=n[i],r=l.split("."),1===r.length?Modernizr[r[0]]=a:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=a),t.push((a?"":"no-")+r.join("-"))}}function i(n){var e=r.className,s=Modernizr._config.classPrefix||"";if(c&&(e=e.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+s+"no-js(\\s|$)");e=e.replace(o,"$1"+s+"js$2")}Modernizr._config.enableClasses&&(e+=" "+s+n.join(" "+s),c?r.className.baseVal=e:r.className=e)}var t=[],f=[],l={_version:"3.3.1",_config:{classPrefix:"supports-",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(n,e){var s=this;setTimeout(function(){e(s[n])},0)},addTest:function(n,e,s){f.push({name:n,fn:e,options:s})},addAsyncTest:function(n){f.push({name:null,fn:n})}},Modernizr=function(){};Modernizr.prototype=l,Modernizr=new Modernizr;var r=e.documentElement,c="svg"===r.nodeName.toLowerCase();a(),i(t),delete l.addTest,delete l.addAsyncTest;for(var u=0;u<Modernizr._q.length;u++)Modernizr._q[u]();


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