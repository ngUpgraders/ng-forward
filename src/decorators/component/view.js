import {componentWriter, appWriter} from '../../writers';

export const View = config => t => {
	if( typeof config !== 'object' || ( !config.templateUrl && !config.template ) || t === undefined )
	{
		throw new Error('Config object must be passed to the view decorator with either a view url or an inline template');
	}

	if(config.templateUrl)
	{
		if(componentWriter.has('template', t))
		{
			componentWriter.set('template', undefined, t);
		}

		componentWriter.set('templateUrl', config.templateUrl, t);
	}
	else if(config.template)
	{
		if(componentWriter.has('templateUrl', t))
		{
			componentWriter.set('templateUrl', undefined, t);
		}

		componentWriter.set('template', config.template, t);
	}

	if(config.directives){
		appWriter.set('directives', config.directives, t);
	}
}
