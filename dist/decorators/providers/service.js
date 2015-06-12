'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _module2 = require('../../module');

var _module3 = _interopRequireDefault(_module2);

var _utilDecoratorFactory = require('../../util/decorator-factory');

var _utilDecoratorFactory2 = _interopRequireDefault(_utilDecoratorFactory);

var TYPE = 'service';

var Service = (0, _utilDecoratorFactory2['default'])(TYPE);

exports.Service = Service;
_module3['default'].registerProvider(TYPE, function (provider, name, injects, ngModule) {
	ngModule.service(name, [].concat(_toConsumableArray(injects), [provider]));
});