'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _writers = require('../writers');

exports['default'] = function (type) {
	return function (maybeT) {
		if (typeof maybeT === 'string') {
			return function (t) {
				_writers.providerWriter.set('type', type, t);
				_writers.providerWriter.set('name', maybeT, t);
			};
		} else {
			_writers.providerWriter.set('type', type, maybeT);
			_writers.providerWriter.set('name', maybeT.name, maybeT);
		}
	};
};

module.exports = exports['default'];