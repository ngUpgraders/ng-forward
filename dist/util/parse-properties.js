'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
function checkBindingType(str) {
	return str.charAt(0) === '&' || str.charAt(0) === '=' || str.charAt(0) === '@';
}

exports['default'] = function (props) {
	var map = {};

	for (var i = 0; i < props.length; i++) {
		var split = props[i].split(':');

		for (var y = 0; y < split.length; y++) {
			split[y] = split[y].trim();
		}

		if (split.length === 1 && checkBindingType(split[0])) {
			var type = split[0].substr(0, 1);
			var prop = split[0].substr(1);
			map[prop] = type;
		} else if (split.length === 2 && checkBindingType(split[1])) {
			map[split[0]] = split[1];
		} else {
			throw new Error('Properties must be in the form of "propName: [&, @, =]attrName" or in the form of "[&, @, =]attrName"');
		}
	}

	return map;
};

module.exports = exports['default'];