import Module from '../../module';
import {providerWriter} from '../../writers';
import parseSelector from '../../util/parse-selector';

const TYPE = 'animation';

export const Animation = className => {
	if(typeof className !== 'string')
	{
		throw new Error(`@Animation must be supplied with the name of a class: @Animation('.my-animation'`);
	}
	
	let {type} = parseSelector(className);

	if(type !== 'C')
	{
		throw new Error(`Invalid selector passed to @Animation: ${className} is not a class selector`);
	}

	return target => {

		providerWriter.set('type', TYPE, target);
		providerWriter.set('name', className, target);
	}
}

Module.addProvider(TYPE, (provider, name, injects, ngModule) => {
	ngModule.animation(name, [...injects, (...depends) => {
		return new provider(...depends);
	}]);
});