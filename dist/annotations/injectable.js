'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Module = require('../module/module');

var _annotate = require('../util/annotate');

var _annotate2 = _interopRequireWildcard(_annotate);

var _each = require('foreach');

var _each2 = _interopRequireWildcard(_each);

var type = 'injectable';
var uid = 52;
var injectables = [];

var Injectable = (function (_Injectable) {
	function Injectable(_x) {
		return _Injectable.apply(this, arguments);
	}

	Injectable.toString = function () {
		return _Injectable.toString();
	};

	return Injectable;
})(function (t) {
	var name = '' + t.name + 'Injectable' + uid;
	++uid;

	_annotate2['default'](Injectable, '$provider', {
		uid: uid,
		type: type,
		name: name
	});

	injectables.push(name);
});

exports.Injectable = Injectable;
_Module.Module.registerProvider(type, function (provider, module) {
	function registerRequiredInjectables() {
		for (var _len = arguments.length, providers = Array(_len), _key = 0; _key < _len; _key++) {
			providers[_key] = arguments[_key];
		}

		_each2['default'](providers, function (provider) {
			module.service(provider.$provider.name, provider);
		});
	};
});