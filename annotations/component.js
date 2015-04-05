import {ProviderParser} from './provider-parser';
import {parseComponentSelector} from '../util/parse-component-selector';

export let Component = options => t => {
	if(! options.selector ) throw new Error('Must provide a selector')
	let componentInfo = parseComponentSelector(options.selector);

	t.$component = t.$component || {};
	t.$provider = t.$provider || {};

	t.$provider.name = componentInfo.name;
	t.$provider.type = 'component';
	t.$component.restrict = componentInfo.type;

	if(options.bind)
	{
		t.$component.bindToController = true;
		t.$component.scope = options.bind;
	}

	if(componentInfo.type !== 'E')
	{
		throw new Error('Components must be elements. Maybe you meant Decorator?');
	}
};

@ProviderParser('component')
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