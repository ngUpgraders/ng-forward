'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var Require = function Require() {
	for (var _len = arguments.length, components = Array(_len), _key = 0; _key < _len; _key++) {
		components[_key] = arguments[_key];
	}

	return function (t) {
		t.$component = t.$component || {};

		t.$component.require = components;

		t.unpackRequires = function (resolved) {
			var unpacked = {};

			if (components.length > 1) {
				for (var i = 0; i < components.length; i++) {
					unpacked[name(components[i])] = resolved[i];
				}
			} else {
				unpacked[name(components[0])] = resolved;
			}

			return unpacked;
		};
	};
};

exports.Require = Require;
function name(component) {
	return component.replace(/(\?)/g, '').replace(/(\^)/g, '');
}