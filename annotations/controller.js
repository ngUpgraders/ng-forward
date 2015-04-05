import {ProviderParser} from './provider-parser';

export function Controller(t){
	t.$provider = t.$provider || {};

	t.$provider.name = t.name;
	t.$provider.type = 'controller';
}

@ProviderParser('controller')
function controllerParser(provider, module){
	module.controller(provider.$provider.name, provider);
}