'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moduleModule = require('../module/module');

var _utilAnnotate = require('../util/annotate');

var _utilAnnotate2 = _interopRequireDefault(_utilAnnotate);

var Controller = function Controller(t) {
	(0, _utilAnnotate2['default'])(t, '$provider', {
		name: t.name,
		type: 'controller'
	});
};

exports.Controller = Controller;
_moduleModule.Module.registerProvider('controller', function (provider, module) {
	module.controller(provider.$provider.name, provider);
});