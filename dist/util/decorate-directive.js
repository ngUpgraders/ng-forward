'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.decorateDirective = decorateDirective;

var _Module = require('../module/module');

function decorateDirective(t, name, type, binder) {
	t.$component = t.$component || {};
	t.$provider = t.$provider || {};

	t.$provider.name = name;
	t.$provider.type = 'directive';
	t.$component.restrict = type;

	if (binder) {
		t.$component.bindToController = true;
		t.$component.scope = t.$component.scope || {};

		for (var bind in binder) {
			t.$component.scope[bind] = binder[bind];
		}
	}
}

_Module.Module.registerProvider('directive', function (provider, module) {
	var name = provider.$provider.name;
	var controller = provider;
	var component = controller.$component;
	delete controller.$component;
	delete controller.$provider;

	component.controllerAs = component.controllerAs || controller.name;
	component.controller = controller;
	component.link = controller.link || function () {};
	component.compile = controller.compile || function () {};

	module.directive(name, function () {
		return component;
	});
});