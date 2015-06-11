'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

var _utilAnnotate = require('../util/annotate');

var _utilAnnotate2 = _interopRequireDefault(_utilAnnotate);

var Inject = function Inject() {
	for (var _len = arguments.length, dependencies = Array(_len), _key = 0; _key < _len; _key++) {
		dependencies[_key] = arguments[_key];
	}

	return function (t) {
		(0, _utilAnnotate2['default'])(t, '$inject', dependencies);
	};
};
exports.Inject = Inject;