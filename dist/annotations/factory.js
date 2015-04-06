'use strict';

var _bind = Function.prototype.bind;

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Module = require('../module/module');

var Factory = function Factory(t) {
	t.$provider = t.$provider || {};

	t.$provider.name = '' + t.name + 'Factory';
	t.$provider.type = 'factory';
};

exports.Factory = Factory;
_Module.Module.registerProvider('factory', function (provider, module) {
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
			for (var _len3 = arguments.length, parmas = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				parmas[_key3] = arguments[_key3];
			}

			return create.apply(undefined, [dependencies].concat(_toConsumableArray(params)));
		};
	}

	factory.$inject = provider.$inject;

	module.factory(provider.$provider.name, factory);
});