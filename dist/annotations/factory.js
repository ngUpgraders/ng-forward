'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _bind = Function.prototype.bind;

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Module = require('../module/module');

var _annotate = require('../util/annotate');

var _annotate2 = _interopRequireWildcard(_annotate);

var type = 'factory';

var Factory = function Factory(name) {
	return function (t) {
		_annotate2['default'](t, '$provider', { name: name, type: type });
	};
};

exports.Factory = Factory;
_Module.Module.registerProvider(type, function (provider, module) {
	var create = provider.create || function (dependencies) {
		for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			params[_key - 1] = arguments[_key];
		}

		return new (_bind.apply(provider, [null].concat(_toConsumableArray(dependencies), params)))();
	};

	function factory() {
		for (var _len2 = arguments.length, dependencies = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			dependencies[_key2] = arguments[_key2];
		}

		return function () {
			for (var _len3 = arguments.length, params = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				params[_key3] = arguments[_key3];
			}

			return create.apply(undefined, [dependencies].concat(params));
		};
	}

	factory.$inject = provider.$inject;

	module.factory(provider.$provider.name, factory);
});