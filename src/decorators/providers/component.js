import parseSelector from '../../util/parse-selector';
import decorateDirective from '../../util/decorate-directive';
import {providerWriter, componentWriter, appWriter} from '../../writers';

const TYPE = 'directive';

export const Component = config => t => {
	if( !config.selector )
	{
		throw new Error('Component selector must be provided');
	}

	let {name, type: restrict} = parseSelector(config.selector);

	if(restrict !== 'E')
	{
		throw new Error('@Component selectors can only be elements. Perhaps you meant to use @Directive?');
	}

	providerWriter.set('name', name, t);
	providerWriter.set('type', TYPE, t);
	appWriter.set('selector', config.selector, t);

	let viewInjector = config.viewInjector || [];
	let modules = [];
	let providers = [];
	viewInjector.forEach(injectable => {
		if(typeof injectable === 'string')
		{
			modules.push(injectable);
		}
		else if(providerWriter.has('type', injectable))
		{
			providers.push(injectable);
		}
		else
		{
			throw new Error(`Unknown view injectable in ${config.selector}`);
		}
	});

	appWriter.set('modules', modules, t);
	appWriter.set('providers', providers, t);

	// Sensible defaults for components
	if( !componentWriter.has('restrict', t) )
	{
		componentWriter.set('restrict', restrict, t);
	}
	if( !componentWriter.has('scope', t) )
	{
		componentWriter.set('scope', {}, t);
	}
	if( !componentWriter.has('bindToController', t) )
	{
		componentWriter.set('bindToController', true, t);
	}

	componentWriter.set('controllerAs', name, t);

	decorateDirective(config, t);
};
