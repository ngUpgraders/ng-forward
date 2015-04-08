import {decorateDirective} from '../util/decorate-directive';
import {parseComponentSelector} from '../util/parse-component-selector';

export const Decorator = options => t => {
	if(! options.selector ) throw new Error('Must provide a selector');
	let info = parseComponentSelector(options.selector);

	decorateDirective(t, info.name, info.type, options.bind);

	if(info.type === 'E')
	{
		throw new Error('Decorators cannot be elements. Perhaps you meant Component?');
	}
}