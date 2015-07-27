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

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _utilEvents = require('../util/events');

var _utilEvents2 = _interopRequireDefault(_utilEvents);

exports['default'] = function (config, t) {
	// Support for legacy angular-decorators bind config
	if (config.bind) {
		_writers.componentWriter.set('scope', config.bind, t);
		_writers.componentWriter.set('bindToController', true, t);
	}

	// Check for scope
	if (config.scope) {
		var scope = _writers.componentWriter.get('scope', t);

		if (scope && typeof scope === 'object') {
			_writers.componentWriter.set('scope', (0, _extend2['default'])(scope, config.scope), t);
		} else {
			_writers.componentWriter.set('scope', config.scope, t);
		}
	}

	// Check for Angular 2 style properties
	if (config.properties && Array.isArray(config.properties)) {
		var binders = (0, _parseProperties2['default'])(config.properties);
		var previous = _writers.componentWriter.get('bindToController', t);

		if (previous && typeof previous === 'object') {
			_writers.componentWriter.set('bindToController', (0, _extend2['default'])(previous, binders), t);
		} else {
			_writers.componentWriter.set('bindToController', (0, _parseProperties2['default'])(config.properties), t);
		}
	} else if (config.properties !== undefined) {
		throw new TypeError('Component properties must be an array');
	}

	// events
	if (config.events && Array.isArray(config.events)) {
		_utilEvents2['default'].add.apply(_utilEvents2['default'], _toConsumableArray(config.events));
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