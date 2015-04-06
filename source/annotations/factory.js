import {Module} from '../module/module';

export let Factory = t => {
	t.$provider = t.$provider || {};

	t.$provider.name = `${t.name}Factory`;
	t.$provider.type = 'factory';
};


Module.registerProvider('factory', (provider, module) => {
	let create = provider.create || function(dependencies, ...params){
		return new provider(...dependencies, ...params);
	};

	function factory(...dependencies){
		return function(...parmas){
			return create(dependencies, ...params);
		}
	}

	factory.$inject = provider.$inject;

	module.factory(provider.$provider.name, factory);
});