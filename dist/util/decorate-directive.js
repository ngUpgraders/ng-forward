'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.decorateDirective = decorateDirective;

var _Module = require('../module/module');

var _annotate = require('./annotate');

var _annotate2 = _interopRequireWildcard(_annotate);

function decorateDirective(t, name, restrict, scope) {
	_annotate2['default'](t, '$provider', {
		name: name,
		type: 'directive'
	});

	_annotate2['default'](t, '$component', { restrict: restrict });

	if (scope) {
		_annotate2['default'](t, '$component', { bindToController: true });
		_annotate2['default'](t.$component, 'scope', scope);
	}
}

_Module.Module.registerProvider('directive', function (provider, module) {
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