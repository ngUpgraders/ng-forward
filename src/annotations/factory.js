import {Module} from '../module/module';

export const Factory = name => t => {
	t.$provider = t.$provider || {};

	t.$provider.name = name;
	t.$provider.type = 'factory';
};


Module.registerProvider('factory', (provider, module) => {
	let create = provider.create || function(dependencies, ...params){
		return new provider(...dependencies, ...params);
	};

	function factory(...dependencies){
		return function(...params){
			return create(dependencies, ...params);
		}
	}

	factory.$inject = provider.$inject;

	module.factory(provider.$provider.name, factory);
});