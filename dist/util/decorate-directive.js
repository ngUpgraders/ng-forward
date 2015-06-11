'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.decorateDirective = decorateDirective;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moduleModule = require('../module/module');

var _annotate = require('./annotate');

var _annotate2 = _interopRequireDefault(_annotate);

function decorateDirective(t, name, restrict, scope, controllerAs) {
	(0, _annotate2['default'])(t, '$provider', {
		name: name,
		type: 'directive'
	});

	(0, _annotate2['default'])(t, '$component', { restrict: restrict });

	if (scope) {
		(0, _annotate2['default'])(t, '$component', { bindToController: true });
		(0, _annotate2['default'])(t.$component, 'scope', scope);
	}

	if (controllerAs) {
		(0, _annotate2['default'])(t.$component, 'controllerAs', controllerAs);
	}
}

_moduleModule.Module.registerProvider('directive', function (provider, module) {
	var name = provider.$provider.name;
	var controller = provider;
	var component = controller.$component;
	delete controller.$component;

	component.controllerAs = component.controllerAs || controller.name;
	component.controller = controller;
	component.link = provider.link;
	component.compile = provider.compile;

	module.directive(name, function () {
		return component;
	});
});