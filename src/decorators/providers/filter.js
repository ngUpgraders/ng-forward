import Module from '../../module';
import decoratorFactory from '../../util/decorator-factory';

const TYPE = 'filter';

export const Filter = decoratorFactory(TYPE);

Module.registerProvider(TYPE, (provider, name, injects, ngModule) => {
	ngModule.filter(name, [...injects, (...dependencies) => {
		let filter = new provider(...dependencies);

		if(! filter.transform){
			throw new Error('Filters must implement a transform method');
		}

		return (input, ...params) => {
			if(filter.supports && ! filter.supports(input)){
				throw new Error(`Filter ${name} does not support ${input}`);
			}

			return filter.transform(input, ...params);
		}
	}]);
});