import {Module} from '../module/module';

export let Service = t => {
	t.$provider = t.$provider || {};

	t.$provider.name = Service.name;
	t.$provider.type = 'service';	
};

Module.registerProvider('service', (provider, module) => {
	module.service(provider.$provider.name, provider);
});