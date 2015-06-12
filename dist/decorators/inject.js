'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _writers = require('../writers');

var Inject = function Inject() {
	for (var _len = arguments.length, dependencies = Array(_len), _key = 0; _key < _len; _key++) {
		dependencies[_key] = arguments[_key];
	}

	return function (t) {
		if (_writers.baseWriter.has('$inject', t)) {
			var parentInjects = _writers.baseWriter.get('$inject', t);
			_writers.baseWriter.set('$inject', [].concat(dependencies, _toConsumableArray(parentInjects)), t);
		} else {
			_writers.baseWriter.set('$inject', dependencies, t);
		}
	};
};
exports.Inject = Inject;