'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _annotate = require('../util/annotate');

var _annotate2 = _interopRequireWildcard(_annotate);

var _is = require('is-js');

var _is2 = _interopRequireWildcard(_is);

var Transclude = function Transclude(t) {
	if (_is2['default'].string(t)) {
		return function (realT) {
			_annotate2['default'](realT, '$component', {});
			_annotate2['default'](realT.$component, 'transclude', t);
		};
	} else {
		_annotate2['default'](t, '$component', {});
		_annotate2['default'](t.$component, 'transclude', true);
	}
};
exports.Transclude = Transclude;