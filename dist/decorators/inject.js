'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _providersService = require('./providers/service');

var _writers = require('../writers');

var Inject = function Inject() {
	for (var _len = arguments.length, injects = Array(_len), _key = 0; _key < _len; _key++) {
		injects[_key] = arguments[_key];
	}

	return function (t) {
		var dependencies = injects.map(function (injectable) {
			if (typeof injectable === 'string') {
				return injectable;
			} else if (_writers.providerWriter.has('type', injectable)) {
				return _writers.providerWriter.get('name', injectable);
			} else if (typeof injectable === 'function') {
				(0, _providersService.Service)(injectable);
				return _writers.providerWriter.get('name', injectable);
			}
		});

		if (_writers.baseWriter.has('$inject', t)) {
			var parentInjects = _writers.baseWriter.get('$inject', t);
			_writers.baseWriter.set('$inject', [].concat(_toConsumableArray(dependencies), _toConsumableArray(parentInjects)), t);
		} else {
			_writers.baseWriter.set('$inject', dependencies, t);
		}
	};
};
exports.Inject = Inject;