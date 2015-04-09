'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _clone = require('clone');

var _clone2 = _interopRequireWildcard(_clone);

var Inject = function Inject() {
	for (var _len = arguments.length, dependencies = Array(_len), _key = 0; _key < _len; _key++) {
		dependencies[_key] = arguments[_key];
	}

	return function (t) {
		var _t$$inject;

		t.$inject = t.$inject ? _clone2['default'](t.$inject) : [];

		(_t$$inject = t.$inject).push.apply(_t$$inject, dependencies);
	};
};
exports.Inject = Inject;