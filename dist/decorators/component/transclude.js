'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _writers = require('../../writers');

var Transclude = function Transclude(maybeT) {
	if (typeof maybeT === 'string' || typeof maybeT === 'boolean') {
		return function (t) {
			return _writers.componentWriter.set('transclude', maybeT, t);
		};
	} else {
		_writers.componentWriter.set('transclude', true, maybeT);
	}
};
exports.Transclude = Transclude;