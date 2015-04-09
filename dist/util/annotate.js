'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = annotate;

var _clone = require('clone');

var _clone2 = _interopRequireWildcard(_clone);

var _extend = require('extend');

var _extend2 = _interopRequireWildcard(_extend);

function annotate(obj, property) {
	var value = arguments[2] === undefined ? {} : arguments[2];

	obj[property] = obj[property] ? _clone2['default'](obj[property]) : {};

	_extend2['default'](true, obj[property], value);
}

module.exports = exports['default'];