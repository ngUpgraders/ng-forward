import {ProviderParser} from './provider-parser';

export function decorateDirective(t, name, type, binder){
	t.$component = t.$component || {};
	t.$provider = t.$provider || {};

	t.$provider.name = name;
	t.$provider.type = type;

	if(binder)
	{
		t.$component.bindToController = true;
		t.$component.scope = binder;
	}
}

@ProviderParser('directive')
function componentParser(provider, module){
	let name = provider.$provider.name;
	let controller = provider;
	let component = controller.$component;
	delete controller.$component;
	delete controller.$provider;

	component.controllerAs = component.controllerAs || controller.name;
	component.controller = controller;
	component.link = controller.link || angular.noop;
	component.compile = controller.compile || angular.noop;

	module.directive(name, function(){
		return component;
	});
}