'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.Controller = Controller;

var _Module = require('../module/module');

function Controller(t) {
	t.$provider = t.$provider || {};

	t.$provider.name = t.name;
	t.$provider.type = 'controller';
}

_Module.Module.registerProvider('controller', function (provider, module) {
	module.controller(provider.$provider.name, provider);
});