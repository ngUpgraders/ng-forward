'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _writers = require('../../writers');

var Require = function Require() {
	for (var _len = arguments.length, components = Array(_len), _key = 0; _key < _len; _key++) {
		components[_key] = arguments[_key];
	}

	return function (t) {
		if (_writers.componentWriter.has('require', t)) {
			var oldRequires = _writers.componentWriter.get('require', t);
			_writers.componentWriter.set('require', [].concat(_toConsumableArray(oldRequires), components), t);
		} else {
			_writers.componentWriter.set('require', components, t);
		}
	};
};
exports.Require = Require;