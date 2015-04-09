import {Module} from '../module/module';
import annotate from '../util/annotate';

const type = 'factory';

export const Factory = name => t => {
	annotate(t, '$provider', { name, type });
};


Module.registerProvider(type, (provider, module) => {
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