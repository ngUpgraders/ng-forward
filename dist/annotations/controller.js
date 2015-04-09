'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Module = require('../module/module');

var _annotate = require('../util/annotate');

var _annotate2 = _interopRequireWildcard(_annotate);

var Controller = function Controller(t) {
	_annotate2['default'](t, '$provider', {
		name: t.name,
		type: 'controller'
	});
};

exports.Controller = Controller;
_Module.Module.registerProvider('controller', function (provider, module) {
	module.controller(provider.$provider.name, provider);
});