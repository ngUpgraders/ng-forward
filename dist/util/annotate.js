'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = annotate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _isJs = require('is-js');

var _isJs2 = _interopRequireDefault(_isJs);

function install(obj, property, base) {
	obj[property] = obj[property] ? (0, _clone2['default'])(obj[property]) : base;
}

function annotate(obj, property) {
	var value = arguments[2] === undefined ? {} : arguments[2];

	if (_isJs2['default'].array(value)) {
		var _obj$property;

		install(obj, property, []);

		(_obj$property = obj[property]).push.apply(_obj$property, _toConsumableArray(value));
	} else if (_isJs2['default'].string(value)) {
		obj[property] = value;
	} else if (_isJs2['default'].fn(value)) {
		obj[property] = value;
	} else if (_isJs2['default'].bool(value)) {
		obj[property] = value;
	} else if (_isJs2['default'].object(value)) {
		install(obj, property, {});

		(0, _extend2['default'])(true, obj[property], value);
	}
}

module.exports = exports['default'];