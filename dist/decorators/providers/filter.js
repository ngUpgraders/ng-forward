'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _module2 = require('../../module');

var _module3 = _interopRequireDefault(_module2);

var _utilDecoratorFactory = require('../../util/decorator-factory');

var _utilDecoratorFactory2 = _interopRequireDefault(_utilDecoratorFactory);

var TYPE = 'filter';

var Filter = (0, _utilDecoratorFactory2['default'])(TYPE);

exports.Filter = Filter;
_module3['default'].registerProvider(TYPE, function (provider, name, injects, ngModule) {
	ngModule.filter(name, [].concat(_toConsumableArray(injects), [function () {
		for (var _len = arguments.length, dependencies = Array(_len), _key = 0; _key < _len; _key++) {
			dependencies[_key] = arguments[_key];
		}

		var filter = new (_bind.apply(provider, [null].concat(dependencies)))();

		if (!filter.transform) {
			throw new Error('Filters must implement a transform method');
		}

		return function (input) {
			for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				params[_key2 - 1] = arguments[_key2];
			}

			if (filter.supports && !filter.supports(input)) {
				throw new Error('Filter ' + name + ' does not support ' + input);
			}

			return filter.transform.apply(filter, [input].concat(params));
		};
	}]));
});