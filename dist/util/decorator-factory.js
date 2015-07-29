'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _writers = require('../writers');

var _strategy = require('./strategy');

var _strategy2 = _interopRequireDefault(_strategy);

var randomInt = function randomInt() {
	return Math.floor(Math.random() * 100);
};

exports['default'] = function (type) {
	var strategyType = arguments.length <= 1 || arguments[1] === undefined ? 'provider' : arguments[1];

	var names = new Set();

	var createUniqueName = function createUniqueName(_x2) {
		var _again = true;

		_function: while (_again) {
			var name = _x2;
			_again = false;

			if (names.has(name)) {
				_x2 = '' + name + randomInt();
				_again = true;
				continue _function;
			} else {
				return name;
			}
		}
	};

	var NAME_TAKEN_ERROR = function NAME_TAKEN_ERROR(name) {
		return new Error('A provider with type ' + type + ' and name ' + name + ' has already been registered');
	};

	// Return the factory
	var decorator = function decorator(maybeT) {
		if (typeof maybeT === 'string') {
			if (names.has(maybeT)) {
				throw NAME_TAKEN_ERROR(maybeT);
			}

			return function (t) {
				_writers.providerWriter.set('type', type, t);
				_writers.providerWriter.set('name', maybeT, t);
				names.add(maybeT);
				(0, _strategy2['default'])(strategyType, t);
			};
		} else {
			var _name = createUniqueName(maybeT.name);
			_writers.providerWriter.set('type', type, maybeT);
			_writers.providerWriter.set('name', _name, maybeT);
			names.add(_name);
			(0, _strategy2['default'])(strategyType, maybeT);
		}
	};

	decorator.clearNameCache = function () {
		return names.clear();
	};

	return decorator;
};

module.exports = exports['default'];