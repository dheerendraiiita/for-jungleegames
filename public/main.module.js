/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _util = __webpack_require__(1);

	__webpack_require__(2);

	var DATA_URL = 'http://itunes.apple.com';
	var RECORD_TPL = null;
	var validateFields = {
	    artist: 'Jack',
	    limit: 4,
	    errorVisible: false
	};
	window.onInit = function () {};

	function _setError(elm, cls) {
	    if (!validateFields.errorVisible) {
	        _util.Util.toggleClass(elm, cls);
	        validateFields.errorVisible = true;
	    }
	}
	window.openNav = function () {
	    document.getElementById("overlayWin").style.width = "100%";
	};
	window.closeNav = function () {
	    document.getElementById("overlayWin").style.width = "0";
	};
	window.validateForm = function (form) {
	    var errElm = document.getElementById('fError');

	    if (form["artist"].value.trim('') === "" || form["trackno"].value === "") {
	        errElm.innerHTML = 'Please enter form values';
	        _setError(errElm, 'hide');
	    } else if (form["artist"].value.toLowerCase() !== validateFields.artist.toLowerCase()) {
	        errElm.innerHTML = 'Track name is not <b>' + validateFields.artist + '</b>. Please enter track name as <b>' + validateFields.artist + '</b>.';
	        _setError(errElm, 'hide');
	    } else if (form["trackno"].value != validateFields.limit) {
	        errElm.innerHTML = 'Track limit is not <b>' + validateFields.limit + '</b>. Please enter track limit to <b>' + validateFields.limit + '</b>.';;
	        _setError(errElm, 'hide');
	    } else {
	        errElm.innerHTML = 'Data is loading. Please wait';
	        _setError(errElm, 'hide');
	        _util.Util.toggleClass(document.getElementById('submitbtn'), 'hide');
	        var uri = DATA_URL + '/search?term=' + form["artist"].value + '&limit=' + form["trackno"].value;

	        _util.DataSvc.get(uri).then(function (response) {
	            return response.json();
	        }).catch(function (error) {
	            return console.error('Error:', error);
	        }).then(function (response) {
	            _util.DataStorage.setData(response);
	            toggleDefaultWindow();
	            toggleRecordWindow();
	            _setRecordData(form);
	            closeNav();
	        });
	    }
	};

	/*****************************************************
	 * Toggle window
	 *****************************************************/
	window.toggleDefaultWindow = function () {
	    _util.Util.toggleClass(document.getElementById('default-window'), 'hide');
	};

	window.toggleRecordWindow = function () {
	    _util.Util.toggleClass(document.getElementById('records-container'), 'hide');
	};

	function _setRecordData(form) {
	    var parentCon = document.querySelector('#record-content');
	    if (!RECORD_TPL) {
	        RECORD_TPL = document.querySelector('.record');
	        parentCon.removeChild(RECORD_TPL); // now Template is removed
	    }
	    parentCon.innerHTML = '';

	    var titleParent = document.querySelector('#records-container');
	    titleParent.getElementsByClassName('track-search-for')[0].innerText = '"' + form["artist"].value + '"';

	    var data = _util.DataStorage.getData().results;
	    data.forEach(function (data, index) {
	        addnode(parentCon, RECORD_TPL, data);
	    });
	}

	function addnode(parentCon, childNode, data) {
	    var con = childNode.cloneNode(true);

	    con.getElementsByClassName('artist-name')[0].innerText = data.artistName;
	    con.getElementsByClassName('track-name')[0].innerText = data.trackName;
	    con.getElementsByClassName('track-desc')[0].innerText = data.shortDescription || data.longDescription;
	    con.getElementsByClassName('track-img')[0].src = data.artworkUrl100 || data.artworkUrl60 || data.artworkUrl30;

	    con.getElementsByClassName('record-thumbnail-circle')[0].className += ' grad' + _util.Util.getRandomInt(1, 8);

	    parentCon.appendChild(con);
	}
	/*****************************************************
	 * Reset data to defaults
	 *******************************************************/
	window.resetDefaults = function () {
	    toggleDefaultWindow();
	    toggleRecordWindow();
	    _resetForm();
	};

	function _resetForm() {
	    validateFields.errorVisible = false;
	    document.forms['nameform']["artist"].value = '';
	    document.forms['nameform']["trackno"].value = '';

	    var errElm = document.getElementById('fError');
	    errElm.innerHTML = '';
	    _util.Util.toggleClass(errElm, 'hide');
	    _util.Util.toggleClass(document.getElementById('submitbtn'), 'hide');
	}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Util = {
	    data: null,
	    toggleClass: function toggleClass(elem, className) {
	        if (elem) elem.classList.toggle(className);
	    },
	    getRandomInt: function getRandomInt(min, max) {
	        return Math.floor(Math.random() * (max - min + 1)) + min;
	    }
	};
	var DataSvc = {
	    data: null,
	    get: function get(url) {
	        return fetch(url, {
	            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
	            credentials: 'same-origin', // include, same-origin, *omit
	            method: 'GET', // *GET, POST, PUT, DELETE, etc.
	            mode: 'cors', // no-cors, cors, *same-origin
	            redirect: 'follow', // manual, *follow, error
	            referrer: 'no-referrer' // *client, no-referrer
	        });
	    }
	};
	var DataStorage = {
	    data: null,
	    setData: function setData(data) {
	        this.data = data;
	    },
	    getData: function getData() {
	        return this.data;
	    }
	};
	exports.Util = Util;
	exports.DataSvc = DataSvc;
	exports.DataStorage = DataStorage;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/stylus-loader/index.js!./main.style.styl", function() {
				var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/stylus-loader/index.js!./main.style.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ":root {\n  --color-flash-green: #1baea3;\n  --color-flash-green-dark: #16939c;\n  --color-flash-green-solid-dark: #065e63;\n  --color-error-red: #ff6161;\n  --color-text-default: #777272;\n}\nbody {\n  font-family: Gotham-Rounded-Book;\n  color: var(--color-text-default);\n}\n.cover-window {\n  width: 100%;\n  height: 100%;\n}\n.float-l {\n  float: left;\n}\n.float-r {\n  float: right;\n}\n.center-align {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.hide {\n  visibility: hidden;\n  display: none;\n}\n.btn {\n  padding: 10px 20px;\n  padding: 10px 50px;\n  outline: none;\n  border: none;\n  border-radius: 5px;\n  color: #fff;\n  font-weight: bold;\n  cursor: pointer;\n  font-size: 20px;\n}\n.pointer {\n  cursor: pointer;\n}\n.p-btn {\n  background: var(--color-flash-green);\n  background: -moz-linear-gradient(top, var(--color-flash-green) 0%, var(--color-flash-green-dark) 100%);\n  background: -webkit-linear-gradient(top, var(--color-flash-green) 0%, var(--color-flash-green-dark) 100%);\n  background: linear-gradient(to bottom, var(--color-flash-green) 0%, var(--color-flash-green-dark) 100%);\n  border-bottom: 2px solid var(--color-flash-green-solid-dark);\n}\n.p-btn:hover {\n/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor var(--color-flash-green)+0,16939c+100 */\n  background: var(--color-flash-green); /* Old browsers */\n  background: -moz-linear-gradient(left, var(--color-flash-green) 0%, var(--color-flash-green-dark) 100%); /* FF3.6-15 */\n  background: -webkit-linear-gradient(left, var(--color-flash-green) 0%, var(--color-flash-green-dark) 100%); /* Chrome10-25,Safari5.1-6 */\n  background: linear-gradient(to right, var(--color-flash-green) 0%, var(--color-flash-green-dark) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n}\n.b-card {\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  min-width: 0;\n  word-wrap: break-word;\n  background-color: #fff;\n  background-clip: border-box;\n  border: 1px solid rgba(212,203,203,0.125);\n  border-radius: 0.25rem;\n}\n.b-card-body {\n  -ms-flex: 1 1 auto;\n  flex: 1 1 auto;\n  padding: 1.25rem;\n}\n.b-card-header {\n  padding: 10px;\n}\n.search-box {\n  width: 460px;\n}\n/* ****** Second screen ********* */\n.sidenav {\n  height: 100%;\n  width: 0;\n  position: fixed;\n  z-index: 1;\n  top: 0;\n  left: 0;\n  background-color: #797676;\n  overflow-x: hidden;\n  transition: 0.5s;\n}\n.sidenav a {\n  padding: 8px 8px 8px 32px;\n  text-decoration: none;\n  font-size: 25px;\n  color: #818181;\n  display: block;\n  transition: 0.3s;\n}\n.sidenav a:hover {\n  color: #f1f1f1;\n}\n.sidenav .closebtn {\n  position: absolute;\n  top: 0;\n  right: 25px;\n  font-size: 36px;\n  margin-left: 50px;\n}\n@media screen and (max-height: 450px) {\n  .sidenav {\n    padding-top: 15px;\n  }\n  .sidenav a {\n    font-size: 18px;\n  }\n}\n.selection-box {\n  width: 650px;\n  height: 350px;\n}\n.form-group {\n  margin-bottom: 15px;\n}\nlabel {\n  display: inline-block;\n  max-width: 100%;\n  margin-bottom: 5px;\n  font-weight: 700;\n  width: 20%;\n}\n.form-control {\n  height: 34px;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  color: #555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);\n  box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);\n  -webkit-transition: border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s;\n  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n  width: 60%;\n}\n.form-control:focus {\n  border-color: #66afe9;\n  outline: 0;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075), 0 0 8px rgba(102,175,233,0.6);\n  box-shadow: inset 0 1px 1px rgba(0,0,0,0.075), 0 0 8px rgba(102,175,233,0.6);\n}\n.margin-l-20-p {\n  margin-left: 20%;\n}\n.error {\n  color: var(--color-error-red);\n  display: block;\n}\n/* **********************Tracks ******* */\n#records-container {\n  padding: 40px 30px;\n}\n.record-thumbnail-circle {\n  width: 150px;\n  height: 150px;\n  border-radius: 50%;\n}\n.record-details-area {\n  border-bottom: 2px solid #bfbfbf;\n  margin-left: 180px;\n  padding-top: 20px;\n  padding-bottom: 10px;\n  min-height: 140px;\n}\n.record-track,\n.record-name,\n.record-details {\n  padding: 5px 0;\n}\n.clear-text {\n  color: var(--color-flash-green-dark);\n  margin-left: 50px;\n}\n.grad1 {\n  background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%);\n}\n.grad2 {\n  background-image: linear-gradient(to top, #feada6 0%, #f5efef 100%);\n}\n.grad3 {\n  background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);\n}\n.grad4 {\n  background-image: linear-gradient(to top, #9795f0 0%, #fbc8d4 100%);\n}\n.grad5 {\n  background-image: linear-gradient(to top, #d9afd9 0%, #97d9e1 100%);\n}\n.grad6 {\n  background-image: linear-gradient(to right, #92fe9d 0%, #00c9ff 100%);\n}\n.grad7 {\n  background-image: linear-gradient(-20deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%);\n}\n.grad8 {\n  background-image: linear-gradient(to top, #e8198b 0%, #c7eafd 100%);\n}\n", ""]);

	// exports


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ })
/******/ ]);