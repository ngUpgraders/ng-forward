'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

exports['default'] = function (props) {
	var map = {};

	for (var i = 0; i < props.length; i++) {
		var split = props[i].split(':');

		for (var y = 0; y < split.length; y++) {
			split[y] = split[y].trim();
		}

		if (split.length === 1) {
			map[split[0]] = split[0];
		} else if (split.length === 2) {
			map[split[0]] = split[1];
		} else {
			throw new Error('Properties must be in the form of "propName: attrName" or in the form of "attrName"');
		}
	}

	return map;
};

module.exports = exports['default'];