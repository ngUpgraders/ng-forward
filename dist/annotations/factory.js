'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _moduleModule = require('../module/module');

var _utilAnnotate = require('../util/annotate');

var _utilAnnotate2 = _interopRequireDefault(_utilAnnotate);

var type = 'factory';

var Factory = function Factory(name) {
	return function (t) {
		(0, _utilAnnotate2['default'])(t, '$provider', { name: name, type: type });
	};
};

exports.Factory = Factory;
_moduleModule.Module.registerProvider(type, function (provider, module) {
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