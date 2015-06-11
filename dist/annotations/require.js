'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilAnnotate = require('../util/annotate');

var _utilAnnotate2 = _interopRequireDefault(_utilAnnotate);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

var Require = function Require() {
	for (var _len = arguments.length, components = Array(_len), _key = 0; _key < _len; _key++) {
		components[_key] = arguments[_key];
	}

	return function (t) {
		(0, _utilAnnotate2['default'])(t, '$component', {});
		(0, _utilAnnotate2['default'])(t.$component, 'require', components);
		(0, _utilAnnotate2['default'])(t, 'unpackRequires', function unpackRequires(resolved) {
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