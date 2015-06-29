import decorateDirective from '../../util/decorate-directive';
import parseSelector from '../../util/parse-selector';
import {providerWriter, componentWriter} from '../../writers';

const TYPE = 'directive';

export const Directive = config => t => {
	if(! config.selector )
	{
		throw new Error('Directive selector must be provided');
	}

	let {name, type} = parseSelector(config.selector);

	if(type === 'E')
	{
		throw new Error('Directives cannot be elements. Perhaps you meant to use @Component?');
	}

	providerWriter.set('name', name, t);
	providerWriter.set('type', TYPE, t);

	// Sensible defaults for attribute directives
	componentWriter.set('scope', false, t);
	componentWriter.set('restrict', type, )

	decorateDirective(config, t);	
}