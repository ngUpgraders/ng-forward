'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _annotate = require('../util/annotate');

var _annotate2 = _interopRequireWildcard(_annotate);

var _clone = require('clone');

var _clone2 = _interopRequireWildcard(_clone);

var Require = function Require() {
	for (var _len = arguments.length, components = Array(_len), _key = 0; _key < _len; _key++) {
		components[_key] = arguments[_key];
	}

	return function (t) {
		_annotate2['default'](t, '$component', {});
		_annotate2['default'](t.$component, 'require', components);
		_annotate2['default'](t, 'unpackRequires', function unpackRequires(resolved) {
			var unpacked = {};

			if (components.length > 1) {
				for (var i = 0; i < components.length; i++) {
					unpacked[name(components[i])] = resolved[i];
				}
			} else {
				unpacked[name(components[0])] = resolved;
			}

			return unpacked;
		});
	};
};

exports.Require = Require;
function name(component) {
	return component.replace(/(\?)/g, '').replace(/(\^)/g, '');
}