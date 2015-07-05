import Module from '../../module';
import decoratorFactory from '../../util/decorator-factory';

const TYPE = 'factory';

export const Factory = decoratorFactory(TYPE);

Module.addProvider(TYPE, (provider, name, injects, ngModule) => {
	let create = provider.create || function(dependencies, ...params){
		return new provider(...dependencies, ...params);
	};

	function factory(...dependencies){
		return function(...params){
			return create(dependencies, ...params);
		}
	}

	ngModule.factory(name, [...injects, factory]);
});