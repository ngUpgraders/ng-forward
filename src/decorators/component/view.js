import {componentWriter} from '../../writers';

export const View = config => t => {
	if( typeof config !== 'object' || ( !config.url && !config.template ) || t === undefined )
	{
		throw new Error('Config object must be passed to the view decorator with either a view url or an inline template');
	}

	if(config.url)
	{
		if(componentWriter.has('template', t))
		{
			componentWriter.delete('template', t);
		}

		componentWriter.set('templateUrl', config.url, t);
	}
	else if(config.template)
	{
		if(componentWriter.has('templateUrl', t))
		{
			componentWriter.delete('templateUrl', t);
		}

		componentWriter.set('template', config.template, t);
	}
}
