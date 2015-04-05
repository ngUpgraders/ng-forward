import {ProviderParser} from './provider-parser';
import {parseComponentSelector} from '../util/parse-component-selector';

export let Decorator = options => t => {
	if(! options.selector ) throw new Error('Must provide a selector');
	let decoratorInfo = parseComponentSelector(options.selector);

	t.$component = t.$component || {};
	t.$provider = t.$provider || {};

	t.$provider.name = decoratorInfo.name;
	t.$provider.type = 'directive';
	t.$component.restrict = decoratorInfo.type;

	if(options.bind)
	{
		t.$component.bindToController = true;
		t.$component.scope = options.bind;
	}

	if(decoratorInfo.type === 'E')
	{
		throw new Error('Decorators cannot be elements. Perhaps you meant Component?');
	}
}