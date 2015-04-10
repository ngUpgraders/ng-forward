'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = annotate;

var _clone = require('clone');

var _clone2 = _interopRequireWildcard(_clone);

var _extend = require('extend');

var _extend2 = _interopRequireWildcard(_extend);

var _is = require('is-js');

var _is2 = _interopRequireWildcard(_is);

function install(obj, property, base) {
	obj[property] = obj[property] ? _clone2['default'](obj[property]) : base;
}

function annotate(obj, property) {
	var value = arguments[2] === undefined ? {} : arguments[2];

	if (_is2['default'].array(value)) {
		var _obj$property;

		install(obj, property, []);

		(_obj$property = obj[property]).push.apply(_obj$property, _toConsumableArray(value));
	} else if (_is2['default'].string(value)) {
		obj[property] = value;
	} else if (_is2['default'].fn(value)) {
		obj[property] = value;
	} else if (_is2['default'].object(value)) {
		install(obj, property, {});

		_extend2['default'](true, obj[property], value);
	}
}

module.exports = exports['default'];