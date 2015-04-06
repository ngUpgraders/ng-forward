'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Module = require('../module/module');

var Service = (function (_Service) {
	function Service(_x) {
		return _Service.apply(this, arguments);
	}

	Service.toString = function () {
		return Service.toString();
	};

	return Service;
})(function (t) {
	t.$provider = t.$provider || {};

	t.$provider.name = Service.name;
	t.$provider.type = 'service';
});

exports.Service = Service;
_Module.Module.registerProvider('service', function (provider, module) {
	module.service(provider.$provider.name, provider);
});