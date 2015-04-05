import {ProviderParser} from './provider-parser';

export let Service = t => {
	t.$provider = t.$provider || {};

	t.$provider.name = Service.name;
	t.$provider.type = 'service';	
};

@ProviderParser('service')
function serviceParser(provider, module){
	module.service(provider.$provider.name, provider);
}