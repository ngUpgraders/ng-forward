import {Module} from '../module/module';

export function decorateDirective(t, name, type, binder){
	t.$component = t.$component || {};
	t.$provider = t.$provider || {};

	t.$provider.name = name;
	t.$provider.type = 'directive';

	if(binder)
	{
		t.$component.restrict = type;
		t.$component.bindToController = true;
		t.$component.scope = binder;
	}
}

Module.registerProvider('directive', (provider, module) => {
	let name = provider.$provider.name;
	let controller = provider;
	let component = controller.$component;
	delete controller.$component;
	delete controller.$provider;

	component.controllerAs = component.controllerAs || controller.name;
	component.controller = controller;
	component.link = controller.link || angular.noop;
	component.compile = controller.compile || angular.noop;

	console.log(component);

	module.directive(name, function(){
		return component;
	});
});