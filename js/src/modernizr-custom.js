;(function(window, document, undefined){
  var classes = [];
  var tests = [];
  
  var ModernizrProto = {
    _version: '3.3.1',
    _config: {
      'classPrefix': "supports-",
      'enableClasses': true,
      'enableJSClass': true,
      'usePrefixes': true
    },
    _q: [],
    on: function(test, cb) {
      var self = this;
      setTimeout(function() {
        cb(self[test]);
      }, 0);
    },
    addTest: function(name, fn, options) {
      tests.push({name: name, fn: fn, options: options});
    },
    addAsyncTest: function(fn) {
      tests.push({name: null, fn: fn});
    }
  };
  
  var Modernizr = function() {};
  Modernizr.prototype = ModernizrProto;
  Modernizr = new Modernizr();
  
  function is(obj, type) {
    return typeof obj === type;
  };
  
  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx];
        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());
          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        }
		
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;
		
        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureName = featureNames[nameIdx];
          featureNameSplit = featureName.split('.');
          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }
            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }
          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  };
  
  var docElement = document.documentElement;
  var isSVG = docElement.nodeName.toLowerCase() === 'svg';
  
  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';
    if (isSVG) {
      className = className.baseVal;
    }
    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }
    if (Modernizr._config.enableClasses) {
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
      isSVG ? docElement.className.baseVal = className : docElement.className = className;
    }
  };
  
  var prefixes = (ModernizrProto._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : ['','']);
  ModernizrProto._prefixes = prefixes;

  function createElement() {
    if (typeof document.createElement !== 'function') {
      return document.createElement(arguments[0]);
    } else if (isSVG) {
      return document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0]);
    } else {
      return document.createElement.apply(document, arguments);
    }
  };
  
  Modernizr.addTest('csscalc', function() {
    var prop = 'width:';
    var value = 'calc(10px);';
    var el = createElement('a');
    el.style.cssText = prop + prefixes.join(value + prop);
    return !!el.style.length;
  });


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
  
  function getBody() {
    var body = document.body;
    if (!body) {
      body = createElement(isSVG ? 'svg' : 'body');
      body.fake = true;
    }
    return body;
  };
  
  function injectElementWithStyles(rule, callback, nodes, testnames) {
    var mod = 'modernizr';
    var style;
    var ret;
    var node;
    var docOverflow;
    var div = createElement('div');
    var body = getBody();
    if (parseInt(nodes, 10)) {
      while (nodes--) {
        node = createElement('div');
        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
        div.appendChild(node);
      }
    }
    style = createElement('style');
    style.type = 'text/css';
    style.id = 's' + mod;
    (!body.fake ? div : body).appendChild(style);
    body.appendChild(div);
    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(document.createTextNode(rule));
    }
    div.id = mod;
    if (body.fake) {
      body.style.background = '';
      body.style.overflow = 'hidden';
      docOverflow = docElement.style.overflow;
      docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }
    ret = callback(div, rule);
    if (body.fake) {
      body.parentNode.removeChild(body);
      docElement.style.overflow = docOverflow;
      docElement.offsetHeight;
    } else {
      div.parentNode.removeChild(div);
    }
    return !!ret;
  };
  
  
  var testStyles = ModernizrProto.testStyles = injectElementWithStyles;
  
  
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

  var mq = (function() {
    var matchMedia = window.matchMedia || window.msMatchMedia;
    if (matchMedia) {
      return function(mq) {
        var mql = matchMedia(mq);
        return mql && mql.matches || false;
      };
    }
    return function(mq) {
      var bool = false;
      injectElementWithStyles('@media ' + mq + ' { #modernizr { position: absolute; } }', function(node) {
        bool = (window.getComputedStyle ?
                window.getComputedStyle(node, null) :
                node.currentStyle).position == 'absolute';
      });
      return bool;
    };
  })();
  
  ModernizrProto.mq = mq;
  
  Modernizr.addTest('mediaqueries', mq('only all'));
  
  var omPrefixes = 'Moz O ms Webkit';
  
  var cssomPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.split(' ') : []);
  ModernizrProto._cssomPrefixes = cssomPrefixes;
  
  var domPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(' ') : []);
  ModernizrProto._domPrefixes = domPrefixes;
  
  function contains(str, substr) {
    return !!~('' + str).indexOf(substr);
  };
  
  function cssToDOM(name) {
    return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
      return m1 + m2.toUpperCase();
    }).replace(/^-/, '');
  };

  function fnBind(fn, that) {
    return function() {
      return fn.apply(that, arguments);
    };
  };
  
  function testDOMProps(props, obj, elem) {
    var item;

    for (var i in props) {
      if (props[i] in obj) {
        if (elem === false) {
          return props[i];
        }
        item = obj[props[i]];
        if (is(item, 'function')) {
          return fnBind(item, elem || obj);
        }
        return item;
      }
    }
    return false;
  };
  
  testStyles('#modernizr { width: 50vw; }', function(elem) {
    var width = parseInt(window.innerWidth / 2, 10);
    var compStyle = parseInt((window.getComputedStyle ?
                              getComputedStyle(elem, null) :
                              elem.currentStyle).width, 10);

    Modernizr.addTest('cssvwunit', compStyle == width);
  });
  
  var modElem = {
    elem: createElement('modernizr')
  };
  
  Modernizr._q.push(function() {
    delete modElem.elem;
  });
  
  var mStyle = {
    style: modElem.elem.style
  };
  
  Modernizr._q.unshift(function() {
    delete mStyle.style;
  });
  
  function domToCSS(name) {
    return name.replace(/([A-Z])/g, function(str, m1) {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
  };
  
  function nativeTestProps(props, value) {
    var i = props.length;
    // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
    if ('CSS' in window && 'supports' in window.CSS) {
      // Try every prefixed variant of the property
      while (i--) {
        if (window.CSS.supports(domToCSS(props[i]), value)) {
          return true;
        }
      }
      return false;
    }
    // Otherwise fall back to at-rule (for Opera 12.x)
    else if ('CSSSupportsRule' in window) {
      // Build a condition string for every prefixed variant
      var conditionText = [];
      while (i--) {
        conditionText.push('(' + domToCSS(props[i]) + ':' + value + ')');
      }
      conditionText = conditionText.join(' or ');
      return injectElementWithStyles('@supports (' + conditionText + ') { #modernizr { position: absolute; } }', function(node) {
        return getComputedStyle(node, null).position == 'absolute';
      });
    }
    return undefined;
  };
  
  function testProps(props, prefixed, value, skipValueTest) {
    skipValueTest = is(skipValueTest, 'undefined') ? false : skipValueTest;
    if (!is(value, 'undefined')) {
      var result = nativeTestProps(props, value);
      if (!is(result, 'undefined')) {
        return result;
      }
    }
    var afterInit, i, propsLength, prop, before;
    var elems = ['modernizr', 'tspan', 'samp'];
    while (!mStyle.style && elems.length) {
      afterInit = true;
      mStyle.modElem = createElement(elems.shift());
      mStyle.style = mStyle.modElem.style;
    }
    function cleanElems() {
      if (afterInit) {
        delete mStyle.style;
        delete mStyle.modElem;
      }
    }
    propsLength = props.length;
    for (i = 0; i < propsLength; i++) {
      prop = props[i];
      before = mStyle.style[prop];
      if (contains(prop, '-')) {
        prop = cssToDOM(prop);
      }
      if (mStyle.style[prop] !== undefined) {
        if (!skipValueTest && !is(value, 'undefined')) {
          try {
            mStyle.style[prop] = value;
          } catch (e) {}
          if (mStyle.style[prop] != before) {
            cleanElems();
            return prefixed == 'pfx' ? prop : true;
          }
        }
        else {
          cleanElems();
          return prefixed == 'pfx' ? prop : true;
        }
      }
    }
    cleanElems();
    return false;
  };
  
  function testPropsAll(prop, prefixed, elem, value, skipValueTest) {

    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
    props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
    if (is(prefixed, 'string') || is(prefixed, 'undefined')) {
      return testProps(props, prefixed, value, skipValueTest);
    } else {
      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
      return testDOMProps(props, prefixed, elem);
    }
  }
  ModernizrProto.testAllProps = testPropsAll;

  function testAllProps(prop, value, skipValueTest) {
    return testPropsAll(prop, undefined, undefined, value, skipValueTest);
  }
  ModernizrProto.testAllProps = testAllProps;

  Modernizr.addTest('cssanimations', testAllProps('animationName', 'a', true));
  
  testRunner();
  
  setClasses(classes);

  delete ModernizrProto.addTest;
  delete ModernizrProto.addAsyncTest;
  
  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  }
  
  window.Modernizr = Modernizr;

})(window, document);