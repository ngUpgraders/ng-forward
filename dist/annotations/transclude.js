'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilAnnotate = require('../util/annotate');

var _utilAnnotate2 = _interopRequireDefault(_utilAnnotate);

var _isJs = require('is-js');

var _isJs2 = _interopRequireDefault(_isJs);

var Transclude = function Transclude(t) {
	if (_isJs2['default'].string(t)) {
		return function (realT) {
			(0, _utilAnnotate2['default'])(realT, '$component', {});
			(0, _utilAnnotate2['default'])(realT.$component, 'transclude', t);
		};
	} else {
		(0, _utilAnnotate2['default'])(t, '$component', {});
		(0, _utilAnnotate2['default'])(t.$component, 'transclude', true);
	}
};
exports.Transclude = Transclude;