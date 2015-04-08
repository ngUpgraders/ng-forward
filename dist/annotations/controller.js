'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Module = require('../module/module');

var Controller = function Controller(t) {
	t.$provider = t.$provider || {};

	t.$provider.name = t.name;
	t.$provider.type = 'controller';
};

exports.Controller = Controller;
_Module.Module.registerProvider('controller', function (provider, module) {
	module.controller(provider.$provider.name, provider);
});