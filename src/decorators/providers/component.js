import Module from '../../module';
import parseSelector from '../../util/parse-selector';
import decorateDirective from '../../util/decorate-directive';
import {providerWriter, componentWriter} from '../../writers';

const TYPE = 'directive';

export const Component = config => t => {
	if(! config.selector)
	{
		throw new Error('Component selector must be provided');
	}

	let {name, type:restrict} = parseSelector(config.selector);

	if(restrict !== 'E')
	{
		throw new Error('@Component selectors can only be elements. Perhaps you meant to use @Directive?');
	}

	providerWriter.set('name', name, t);
	providerWriter.set('type', TYPE, t);

	// Sensible defaults for components
	componentWriter.set('restrict', restrict, t);
	componentWriter.set('scope', {}, t);
	componentWriter.set('bindToController', true, t);
	componentWriter.set('controllerAs', name, t);

	decorateDirective(config, t);
};
