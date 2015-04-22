'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _annotate = require('../util/annotate');

var _annotate2 = _interopRequireWildcard(_annotate);

var Transclude = function Transclude(t) {
	_annotate2['default'](t, '$component', {});
	_annotate2['default'](t.$component, 'transclude', true);
};
exports.Transclude = Transclude;