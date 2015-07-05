'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _module2 = require('../module');

var _module3 = _interopRequireDefault(_module2);

var _writers = require('../writers');

var _parseProperties = require('./parse-properties');

var _parseProperties2 = _interopRequireDefault(_parseProperties);

exports['default'] = function (config, t) {
	// Support for legacy angular-decorators bind config
	if (config.bind) {
		_writers.componentWriter.set('scope', config.bind, t);
		_writers.componentWriter.set('bindToController', true, t);
	}

	// Check for scope
	if (config.scope) {
		_writers.componentWriter.set('scope', config.scope, t);
	}

	// Check for Angular 2 style properties
	if (config.properties && Array.isArray(config.properties)) {
		_writers.componentWriter.set('bindToController', (0, _parseProperties2['default'])(config.properties), t);
	} else if (config.properties !== undefined) {
		throw new TypeError('Component properties must be an array');
	}

	// Allow for renaming the controllerAs
	if (config.controllerAs) {
		_writers.componentWriter.set('controllerAs', config.controllerAs, t);
	}

	// Set a link function
	if (t.link) {
		_writers.componentWriter.set('link', t.link, t);
	}

	// Set a controller function
	if (t.compile) {
		_writers.componentWriter.set('compile', t.compile, t);
	}
};

_module3['default'].addProvider('directive', function (target, name, injects, ngModule) {
	var ddo = {};

	_writers.componentWriter.forEach(function (val, key) {
		ddo[key] = val;
	}, target);

	ddo.controller = [].concat(_toConsumableArray(injects), [target]);

	ngModule.directive(name, function () {
		return ddo;
	});
});
module.exports = exports['default'];