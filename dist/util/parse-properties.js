'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var ALLOWED_SYMBOLS = ['&', '=', '@', '=', '*', '?'];

function checkBindingType(str) {
	return ALLOWED_SYMBOLS.indexOf(str.charAt(0)) !== -1;
}

function parseProperty(str) {
	var symbols = [];

	function getName(_x) {
		var _again = true;

		_function: while (_again) {
			var input = _x;
			_again = false;

			if (checkBindingType(input.join(''))) {
				symbols.push(input.shift());
				_x = input;
				_again = true;
				continue _function;
			}

			return input;
		}
	}

	var name = getName(str.split(''));

	return { name: name.join(''), symbols: symbols.join('') };
}

exports['default'] = function (props) {
	var map = {};

	for (var i = 0; i < props.length; i++) {
		var split = props[i].split(':');

		for (var y = 0; y < split.length; y++) {
			split[y] = split[y].trim();
		}

		if (split.length === 1 && checkBindingType(split[0])) {
			var _parseProperty = parseProperty(split[0]);

			var _name = _parseProperty.name;
			var symbols = _parseProperty.symbols;

			map[_name] = symbols;
		} else if (split.length === 2 && checkBindingType(split[1])) {
			map[split[0]] = split[1];
		} else {
			throw new Error('Properties must be in the form of "propName: [&, @, =, =*, =?, =*?]attrName" or in the form of "[&, @, =, =*, =?, =*?]attrName"');
		}
	}

	return map;
};

module.exports = exports['default'];